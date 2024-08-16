#!/bin/bash

SCRIPT_DIR=$(dirname "$(realpath "$0")")

cd /opt
curl https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_latest.sh | sudo bash

cd /opt/openvidu
sudo tee -a /opt/openvidu/.env < "$SCRIPT_DIR/.env.openvidu"
sudo mkdir -p /opt/openvidu/owncert
sudo cp "$SCRIPT_DIR/cert/certificate.cert" /opt/openvidu/owncert/certificate.cert
sudo cp "$SCRIPT_DIR/cert/certificate.key" /opt/openvidu/owncert/certificate.key
sudo rm /opt/openvidu/docker-compose.override.yml

sudo docker compose up -d

cd $SCRIPT_DIR
sudo docker compose up -d

sleep 10

sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3478/tcp
sudo ufw allow 3478/udp
sudo ufw allow 40000:57000/tcp
sudo ufw allow 40000:57000/udp
sudo ufw allow 57001:65535/tcp
sudo ufw allow 57001:65535/udp
echo y | sudo ufw enable

read -p "시스템을 재부팅 하시겠습니까? (y/n): " answer

# 입력값이 'y'인 경우 시스템을 재부팅
if [ "$answer" = "y" ]; then
    echo "시스템을 재부팅합니다..."
    sudo reboot
fi