#!/bin/bash

# 현재 Git 브랜치명을 가져옵니다
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# 레지스트리 URL과 이미지 이름을 설정합니다
REGISTRY_URL="i11a706.p.ssafy.io:5000"
IMAGE_NAME="backend"

# 브랜치명에서 '/' 문자를 '-' 문자로 대체합니다
TAG=${BRANCH_NAME//\//-}

# 현재 스크립트가 위치한 디렉토리를 가져옵니다
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

# Docker 이미지 태그 및 푸시
docker build -t $REGISTRY_URL/$IMAGE_NAME:$TAG -f "$SCRIPT_DIR/Dockerfile" "$SCRIPT_DIR"
docker push $REGISTRY_URL/$IMAGE_NAME:$TAG
