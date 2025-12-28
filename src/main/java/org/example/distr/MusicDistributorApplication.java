package org.example.distr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "org.example.distr")
public class MusicDistributorApplication {
    public static void main(String[] args) {
        SpringApplication.run(MusicDistributorApplication.class, args);
    }
}