pipeline {
    agent any

    environment {
        // You can define environment variables here if needed
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Greethika-D/fundraiser-devops.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    bat 'docker build -t fundraiser-app .'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    // Stop and remove existing containers & networks
                    bat "docker-compose down -v --remove-orphans"
                    
                    // Build and start containers
                    bat "docker-compose up -d --build"
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline finished successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for errors.'
        }
    }
}
