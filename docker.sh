#!/bin/bash

# Movie Stack Docker Management Script
# This script provides easy access to Docker commands from the project root

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/docker"

# Change to docker directory and run the docker-dev.sh script
cd "$DOCKER_DIR" && ./scripts/docker-dev.sh "$@"
