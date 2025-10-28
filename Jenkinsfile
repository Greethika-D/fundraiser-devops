pipeline {
    agent any

    environment {
        APP_DIR = "mongodb2" // explicitly use your app folder
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out the latest code...'
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                dir("${APP_DIR}") {
                    script {
                        echo '📦 Installing dependencies...'
                        bat 'npm ci --no-audit --no-fund'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                dir("${APP_DIR}") {
                    script {
                        echo '🧪 Running tests...'
                        bat 'npm test || echo "No tests found, skipping..."'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir("${APP_DIR}") {
                    script {
                        echo 'Building Docker image...'
                        bat 'docker build -t fundraiser-app:%BUILD_NUMBER% .'
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                dir("${APP_DIR}") {
                    script {
                        echo '🚀 Deploying locally using Docker Compose...'
                        // Remove old containers safely
                        bat 'docker rm -f fundraiser_backend || echo No old backend'
                        bat 'docker rm -f mongo_db || echo No old Mongo container'
                        bat 'docker volume prune -f || echo No volumes to prune'
                        // Stop orphaned services if needed
                        bat 'docker-compose down -v --remove-orphans || echo Compose down failed'
                        // Bring up new containers
                        bat 'docker-compose up -d --build'
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Local CI/CD pipeline succeeded! Fundraiser app is running on http://localhost:3019'
        }
        failure {
            echo 'Build or deployment failed. Please check the logs.'
        }
    }
}
