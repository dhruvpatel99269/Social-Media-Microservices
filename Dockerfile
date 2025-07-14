FROM node:18-alpine

WORKDIR /app

# Install supervisord to run multiple processes
RUN apk add --no-cache supervisor

# Copy the whole project
COPY . .

# Install dependencies for each service
RUN cd api-gateway && npm install && cd ..
RUN cd identity-service && npm install && cd ..
RUN cd post-service && npm install && cd ..
RUN cd media-service && npm install && cd ..
RUN cd search-service && npm install && cd ..

# Copy the supervisor configuration file
COPY supervisord.conf /etc/supervisord.conf

# Start all services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
