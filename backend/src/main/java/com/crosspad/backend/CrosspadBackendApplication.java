package com.crosspad.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.File;
import java.nio.file.Files;
import java.util.List;

@SpringBootApplication
public class CrosspadBackendApplication {

	public static void main(String[] args) {

		// 🌟 [.env 파일 직접 인입 치트키]
		// 플러그인 버그를 우회하기 위해, 자바 프로세스가 시작되자마자 .env 파일을 직접 읽어 시스템 변수에 꽂아버립니다.
		try {
			File envFile = new File(".env");
			if (envFile.exists()) {
				List<String> lines = Files.readAllLines(envFile.toPath());
				for (String line : lines) {
					String trimmed = line.trim();
					// 빈 줄이거나 주석(#)이면 패스
					if (trimmed.isEmpty() || trimmed.startsWith("#")) continue;

					// KEY=VALUE 형태로 쪼개기
					String[] parts = trimmed.split("=", 2);
					if (parts.length == 2) {
						String key = parts[0].trim();
						String value = parts[1].trim();
						// 시스템 프로퍼티에 등록하여 application.yaml에서 ${}로 읽을 수 있게 만듭니다.
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