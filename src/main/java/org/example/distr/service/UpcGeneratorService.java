package org.example.distr.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpcGeneratorService {
    private static final long MIN_UPC = 1_000_000_000_000L; // 13-digit minimum
    private static final long MAX_UPC = 9_999_999_999_999L; // 13-digit maximum

    public Long generateUpc() {
        return MIN_UPC + System.currentTimeMillis() % (MAX_UPC - MIN_UPC);
    }

}
