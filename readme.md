# Social Media Microservices Backend

A full-featured, scalable microservices architecture built with **Node.js**, **Docker**, **RabbitMQ**, **MongoDB**, and **GitHub Actions**. This project demonstrates how to structure, containerize, communicate, and deploy distributed services efficiently, following best practices in DevOps and modern backend engineering.

---

## 📖 Table of Contents

* [📐 Architecture Overview](#architecture-overview)
* [🧩 Services Overview](#services-overview)
* [🗂️ Project Structure](#project-structure)
* [🔐 Environment Variables](#environment-variables)
* [▶️ Running Locally](#running-locally)
* [📡 API Documentation](#api-documentation)
* [💡 Development Tips](#development-tips)
* [🐳 Docker Compose Setup](#docker-compose-setup)
* [⚙️ CI/CD Pipeline](#cicd-pipeline)
* [🧰 Troubleshooting](#troubleshooting)
* [🤝 Contributing](#contributing)

---

## 📐 Architecture Overview

```mermaid
graph TD;
  Client["Client Apps"] --> APIGateway["API Gateway"]
  APIGateway --> Identity["Identity Service"]
  APIGateway --> Post["Post Service"]
  APIGateway --> Media["Media Service"]
  APIGateway --> Search["Search Service"]
  Post <--> Media
  Post <--> Search
  Media <--> Search
  subgraph Messaging
    RabbitMQ((RabbitMQ))
  end
  Post <--> RabbitMQ
  Media <--> RabbitMQ
  Search <--> RabbitMQ
```

* All traffic enters through the **API Gateway**.
* Services are **independently deployable**.
* Services communicate **synchronously** via REST and **asynchronously** via **RabbitMQ**.
* MongoDB is used for persistent storage.

---

## 🧩 Services Overview

| Service          | Description                                 | Ports | Directory           |
| ---------------- | ------------------------------------------- | ----- | ------------------- |
| API Gateway      | Routing, authentication, request forwarding | 3000  | `api-gateway/`      |
| Identity Service | User registration, login, JWT handling      | 3001  | `identity-service/` |
| Post Service     | Create, read, delete posts                  | 3002  | `post-service/`     |
| Media Service    | Upload, transform, store images/videos      | 3003  | `media-service/`    |
| Search Service   | Search indexed posts/media                  | 3004  | `search-service/`   |
| Redis            | Caching and pub/sub for lightweight tasks   | 6379  | Docker image        |
| RabbitMQ         | Message broker for asynchronous tasks       | 5672  | Docker image        |

---

## 🗂️ Project Structure

```
.
├── api-gateway/
├── identity-service/
├── media-service/
├── post-service/
├── search-service/
├── docker-compose.yml
├── render.yaml
└── .github/workflows/ci-cd.yml
```

Each microservice is **self-contained**, with its own:

* `Dockerfile`
* `.env`
* Routes & controllers
* Configs & utils

---

## 🔐 Environment Variables

Each service uses `.env` files. Sample variables:

```bash
PORT=3000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<db>
REDIS_URL=redis://redis:6379
RABBITMQ_URL=amqps://user:pass@rabbit.cloudamqp.com/vhost
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

Use `.env.example` from each service directory as reference.

---

## ▶️ Running Locally

### 🔧 Prerequisites

* Docker & Docker Compose installed
* Node.js 18+ installed (for local testing)

### 🔄 Start All Services

```bash
docker-compose up --build
```

### 🛑 Stop Services

```bash
docker-compose down
```

### 🔍 View Logs

```bash
docker-compose logs -f <service-name>
```

---

## 📡 API Documentation

* Each service has a `routes/` and `controllers/` folder.
* REST APIs are cleanly structured.
* Suggest adding Swagger later for interactive docs.
* Common response structure:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": { ... }
}
```

---

## 💡 Development Tips

* Use `nodemon` for hot reloads:

```bash
npm run dev
```

* Validate env files before starting services.
* Use `Postman` or `Insomnia` for manual API testing.
* Use `winston` logger to capture logs.

---

## 🐳 Docker Compose Setup

All services are defined in `docker-compose.yml`. Example snippet:

```yaml
services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    env_file: ./api-gateway/.env
```

You can also:

```bash
docker-compose build <service>
docker-compose up <service>
docker-compose logs -f <service>
```

---

## ⚙️ CI/CD Pipeline

* GitHub Actions is used for CI/CD.
* Workflow file: `.github/workflows/ci-cd.yml`
* Triggered on every push to `master`.

### Sample Steps:

* Checkout code
* Set up Node.js
* Install dependencies
* Run tests
* (Optional) Build Docker images
* (Optional) Deploy to Render / DockerHub

---

## 🧰 Troubleshooting

| Issue                    | Suggestion                                                 |
| ------------------------ | ---------------------------------------------------------- |
| Service crash / exit 1   | Check `.env`, logs, required dependencies                  |
| MongoDB connection error | Validate `MONGO_URI`, whitelist IP, ensure DB exists       |
| RabbitMQ errors          | Validate `RABBITMQ_URL`, check connection string           |
| Cloudinary issues        | Validate keys and correct Cloudinary URL                   |
| PORT conflict            | Ensure no two services use same host port                  |
| CI/CD failure on GitHub  | Expand `build-and-test` logs to find exact command failing |

---

## 🤝 Contributing

1. Fork this repo
2. Create a feature branch

```bash
git checkout -b feature/<feature-name>
```

3. Commit and push changes

```bash
git commit -m "Add <feature>"
git push origin feature/<feature-name>
```

4. Open a Pull Request

---

## 🧠 Final Thoughts

This project gave me hands-on experience with:

* Microservices architecture
* Docker-based deployments
* RabbitMQ event-driven communication
* CI/CD pipelines with GitHub Actions
* Environment management with Render
