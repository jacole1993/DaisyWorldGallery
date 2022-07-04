package com.daisyworld.repository;

import com.daisyworld.domain.Video;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface VideoRepositoryWithBagRelationships {
    Optional<Video> fetchBagRelationships(Optional<Video> video);

    List<Video> fetchBagRelationships(List<Video> videos);

    Page<Video> fetchBagRelationships(Page<Video> videos);
}
