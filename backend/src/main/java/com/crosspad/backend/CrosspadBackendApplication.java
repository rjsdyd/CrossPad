package com.crosspad.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.File;
import java.nio.file.Files;
import java.util.List;

@SpringBootApplication
public class CrosspadBackendApplication {

	public static void main(String[] args) {

		try {
			File envFile = new File(".env");
			if (envFile.exists()) {
				List<String> lines = Files.readAllLines(envFile.toPath());
				for (String line : lines) {
					String trimmed = line.trim();
					if (trimmed.isEmpty() || trimmed.startsWith("#")) continue;

					String[] parts = trimmed.split("=", 2);
					if (parts.length == 2) {
						String key = parts[0].trim();
						String value = parts[1].trim();
						System.setProperty(key, value);
					}
				}
				System.out.println("✅ [.env 로더] .env 파일의 모든 환경변수를 성공적으로 자바 메모리에 주입했습니다!");
			} else {
				System.err.println("⚠️ [.env 로더] 프로젝트 루트에서 .env 파일을 찾을 수 없습니다.");
			}
		} catch (Exception e) {
			System.err.println("❌ [.env 로더] .env 파일을 읽는 중 에러 발생: " + e.getMessage());
		}

		SpringApplication.run(CrosspadBackendApplication.class, args);
	}
}