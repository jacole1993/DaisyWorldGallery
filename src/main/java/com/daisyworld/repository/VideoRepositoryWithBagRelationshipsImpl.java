package com.daisyworld.repository;

import com.daisyworld.domain.Video;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class VideoRepositoryWithBagRelationshipsImpl implements VideoRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Video> fetchBagRelationships(Optional<Video> video) {
        return video.map(this::fetchAlbums);
    }

    @Override
    public Page<Video> fetchBagRelationships(Page<Video> videos) {
        return new PageImpl<>(fetchBagRelationships(videos.getContent()), videos.getPageable(), videos.getTotalElements());
    }

    @Override
    public List<Video> fetchBagRelationships(List<Video> videos) {
        return Optional.of(videos).map(this::fetchAlbums).orElse(Collections.emptyList());
    }

    Video fetchAlbums(Video result) {
        return entityManager
            .createQuery("select video from Video video left join fetch video.albums where video is :video", Video.class)
            .setParameter("video", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Video> fetchAlbums(List<Video> videos) {
        return entityManager
            .createQuery("select distinct video from Video video left join fetch video.albums where video in :videos", Video.class)
            .setParameter("videos", videos)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
