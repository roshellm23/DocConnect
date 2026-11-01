
pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '755729228637'
        BACKEND_REPO = 'docconnect-backend'
        FRONTEND_REPO = 'docconnect-frontend'
        EKS_CLUSTER = 'docconnect-dev'
        K8S_NAMESPACE = 'docconnect'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/roshellm23/DocConnect.git'

                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    env.IMAGE_TAG = "${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"

                    env.ECR_REGISTRY =
                        "${env.AWS_ACCOUNT_ID}.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
                }

                echo "Building images for commit ${env.GIT_COMMIT_SHORT}"
                echo "Docker image tag: ${env.IMAGE_TAG}"
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'docconnect-jwt-secret',
                        variable: 'JWT_SECRET'
                    )
                ]) {
                    dir('backend') {
                        sh 'npm test -- --ci'
                    }
                }
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

        stage('Verify EKS Access') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'docconnect-jenkins-ecr'
                ]]) {
                    sh '''
                        echo "Checking AWS identity..."
                        aws sts get-caller-identity

                        echo "Updating EKS kubeconfig..."
                        aws eks update-kubeconfig \
                          --region "$AWS_REGION" \
                          --name "$EKS_CLUSTER"

                        echo "Checking Kubernetes permissions..."

                        kubectl auth can-i get pods \
                          -n "$K8S_NAMESPACE"

                        kubectl auth can-i get deployments \
                          -n "$K8S_NAMESPACE"

                        kubectl auth can-i get services \
                          -n "$K8S_NAMESPACE"

                        echo "Checking existing deployments..."
                        kubectl get deployments -n "$K8S_NAMESPACE"
                    '''
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'docconnect-jenkins-ecr'
                ]]) {
                    sh '''
                        echo "Deploying backend image..."

                        kubectl set image deployment/docconnect-backend \
                          backend=${ECR_REGISTRY}/${BACKEND_REPO}:${IMAGE_TAG} \
                          -n "$K8S_NAMESPACE"

                        echo "Deploying frontend image..."

                        kubectl set image deployment/docconnect-frontend \
                          frontend=${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG} \
                          -n "$K8S_NAMESPACE"

                        echo "Waiting for backend rollout..."

                        kubectl rollout status deployment/docconnect-backend \
                          -n "$K8S_NAMESPACE" --timeout=180s

                        echo "Waiting for frontend rollout..."

                        kubectl rollout status deployment/docconnect-frontend \
                          -n "$K8S_NAMESPACE" --timeout=180s

                        echo "Final deployment status:"
                        kubectl get deployments -n "$K8S_NAMESPACE"
                        kubectl get pods -n "$K8S_NAMESPACE"
                    '''
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: false,
                testResults: 'backend/reports/junit.xml'

            sh '''
                docker logout \
                  "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com" || true
            '''
        }

        success {
            echo "CI/CD successful! Both images deployed to EKS with tag ${env.IMAGE_TAG}"
        }

        failure {
            echo 'Pipeline failed. Check the Console Output.'
        }
    }
}
