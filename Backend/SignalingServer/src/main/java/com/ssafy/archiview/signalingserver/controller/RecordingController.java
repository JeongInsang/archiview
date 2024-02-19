package com.ssafy.archiview.signalingserver.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/recording")
public class RecordingController {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;
    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;
    private OpenVidu openVidu;

    private final Map<String, Session> mapSessions = new ConcurrentHashMap<>();
    private final Map<String, Map<String, OpenViduRole>> mapSessionNamesTokens = new ConcurrentHashMap<>();

    // sessionRecordings 는 녹화 세션에 관련된 옵션을 저장하고 있으나,
    // 이 옵션을 사용하는 부분은 튜토리얼 코드에 존재하지 않는다.
    // 24.01.19(금) 까지는 없어도 무방한 코드로 보인다.
    private final Map<String, Boolean> sessionRecordings = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        logger.warn("OPENVIDU_URL: " + OPENVIDU_URL);
        this.openVidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    @PostMapping("/get-token")
    public ResponseEntity<JsonObject> getToken(@RequestBody Map<String, Object> sessionNameParam) {
        logger.info("RecordingController -> getToken |" + sessionNameParam);
        String sessionName = (String)sessionNameParam.get("sessionName");
        OpenViduRole role = OpenViduRole.PUBLISHER;
        ConnectionProperties connectionProperties = new ConnectionProperties.Builder().type(ConnectionType.WEBRTC)
                .role(role).data("user_data").build();

        JsonObject responseJson = new JsonObject();
        // 기존 세션
        if (this.mapSessions.get(sessionName) != null) {
            logger.info("Existing session " + sessionName);
            try {
                String token = this.mapSessions.get(sessionName).createConnection(connectionProperties).getToken();
                this.mapSessionNamesTokens.get(sessionName).put(token, role);
                responseJson.addProperty("0", token);

                return new ResponseEntity<>(responseJson, HttpStatus.OK);
            } catch (OpenViduJavaClientException clientException) {
                return getErrorResponse(clientException);
            } catch (OpenViduHttpException httpException) {
                if (httpException.getStatus() == 404) {
                    this.mapSessions.remove(sessionName);
                    this.mapSessionNamesTokens.remove(sessionName);
                }
            }
        }
        // End - 기존세션

        // 새 세션
        logger.info("New session " + sessionName);
        try {
            Session session = this.openVidu.createSession();
            String token = session.createConnection(connectionProperties).getToken();

            this.mapSessions.put(sessionName, session);
            this.mapSessionNamesTokens.put(sessionName, new ConcurrentHashMap<>());
            this.mapSessionNamesTokens.get(sessionName).put(token, role);

            responseJson.addProperty("0", token);

            return new ResponseEntity<>(responseJson, HttpStatus.OK);

        } catch (Exception e) {
            return getErrorResponse(e);
        }
        // End - 새 세션
    }

    @PostMapping("/remove-user")
    public ResponseEntity<JsonObject> removeUser(@RequestBody Map<String, Object> sessionNameToken) {

        logger.info("RecordingController -> removeUser | {sessionName, token}=" + sessionNameToken);

        String sessionName = (String) sessionNameToken.get("sessionName");
        String token = (String) sessionNameToken.get("token");

        // 기존 세션
        if (this.mapSessions.get(sessionName) != null && this.mapSessionNamesTokens.get(sessionName) != null) {
            if (this.mapSessionNamesTokens.get(sessionName).remove(token) != null) {
                if (this.mapSessionNamesTokens.get(sessionName).isEmpty()) {
                    this.mapSessions.remove(sessionName);
                }
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                logger.info("Problems in the app server: the TOKEN wasn't valid");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }

        }
        // 새 세션
        else {
            logger.info("Problems in the app server: the SESSION does not exist");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/close-session")
    public ResponseEntity<JsonObject> closeSession(@RequestParam("sessionName") String sessionName) throws Exception {
        logger.info("RecordingController -> closeSession | " + sessionName);

        if (this.mapSessions.get(sessionName) != null && this.mapSessionNamesTokens.get(sessionName) != null) {
            Session s = this.mapSessions.get(sessionName);
            s.close();
            this.mapSessions.remove(sessionName);
            this.mapSessionNamesTokens.remove(sessionName);
            this.sessionRecordings.remove(s.getSessionId());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        // 세션 없음
        else {
            logger.info("Problems in the app server: the SESSION does not exist");
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/fetch-info")
    public ResponseEntity<JsonObject> fetchInfo(@RequestBody Map<String, Object> sessionName) {
        try {
            logger.info("RecordingController -> fetchInfo | {sessionName}=" + sessionName);

            String session = (String) sessionName.get("sessionName");

            // 세션 존재
            if (this.mapSessions.get(session) != null && this.mapSessionNamesTokens.get(session) != null) {
                Session s = this.mapSessions.get(session);
                boolean changed = s.fetch();
                logger.info("Any change: " + changed);
                return new ResponseEntity<>(this.sessionToJson(s), HttpStatus.OK);
            }
            // 세션 없음
            else {
                logger.info("Problems in the app server: the SESSION does not exist");
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            logger.error("Exception [Err_Msg]: {}", e.getMessage());
            return getErrorResponse(e);
        }
    }

    @GetMapping("/fetch-all")
    public ResponseEntity<?> fetchAll() {
        try {
            logger.info("Fetching all session info");
            boolean changed = this.openVidu.fetch();
            logger.info("Any change: " + changed);
            JsonArray jsonArray = new JsonArray();
            for (Session s : this.openVidu.getActiveSessions()) {
                jsonArray.add(this.sessionToJson(s));
            }
            return new ResponseEntity<>(jsonArray, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            logger.error("Exception [Err_Msg]: {}", e.getMessage());
            return getErrorResponse(e);
        }
    }

    @DeleteMapping("/force-disconnect")
    public ResponseEntity<JsonObject> forceDisconnect(@RequestBody Map<String, Object> params) {
        try {
            String session = (String) params.get("sessionName");
            String connectionId = (String) params.get("connectionId");

            // 세션 존재
            if (this.mapSessions.get(session) != null && this.mapSessionNamesTokens.get(session) != null) {
                Session s = this.mapSessions.get(session);
                s.forceDisconnect(connectionId);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            // 세션 없음
            else {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            logger.error("Exception [Err_Msg]: {}", e.getMessage());
            return getErrorResponse(e);
        }
    }

    @DeleteMapping("/force-unpublish")
    public ResponseEntity<JsonObject> forceUnpublish(@RequestBody Map<String, Object> params) {
        try {
            String session = (String) params.get("sessionName");
            String streamId = (String) params.get("streamId");

            // 세션 존재
            if (this.mapSessions.get(session) != null && this.mapSessionNamesTokens.get(session) != null) {
                Session s = this.mapSessions.get(session);
                s.forceUnpublish(streamId);
                return new ResponseEntity<>(HttpStatus.OK);
            }
            // 세션 없음
            else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            logger.error("Exception [Err_Msg]: {}", e.getMessage());
            return getErrorResponse(e);
        }
    }

    // Recording API
    @PostMapping("/recording/start")
    public ResponseEntity<?> startRecording(@RequestBody Map<String, Object> params) {
        String sessionId = (String) params.get("session");
        Recording.OutputMode outputMode = Recording.OutputMode.valueOf((String) params.get("outputMode"));
        boolean hasAudio = (boolean) params.get("hasAudio");
        boolean hasVideo = (boolean) params.get("hasVideo");

        RecordingProperties properties = new RecordingProperties.Builder().outputMode(outputMode).hasAudio(hasAudio)
                .hasVideo(hasVideo).build();

        logger.info("Starting recording for session " + sessionId + " with properties {outputMode=" + outputMode
                + ", hasAudio=" + hasAudio + ", hasVideo=" + hasVideo + "}");

        try {
            Recording recording = this.openVidu.startRecording(sessionId, properties);
            this.sessionRecordings.put(sessionId, true);
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/recording/stop")
    public ResponseEntity<?> stopRecording(@RequestBody Map<String, Object> params) {
        String recordingId = (String) params.get("recording");

        logger.info("Stopping recording | {recordingId}=" + recordingId);

        try {
            Recording recording = this.openVidu.stopRecording(recordingId);
            this.sessionRecordings.remove(recording.getSessionId());
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/recording/delete")
    public ResponseEntity<?> deleteRecording(@RequestBody Map<String, Object> params) {
        String recordingId = (String) params.get("recording");

        logger.info("Deleting recording | {recordingId}=" + recordingId);

        try {
            this.openVidu.deleteRecording(recordingId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/recording/get/{recordingId}")
    public ResponseEntity<?> getRecording(@PathVariable(value = "recordingId") String recordingId) {

        logger.info("Getting recording | {recordingId}=" + recordingId);

        try {
            Recording recording = this.openVidu.getRecording(recordingId);
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/recording/list")
    public ResponseEntity<?> listRecordings() {

        logger.info("Listing recordings");

        try {
            List<Recording> recordings = this.openVidu.listRecordings();

            return new ResponseEntity<>(recordings, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    // End - Recording API

    private ResponseEntity<JsonObject> getErrorResponse(Exception e) {
        JsonObject json = new JsonObject();
        json.addProperty("cause", e.getCause().toString());
        json.addProperty("error", e.getMessage());
        json.addProperty("exception", e.getClass().getCanonicalName());
        return new ResponseEntity<>(json, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    protected JsonObject sessionToJson(Session session) {
        Gson gson = new Gson();
        JsonObject json = new JsonObject();
        json.addProperty("sessionId", session.getSessionId());
        json.addProperty("customSessionId", session.getProperties().customSessionId());
        json.addProperty("recording", session.isBeingRecorded());
        json.addProperty("mediaMode", session.getProperties().mediaMode().name());
        json.addProperty("recordingMode", session.getProperties().recordingMode().name());
        json.add("defaultRecordingProperties",
                gson.toJsonTree(session.getProperties().defaultRecordingProperties()).getAsJsonObject());
        JsonObject connections = new JsonObject();
        connections.addProperty("numberOfElements", session.getConnections().size());
        JsonArray jsonArrayConnections = new JsonArray();
        session.getConnections().forEach(con -> {
            JsonObject c = new JsonObject();
            c.addProperty("connectionId", con.getConnectionId());
            c.addProperty("role", con.getRole().name());
            c.addProperty("token", con.getToken());
            c.addProperty("clientData", con.getClientData());
            c.addProperty("serverData", con.getServerData());
            JsonArray pubs = new JsonArray();
            con.getPublishers().forEach(p -> pubs.add(gson.toJsonTree(p).getAsJsonObject()));
            JsonArray subs = new JsonArray();
            con.getSubscribers().forEach(s -> subs.add(s));
            c.add("publishers", pubs);
            c.add("subscribers", subs);
            jsonArrayConnections.add(c);
        });
        connections.add("content", jsonArrayConnections);
        json.add("connections", connections);
        return json;
    }
}
