package com.ssafy.archiview.signalingserver.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

@RestController
@RequestMapping("/api/files")
public class FileController {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    /**
     *  @Name              streamVideo
     *  @Method            GET
     *  @End-Point         /api/files/recording/{sessionId}
     *  @param sessionId   ses_FPOx25ZwAA 와 같이 세션의 ID 값을 PathVariable 로 전달받는다.
     *  @return Resource   해당하는 영상을 Resource 형태로 반환한다.
     **/
    @GetMapping(path = "/recording/{sessionId}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public Resource streamVideo(@PathVariable String sessionId) throws IOException {
        logger.info("FileController -> streamVideo | sessionId: " + sessionId);

        return new ByteArrayResource((FileCopyUtils.copyToByteArray(new FileInputStream(
                "/opt/openvidu/recordings/" + sessionId + "/" + sessionId + ".mp4"
        ))));
    }

    /**
     *  @Name              downloadThumbnailImage
     *  @Method            GET
     *  @End-Point         /api/files/thumbnail/{sessionId}
     *  @param sessionId   ses_FPOx25ZwAA 와 같이 세션의 ID 값을 PathVariable 로 전달받는다.
     *  @return Resource   해당하는 영상의 썸네일을 Resource 형태로 반환한다.
     **/
    @GetMapping(path = "/thumbnail/{sessionId}")
    public Resource downloadThumbnailImage(@PathVariable String sessionId) throws IOException {
        logger.info("FileController -> downloadThumbnailImage | sessionId: " + sessionId);

        try {
            return new ByteArrayResource((FileCopyUtils.copyToByteArray(new FileInputStream(
                    "/opt/openvidu/recordings/" + sessionId + "/" + sessionId + ".jpg"
            ))));
        } catch (Exception e) {
            return new ByteArrayResource((FileCopyUtils.copyToByteArray(new FileInputStream(
                    "/opt/openvidu/recordings/thumbnail_default.png"
            ))));
        }
    }

    /**
     *  @Name              uploadProfileImage
     *  @Method            POST
     *  @End-Point         /api/files/profile/{userId}
     *  @param userId      user 의 id 값을 전달받는다. 이는 저장될 파일의 이름으로 사용된다.
     *  @param img         저장하고자 하는 이미지 파일을 MultipartFile 형태로 전달받는다.
     *  @return Response   프로필 이미지 업로드의 성공, 실패 여부를 메시지와 함께 반환한다.
     **/
    @PostMapping("/profile/{userId}")
    public ResponseEntity<?> uploadProfileImage(@PathVariable String userId, @RequestParam("img") MultipartFile img ) throws IOException {
        logger.info("FileController -> uploadProfileImage | userId: " + userId);

        File file = new File("/opt/openvidu/profiles/" + userId);

        if (file.createNewFile())
            logger.warn("New Profile Img Created: " + file.getPath());

        img.transferTo(file);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /**
     *  @Name              downloadThumbnailImage
     *  @Method            GET
     *  @End-Point         /api/files/profile/{userId}
     *  @param  userId     user 의 id 값을 전달받는다. 이는 저장된 파일을 탐색하기 위해 사용된다.
     *  @return Resource   해당하는 user 의 프로필 이미지를 Resource 형태로 반환한다.
     **/
    @GetMapping(path = "/profile/{userId}")
    public Resource downloadProfileImage(@PathVariable String userId) throws IOException {
        logger.info("FileController -> downloadProfileImage | userId: " + userId);

        try {
            return new ByteArrayResource((FileCopyUtils.copyToByteArray(new FileInputStream(
                    "/opt/openvidu/profiles/" + userId
            ))));
        } catch (FileNotFoundException e) {
            return new ByteArrayResource((FileCopyUtils.copyToByteArray(new FileInputStream(
                    "/opt/openvidu/profiles/default"
            ))));
        }
    }
}
