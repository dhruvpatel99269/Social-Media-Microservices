pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
    }

    stages {
        stage('Parallel Microservice CI') {
            parallel {
                stage('api-gateway') {
                    steps {
                        script {
                            buildService('api-gateway')
                        }
                    }
                }
                stage('identity-service') {
                    steps {
                        script {
                            buildService('identity-service')
                        }
                    }
                }
                stage('post-service') {
                    steps {
                        script {
                            buildService('post-service')
                        }
                    }
                }
                stage('media-service') {
                    steps {
                        script {
                            buildService('media-service')
                        }
                    }
                }
                stage('search-service') {
                    steps {
                        script {
                            buildService('search-service')
                        }
                    }
                }
            }
        }
    }
}

def buildService(serviceName) {
    dir(serviceName) {
        checkout scm

        // Install Node.js (if not using NodeJS plugin)
        sh """
            curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
            sudo apt-get install -y nodejs
        """

        // Install NPM dependencies
        sh 'npm install'

        // Build Docker image
        sh "docker build -t ${serviceName}:latest ."
    }
}
