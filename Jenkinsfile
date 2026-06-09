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
                // Changing to double quotes allows Windows to read the variable correctly
                sh "docker build -t ${IMAGE} ."
            }
        }

        stage('Run Container') {
            steps {
                // Changing to double quotes here as well
                sh "docker rm -f ${CONT} || true"
                sh "docker run -d --name ${CONT} -p 8081:80 ${IMAGE}"
            }
        }
    }
}