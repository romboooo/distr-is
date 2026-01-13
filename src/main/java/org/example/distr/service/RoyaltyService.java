package org.example.distr.service;

import lombok.RequiredArgsConstructor;
import org.example.distr.dto.response.PageResponse;
import org.example.distr.dto.response.RoyaltyResponse;
import org.example.distr.repository.RoyaltyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoyaltyService {

  private final RoyaltyRepository royaltyRepository;
  private final ReleaseService releaseService;

  @Transactional(readOnly = true)
  public PageResponse<RoyaltyResponse> getRoyaltiesByReleaseId(
      Long releaseId,
      int pageNumber,
      int pageSize) {
    // Validate release exists first
    releaseService.getRelease(releaseId);

    Pageable pageable = PageRequest.of(pageNumber, pageSize);
    Page<RoyaltyResponse> royaltyPage = royaltyRepository.findRoyaltiesByReleaseId(
        releaseId,
        pageable);

    PageResponse<RoyaltyResponse> response = new PageResponse<>();
    response.setContent(royaltyPage.getContent());
    response.setCurrentPage(royaltyPage.getNumber());
    response.setTotalPages(royaltyPage.getTotalPages());
    response.setTotalElements(royaltyPage.getTotalElements());
    response.setPageSize(royaltyPage.getSize());

    return response;
  }
}
