
pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '755729228637'
        BACKEND_REPO = 'docconnect-backend'
        FRONTEND_REPO = 'docconnect-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/roshellm23/DocConnect.git'

                script {
                    env.IMAGE_TAG = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    env.ECR_REGISTRY =
                        "${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
                }

                echo "Building images for commit ${IMAGE_TAG}"
            }
        }

        stage('Build Backend') {
            steps {
                sh '''
                    docker build \
                      -t ${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG} \
                      ./backend
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                    docker build \
                      -t ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG} \
                      ./frontend
                '''
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'docconnect-jenkins-ecr'
                ]]) {
                    sh '''
                        set +x
                        aws ecr get-login-password \
                          --region "$AWS_REGION" |
                        docker login \
                          --username AWS \
                          --password-stdin "$ECR_REGISTRY"
                    '''
                }
            }
        }

        stage('Push Images to ECR') {
            steps {
                sh '''
                    docker push \
                      ${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG}

                    docker push \
                      ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}
                '''
            }
        }
    }

    post {
        success {
            echo "Both images pushed successfully with tag ${IMAGE_TAG}"
        }
        failure {
            echo 'Pipeline failed. Check the Console Output.'
        }
        always {
            sh 'docker logout "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com" || true'
        }
    }
}
