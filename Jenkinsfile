pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/roshellm23/DocConnect.git'
            }
        }

        stage('Docker Build Backend') {
            steps {
                sh 'docker build -t docconnect-backend ./backend'
            }
        }

        stage('Docker Build Frontend') {
            steps {
                sh 'docker build -t docconnect-frontend ./frontend'
            }
        }
    }
}