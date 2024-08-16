#!/bin/bash

SCRIPT_DIR=$(dirname "$(realpath "$0")")

cd $SCRIPT_DIR
sudo docker compose -f docker-compose.yml -f docker-compose.local.override.yml up -d