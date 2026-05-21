package com.crosspad.backend.domain.game.utils;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Component
public class DeepLTranslator {

    // 💡 static을 제거하여 스프링이 객체를 만들 때 무조건 동기화되도록 만듭니다.
    @Value("${deepl.api.key}")
    private String apiKey;

    // 💡 static을 제거하여 일반 인스턴스 메서드로 변경합니다.
    public String translate(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "등록된 상세 줄거리 정보가 없습니다.";
        }

        if (apiKey == null || apiKey.isEmpty()) {
            System.err.println("⚠️ DeepL API Key가 설정되지 않았습니다. 영어 원문을 반환합니다.");
            return text;
        }

        String targetUrl = "https://api-free.deepl.com/v2/translate";

        try {
            URL url = new URL(targetUrl);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Authorization", "DeepL-Auth-Key " + apiKey);
            con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            con.setDoOutput(true);

            JSONObject requestBody = new JSONObject();
            JSONArray textArray = new JSONArray();
            textArray.put(text);

            requestBody.put("text", textArray);
            requestBody.put("target_lang", "KO");

            try (OutputStream os = con.getOutputStream()) {
                byte[] input = requestBody.toString().getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int responseCode = con.getResponseCode();
            if (responseCode != 200) {
                BufferedReader errorIn = new BufferedReader(new InputStreamReader(con.getErrorStream(), StandardCharsets.UTF_8));
                String errorLine;
                StringBuilder errorResponse = new StringBuilder();
                while ((errorLine = errorIn.readLine()) != null) {
                    errorResponse.append(errorLine);
                }
                errorIn.close();
                System.err.println("❌ DeepL API 서버 에러 응답 (" + responseCode + "): " + errorResponse.toString());
                return text;
            }

            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            JSONObject jsonResponse = new JSONObject(response.toString());
            JSONArray translations = jsonResponse.getJSONArray("translations");

            return translations.getJSONObject(0).getString("text");

        } catch (Exception e) {
            System.err.println("❌ DeepL 정식 번역 실패 원인 추적: ");
            e.printStackTrace();
            return text;
        }
    }
}