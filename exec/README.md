# Archiview 포팅 메뉴얼

### INDEX

1. 환경변수
2. 외부 API
3. 배포하기
4. 트러블슈팅

## 1. 환경변수

각 서버에 따라 하위 디렉토리가 구성되었으며 최하위 파일에 주입되는 환경변수는 다음과 같이 정의된다.

```
[환경변수명]

한글로 작성되었으며 대괄호로 묶여있다.
영어로 작성된 환경변수는 수정을 엄격히 금지된다.
```

- [서버도메인]

  사용할 배포 서버의 도메인. 단, 앞에 프로토콜이 명시되었다면 프로토콜을 작성하지 않으며 프로토콜이 명시되지 않았다면 HTTPS 프로토콜을 포함하여 작성한다.

- [유저관리API 서버]

  유저, 면접 질문 및 답변 등 핵심 서비스 API 서버.<br>
  Backend/Archiview로 구동되는 SpringBoot 서버를 의미한다.

- [P2P 및 파일서버]

  P2P, 시그널링, 파일 송수신 서버. <br>
  Backend/SignalingServer로 구동되는 SpringBoot 서버를 의미한다.

- [Openvidu 서버]

  Openvidu 배포용 이미지를 올린 도커 컨테이너 상의 서버를 의미한다.

## 2. 외부 API

- Naver 이미지 검색 API

  Naver API를 이용하기 위해 '이미지', '검색' API의 승인을 받아야하며 '서버도메인'으로부터의 접속을 허용해야한다.

## 3. 배포하기

### 사전준비 단계 (인프라)

1. 프로젝트를 clone 한다.
2. exec폴더 내부의 각 파일들을 원하는 위치로 이동시킨다.
3. letsencrypt를 사용하여 ssl을 활성화 할 수 있게 키를 발급받는다.
4. custom-nginx.conf 및 모든 docker-compose.yml 파일의 환경변수를 수정한다. 이때, 각 서버의 포트번호는 80, 443 및 Openvidu에서 사용하는 포트를 사용할 수 없으며 다른 서버끼리 중복될 수 없다.
5. 방화벽 설정에서 80, 443 포트를 allow 한다.

### 사전준비 단계 (서버)

1. archiview 폴더의 application.yml의 다음 요소들을 환경에 맞게 수정한다.

```
jpa.hibernate.ddl-auto: update (초기 구동시에는 create)
server.ssl.key-store: ssl 키의 파일 위치
```

2. signaling 폴더의 application.properties와 application-prod.properties 파일을 환경에 맞게 수정한다.

### 배포 단계

1. docker compose up 명령어 혹은 Jenkins를 활용하여 각 서버의 docker-compose.yml을 다음과 같은 순서로 구동한다.

```
순서대로 구동하지 않을 시 각 서버가 유기적으로 연동되지 않을 수 있다.

1. Openvidu 서버
2. MySQL 서버
3. Redis 서버
4. SignalingServer 서버
5. Archiview 서버
```

2. MySQL의 user에 'role' column이 'ADMIN'인 관리자 계정을 추가한다. (관리자 계정 생성 및 삭제는 보안을 위해 DB 직접 접근을 통해 수동으로 관리해야한다.)

```
TLDR:

mysql 폴더의 덤프파일을 이용한다면 user 테이블에서 ADMIN으로 지정된 계정을 사용한다.
```

## 4. 트러블슈팅

```
[Nginx 환경설정 관련 문제]

custom-nginx.conf는 nginx.conf를 오버라이드한다.
nginx.conf 파일의 수정은 엄격히 금지하며 필요한 환경설정은 custom-nginx.conf 파일을 통해 수행하도록 한다.
```

```
[Nginx 네트워크 관련 문제]

도커 컨테이너 상에서 구동되는 nginx는 HOST 네트워크 방식을 사용한다.
사용하는 EC2, OCI 등의 서버에 nginx가 이미 설치되어있다면 기존 nginx 서비스를 종료시키거나 80, 443포트를 사용하지 않도록 설정해야한다.
```

```
[볼륨 마운트 관련 문제]

도커 컨테이너와 물리서버간의 볼륨이 마운트되지 않는 경우 도커 컨테이너에 해당 디렉토리가 존재하지 않을 가능성이 높다.
해당 컨테이너에 터미널로 접속 후 디렉토리를 생성해야한다.
```
