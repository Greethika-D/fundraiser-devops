pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Greethika-D/fundraiser-devops.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat 'docker build -t fundraiser-app .'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    bat 'docker-compose down'
                    bat 'docker-compose up -d --build'
                }
            }
        }
    }
}
