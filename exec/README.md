JDK: eclipse-temurin:17.0.11_9-jdk

## 필수 환경변수

- OpenAI DALL·E 사용을 위한 API 키 (backend/.env 파일에 설정)
- (도메인 변경 시)
  - backend/.env의 OPENVIDU_URL
  - .env.openvidu의 DOMAIN_OR_PUBLIC_IP

## 필수 파일

- SSL 인증서
  - cert폴더 안에 certificate.cert, certificate.key의 이름을 가지도록 설정

## 간편 구성

```bash
sh init.sh
```

## 로컬 환경에서 간편 구성

```
sh init.local.sh
```

# Openvidu 구성

```bash
sudo su
cd /opt
curl https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_latest.sh | bash

cd /opt/openvidu
# 이후 아래의 .env 파일 설정값 적용
```

.env (/opt/openvidu/.env 파일에서 해당 내용만 수정)

```bash
DOMAIN_OR_PUBLIC_IP=i11a706.p.ssafy.io
OPENVIDU_SECRET=p4syQOj0dxoTTeRO0gptkNwnd
CERTIFICATE_TYPE=owncert
SUPPORT_DEPRECATED_API=false
OPENVIDU_RECORDING=true
```

/opt/openvidu/owncert 폴더에 인증서 파일 추가

```bash
ls /opt/openvidu/owncert/
# certificate.cert  certificate.key
```

이후 도커 컨테이너 실행

```bash
cd /opt/openvidu
docker compose up -d
```

# 프로젝트 구성

```bash
project-root/
├── backend/
│   └── build/
│   │   └── [backend JAR files]
│   └── aplication.properties
│   └── .env
├── frontend/
│   └── build/
│       └── [frontend build files]
├── mysql/
│   └── init.sql
│   └── data.sql
├── nginx/
│   └── nginx.conf
└──docker-compose.yml
```

docker-compose.yml

```bash
services:
  nginx:
    image: nginx
    container_name: nginx
    restart: always
    ports:
      # openvidu nginx 설정은 localhost:5442로 일반 트래픽 전송
      - "127.0.0.1:5442:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./frontend/build:/usr/share/nginx/html:ro
      - ./images:/static/images:ro
    networks:
      - rabbits

  backend:
    image: eclipse-temurin:17.0.11_9-jdk-jammy
    container_name: backend
    restart: always
    depends_on:
      - mysql
    environment:
      - SPRING_CONFIG_LOCATION=/app/application.properties
    volumes:
      - ./backend/build/battlepeople.jar:/app/app.jar:ro
      - ./backend/application.properties:/app/application.properties
      - ./images:/static/images:rw
    env_file:
      - backend/.env
    working_dir: /app
    networks:
      - rabbits
    entrypoint: ["sh", "-c", "java -jar $(ls *.jar | head -n 1)"]

  mysql:
    image: mysql:8.0.33
    container_name: mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: VhGjVihJtfVUzhsT7m8y
      MYSQL_DATABASE: battlepeople
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
      - ./mysql/data.sql:/docker-entrypoint-initdb.d/initdata.sql
    networks:
      - rabbits

  redis:
    image: redis
    container_name: redis
    restart: always
    networks:
      - rabbits

networks:
  rabbits:
    driver: bridge

volumes:
  mysql_data:

```

nginx.conf

```bash
server {
    listen 80;

    location = /battle-people/ws {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Original-Forwarded-For $http_x_forwarded_for;
        proxy_read_timeout 86400;
    }

    location /battle-people {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Original-Forwarded-For $http_x_forwarded_for;
    }

    location /static/images/ {
        alias /static/images/;
        try_files $uri $uri/ =404;
    }

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

backend/application.properties

```bash
spring.application.name=BattlePeople
server.port=8080
server.servlet.context-path=/battle-people
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
#data source
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.database=mysql
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
#jwt
jwt.secret=${JWT_SECRET}
# 10 days
jwt.accessToken.expiration=864000000
# 10 days
jwt.refreshToken.expiration=864000000
#hibernate
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=none
spring.jpa.hibernate.format_sql=true
spring.output.ansi.enabled=always
#logging
#logging.level.org.hibernate.type=trace
openvidu.url=${OPENVIDU_URL}
openvidu.secret=${OPENVIDU_SECRET}
# OpenVidu recording properties
openvidu.recording=true
openvidu.recording.path=/opt/openvidu/recordings
openvidu.recording.public-access=true
spring.data.redis.host=redis
spring.data.redis.port=6379

min.people.count.value=5

spring.servlet.multipart.enabled=true
spring.servlet.multipart.file-size-threshold=2KB
spring.servlet.multipart.max-file-size=200MB
spring.servlet.multipart.max-request-size=215MB
storage.location=/static/images

openai.api.key=${OPENAI_API_KEY}
```

backend/.env

```bash
OPENAI_API_KEY=""
OPENVIDU_URL="https://i11a706.p.ssafy.io"
OPENVIDU_SECRET="p4syQOj0dxoTTeRO0gptkNwnd"
JWT_SECRET="adsfasdfasdfasdfasdfasdfkjasdlkfjaslkdfjlaskdjffghdfhrtbfgbxcvbxfbserbcvbxcvb"
SPRING_DATASOURCE_URL="jdbc:mysql://mysql:3306/battlepeople?serverTimezone=Asia/Seoul&characterEncoding=UTF-8"
SPRING_DATASOURCE_USERNAME="rabbits"
SPRING_DATASOURCE_PASSWORD="kevinhomealone"
```

mysql/init.sql

```sql
CREATE DATABASE IF NOT EXISTS battlepeople;

-- Create admin user
CREATE USER 'bunnies'@'%' IDENTIFIED BY 'VhGjVihJtfVUzhsT7m8y';
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON *.* TO 'bunnies'@'%';

-- Create developer user
CREATE USER 'rabbits'@'%' IDENTIFIED BY 'kevinhomealone';
GRANT SELECT, INSERT, UPDATE, DELETE ON battlepeople.* TO 'rabbits'@'%';

FLUSH PRIVILEGES;

DROP USER 'root'@'%';

FLUSH PRIVILEGES;

```
