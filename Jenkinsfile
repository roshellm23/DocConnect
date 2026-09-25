pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/roshellm23/DocConnect.git'
            }
        }

        stage('Docker Check') {
            steps {
                sh 'docker version'
            }
        }
    }
}