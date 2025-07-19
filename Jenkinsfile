pipeline {
    agent any

    parameters {
        choice(name: 'SERVICE', choices: ['api-gateway', 'identity-service', 'post-service', 'media-service', 'search-service'], description: 'Select microservice')
    }

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/yourusername/yourrepo.git'
            }
        }

        stage('Install Node & Dependencies') {
            steps {
                dir("${params.SERVICE}") {
                    script {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir("${params.SERVICE}") {
                    sh "docker build -t ${params.SERVICE}:latest ."
                }
            }
        }
    }
}
