package org.example.distr.dto.response;

import java.math.BigDecimal;

public record RoyaltyResponse(
    Long royaltyId,
    BigDecimal amount,
    Long songId,
    String songTitle,
    Long platformId,
    String platformName) {
}
