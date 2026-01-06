package com.korit.trip_planner_back.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPIConfig() {
        OpenAPI openAPI = new OpenAPI();

        // 여우 API 기본 정보
        Info info = new Info();
        info.title("여우 API");
        info.version("v1.0.0");
        info.description("여행의 우선순위 - AI 여행 일정 최적화 서비스");

        Contact contact = new Contact();
        contact.name("여우 팀");
        contact.email("kms0317mc@gmail.com");
        info.contact(contact);

        return openAPI
                .info(info);
    }
}
