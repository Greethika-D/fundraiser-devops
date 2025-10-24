pipeline {
    agent any
    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    bat "docker build -t fundraiser-app ."
                }
            }
        }
        stage('Deploy with Docker Compose') {
            steps {
                script {
                    // Stop and remove any existing containers with these names
                    bat "docker rm -f fundraiser_backend || echo 'No old backend container'"
                    bat "docker rm -f mongo_db || echo 'No old mongo container'"
                    
                    // Remove unused volumes (optional)
                    bat "docker volume prune -f"
                    
                    // Build and deploy fresh
                    bat "docker-compose up -d --build"
                }
            }
        }
    }
    post {
        failure {
            echo "Pipeline failed. Check logs for errors."
        }
    }
}
