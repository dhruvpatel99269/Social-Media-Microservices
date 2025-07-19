pipeline {
    agent any

    parameters {
        choice(
            name: 'SERVICE',
            choices: ['api-gateway', 'identity-service', 'post-service', 'media-service', 'search-service'],
            description: 'Select the microservice to build'
        )
    }

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'github-pat',
                    url: 'https://github.com/dhruvpatel99269/Social-Media-Microservices.git',
                    branch: 'master'
            }
        }

        stage('Install Node & Dependencies') {
            steps {
                dir("${params.SERVICE}") {
                    script {
                        // Make sure Node.js is installed or use NodeJS plugin if needed
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir("${params.SERVICE}") {
                    bat "docker build -t ${params.SERVICE}:latest ."
                }
            }
        }
    }
}
