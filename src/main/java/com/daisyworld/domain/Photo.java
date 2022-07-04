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
 * A Photo.
 */
@Entity
@Table(name = "photo")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Photo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "image_name", nullable = false)
    private String imageName;

    @Lob
    @Column(name = "image", nullable = false)
    private byte[] image;

    @NotNull
    @Column(name = "image_content_type", nullable = false)
    private String imageContentType;

    @Column(name = "date_taken")
    private LocalDate dateTaken;

    @Column(name = "is_mom_in_picture")
    private Boolean isMomInPicture;

    @Column(name = "is_dad_in_picture")
    private Boolean isDadInPicture;

    @Column(name = "is_family_in_picture")
    private Boolean isFamilyInPicture;

    @ManyToMany
    @JoinTable(name = "rel_photo__album", joinColumns = @JoinColumn(name = "photo_id"), inverseJoinColumns = @JoinColumn(name = "album_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "photos", "videos" }, allowSetters = true)
    private Set<Album> albums = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Photo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageName() {
        return this.imageName;
    }

    public Photo imageName(String imageName) {
        this.setImageName(imageName);
        return this;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Photo image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Photo imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public LocalDate getDateTaken() {
        return this.dateTaken;
    }

    public Photo dateTaken(LocalDate dateTaken) {
        this.setDateTaken(dateTaken);
        return this;
    }

    public void setDateTaken(LocalDate dateTaken) {
        this.dateTaken = dateTaken;
    }

    public Boolean getIsMomInPicture() {
        return this.isMomInPicture;
    }

    public Photo isMomInPicture(Boolean isMomInPicture) {
        this.setIsMomInPicture(isMomInPicture);
        return this;
    }

    public void setIsMomInPicture(Boolean isMomInPicture) {
        this.isMomInPicture = isMomInPicture;
    }

    public Boolean getIsDadInPicture() {
        return this.isDadInPicture;
    }

    public Photo isDadInPicture(Boolean isDadInPicture) {
        this.setIsDadInPicture(isDadInPicture);
        return this;
    }

    public void setIsDadInPicture(Boolean isDadInPicture) {
        this.isDadInPicture = isDadInPicture;
    }

    public Boolean getIsFamilyInPicture() {
        return this.isFamilyInPicture;
    }

    public Photo isFamilyInPicture(Boolean isFamilyInPicture) {
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

    public Photo albums(Set<Album> albums) {
        this.setAlbums(albums);
        return this;
    }

    public Photo addAlbum(Album album) {
        this.albums.add(album);
        album.getPhotos().add(this);
        return this;
    }

    public Photo removeAlbum(Album album) {
        this.albums.remove(album);
        album.getPhotos().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Photo)) {
            return false;
        }
        return id != null && id.equals(((Photo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Photo{" +
            "id=" + getId() +
            ", imageName='" + getImageName() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", dateTaken='" + getDateTaken() + "'" +
            ", isMomInPicture='" + getIsMomInPicture() + "'" +
            ", isDadInPicture='" + getIsDadInPicture() + "'" +
            ", isFamilyInPicture='" + getIsFamilyInPicture() + "'" +
            "}";
    }
}
