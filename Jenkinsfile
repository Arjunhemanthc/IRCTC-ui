pipeline {
    agent any

    environment {
        IMAGE = "irctc-frontend:${BUILD_NUMBER}"
        CONT = "irctc-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                // 'bat' forces Jenkins to use Windows Command Prompt
                bat "docker build -t %IMAGE% ."
            }
        }

        stage('Run Container') {
            steps {
                // Stops the old container if running; 'exit 0' keeps it from crashing if missing
                bat "docker rm -f %CONT% || exit 0"
                
                // Starts your new app container
                bat "docker run -d --name %CONT% -p 8081:80 %IMAGE%"
            }
        }
    }
}