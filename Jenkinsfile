pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/roshellm23/DocConnect.git'
            }
        }

        stage('Backend Build') {
            steps {
                sh 'echo Building Backend'
            }
        }

        stage('Frontend Build') {
            steps {
                sh 'echo Building Frontend'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'echo Building Docker Images'
            }
        }
    }
}