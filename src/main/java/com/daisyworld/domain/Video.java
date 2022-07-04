package com.daisyworld.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Video.
 */
@Entity
@Table(name = "video")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Video implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "video_name", nullable = false)
    private String videoName;

    @Lob
    @Column(name = "video", nullable = false)
    private byte[] video;

    @NotNull
    @Column(name = "video_content_type", nullable = false)
    private String videoContentType;

    @Column(name = "date_taken")
    private LocalDate dateTaken;

    @Column(name = "is_mom_in_picture")
    private Boolean isMomInPicture;

    @Column(name = "is_dad_in_picture")
    private Boolean isDadInPicture;

    @Column(name = "is_family_in_picture")
    private Boolean isFamilyInPicture;

    @ManyToMany
    @JoinTable(name = "rel_video__album", joinColumns = @JoinColumn(name = "video_id"), inverseJoinColumns = @JoinColumn(name = "album_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "photos", "videos" }, allowSetters = true)
    private Set<Album> albums = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Video id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVideoName() {
        return this.videoName;
    }

    public Video videoName(String videoName) {
        this.setVideoName(videoName);
        return this;
    }

    public void setVideoName(String videoName) {
        this.videoName = videoName;
    }

    public byte[] getVideo() {
        return this.video;
    }

    public Video video(byte[] video) {
        this.setVideo(video);
        return this;
    }

    public void setVideo(byte[] video) {
        this.video = video;
    }

    public String getVideoContentType() {
        return this.videoContentType;
    }

    public Video videoContentType(String videoContentType) {
        this.videoContentType = videoContentType;
        return this;
    }

    public void setVideoContentType(String videoContentType) {
        this.videoContentType = videoContentType;
    }

    public LocalDate getDateTaken() {
        return this.dateTaken;
    }

    public Video dateTaken(LocalDate dateTaken) {
        this.setDateTaken(dateTaken);
        return this;
    }

    public void setDateTaken(LocalDate dateTaken) {
        this.dateTaken = dateTaken;
    }

    public Boolean getIsMomInPicture() {
        return this.isMomInPicture;
    }

    public Video isMomInPicture(Boolean isMomInPicture) {
        this.setIsMomInPicture(isMomInPicture);
        return this;
    }

    public void setIsMomInPicture(Boolean isMomInPicture) {
        this.isMomInPicture = isMomInPicture;
    }

    public Boolean getIsDadInPicture() {
        return this.isDadInPicture;
    }

    public Video isDadInPicture(Boolean isDadInPicture) {
        this.setIsDadInPicture(isDadInPicture);
        return this;
    }

    public void setIsDadInPicture(Boolean isDadInPicture) {
        this.isDadInPicture = isDadInPicture;
    }

    public Boolean getIsFamilyInPicture() {
        return this.isFamilyInPicture;
    }

    public Video isFamilyInPicture(Boolean isFamilyInPicture) {
        this.setIsFamilyInPicture(isFamilyInPicture);
        return this;
    }

    public void setIsFamilyInPicture(Boolean isFamilyInPicture) {
        this.isFamilyInPicture = isFamilyInPicture;
    }

    public Set<Album> getAlbums() {
        return this.albums;
    }

    public void setAlbums(Set<Album> albums) {
        this.albums = albums;
    }

    public Video albums(Set<Album> albums) {
        this.setAlbums(albums);
        return this;
    }

    public Video addAlbum(Album album) {
        this.albums.add(album);
        album.getVideos().add(this);
        return this;
    }

    public Video removeAlbum(Album album) {
        this.albums.remove(album);
        album.getVideos().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Video)) {
            return false;
        }
        return id != null && id.equals(((Video) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Video{" +
            "id=" + getId() +
            ", videoName='" + getVideoName() + "'" +
            ", video='" + getVideo() + "'" +
            ", videoContentType='" + getVideoContentType() + "'" +
            ", dateTaken='" + getDateTaken() + "'" +
            ", isMomInPicture='" + getIsMomInPicture() + "'" +
            ", isDadInPicture='" + getIsDadInPicture() + "'" +
            ", isFamilyInPicture='" + getIsFamilyInPicture() + "'" +
            "}";
    }
}
