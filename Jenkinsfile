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
                    sh 'docker build -t fundraiser-app .'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    sh 'docker-compose down'
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }
}
