package com.ssafy.archiview.entity;

import com.ssafy.archiview.dto.user.UserDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.domain.Persistable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Getter
@DynamicInsert
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User implements Persistable<String> {
    @Id
    @Column(name = "id", length = 16)
    private String id;

    @NotNull
    @Column(name = "pw", length = 64)
    private String pw;

    @NotNull
    @Column(name = "name", length = 32)
    private String name;

    @NotNull
    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "profile_url")
    private String profileUrl;

    @Column(name = "introduce", columnDefinition = "TEXT")
    private String introduce;

    @Column(name = "role")
    @ColumnDefault("'ROLE_USER'")
    @Enumerated(EnumType.STRING)
    private Role role;  // 권한

    @Column(name = "isAuth")
    @ColumnDefault("0")
    private boolean isAuth;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;  // 생성 날짜

    @Builder
    public User(String id, String pw, String name, String email, String profileUrl, String introduce, Role role, LocalDateTime createdAt) {
        this.id = id;
        this.pw = pw;
        this.name = name;
        this.email = email;
        this.profileUrl = profileUrl;
        this.introduce = introduce;
        this.role = role;
        this.createdAt = createdAt;
    }

    public void updatePassword(String pw){
        this.pw = pw;
    }
    public void updateUserDetail(String profileUrl, String introduce){
        this.profileUrl = profileUrl;
        this.introduce = introduce;
    }

    public void updateUserAuth(boolean isAuth) {
        this.isAuth = isAuth;
    }

    public void updateUserRole(Role role) {
        this.role = role;
    }

    public void blockUser() {
        this.role = Role.ROLE_BLOCK;
    }

    @Override
    public boolean isNew() {
        return this.createdAt == null;
    }

    public UserDto.logoutDto toLogoutDto(){
        return UserDto.logoutDto.builder()
                .id(id)
                .email(email)
                .name(name)
                .introduce(introduce)
                .profileUrl(profileUrl)
                .role(role)
                .build();
    }

    public UserDto.DetailResponseDto toDetailResponseDto() {
        return UserDto.DetailResponseDto.builder()
                .id(id)
                .email(email)
                .name(name)
                .introduce(introduce)
                .profileUrl(profileUrl)
                .role(role)
                .isAuth(isAuth)
                .build();
    }
}
