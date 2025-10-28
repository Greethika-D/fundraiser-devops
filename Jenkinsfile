pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps { 
                checkout scm 
            }
        }

        stage('Install dependencies') {
            steps {
                script { 
                    bat 'npm ci --no-audit --no-fund' 
                }
            }
        }

        stage('Test') {
            steps {
                script { 
                    bat 'npm test' 
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // tag by build number so images are unique
                    bat 'docker build -t fundraiser-app:${BUILD_NUMBER} .'
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    // remove conflicting containers, prune volumes, then bring up compose
                    bat 'docker rm -f fundraiser_backend || echo No backend to remove'
                    bat 'docker rm -f mongo_db || echo No mongo to remove'
                    bat 'docker volume prune -f || echo no volumes to prune'
                    bat 'docker-compose down -v --remove-orphans || echo compose down failed'
                    bat 'docker-compose up -d --build'
                }
            }
        }
    }

    post {
        success { 
            echo 'Build and deploy succeeded.' 
        }
        failure { 
            echo 'Build or deploy failed. Inspect console output.' 
        }
    }
}
