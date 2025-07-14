# Use a full-featured base image with Docker + Compose installed
FROM docker/compose:1.29.2

WORKDIR /

# Copy project files into the container
COPY . .

# Run the Docker Compose app
CMD ["docker-compose", "up"]
