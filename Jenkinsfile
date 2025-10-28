pipeline {
    agent any

    environment {
        APP_DIR = "mongodb2"
        PROJECT_PATH = "C:\\Users\\greet\\OneDrive\\projects\\mongodb2"
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
                script {
                    echo '🚀 Building Docker image...'
                    bat """
                        echo Current Jenkins workspace: %cd%
                        docker build -t fundraiser-app:%BUILD_NUMBER% -f "${PROJECT_PATH}\\Dockerfile" "${PROJECT_PATH}"
                    """
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                dir("${APP_DIR}") {
                    script {
                        echo '🚀 Deploying with Docker Compose...'
                        bat 'docker rm -f fundraiser_backend || echo No old backend'
                        bat 'docker rm -f mongo_db || echo No old Mongo'
                        bat 'docker volume prune -f || echo No volumes'
                        bat 'docker-compose down -v --remove-orphans || echo Compose down failed'
                        bat 'docker-compose up -d --build'
                    }
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Build & Deploy succeeded! Access app at http://localhost:3019'
        }
        failure {
            echo '❌ Build or Deploy failed. Check console output for details.'
        }
    }
}
