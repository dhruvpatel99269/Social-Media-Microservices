# syntax=docker/dockerfile:1

FROM docker:24.0.5-cli

# Install docker-compose and dependencies
RUN apk add --no-cache py3-pip python3 curl && \
    pip install docker-compose

WORKDIR /app

# Copy entire repo
COPY . .

# Run all services using docker-compose
CMD ["docker-compose", "up"]
