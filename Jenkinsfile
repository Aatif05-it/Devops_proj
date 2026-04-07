pipeline {
  agent any

  environment {
    APP_NAME = 'mydevschool'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    IMAGE_REPO = "ghcr.io/${env.GIT_URL?.tokenize('/')[-2] ?: 'owner'}/${APP_NAME}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t ${APP_NAME}:${IMAGE_TAG} .'
      }
    }

    stage('Tag Image') {
      steps {
        sh 'docker tag ${APP_NAME}:${IMAGE_TAG} ${IMAGE_REPO}:${IMAGE_TAG}'
        sh 'docker tag ${APP_NAME}:${IMAGE_TAG} ${IMAGE_REPO}:latest'
      }
    }

    stage('Push Image (optional)') {
      when {
        expression { return env.GHCR_TOKEN != null }
      }
      steps {
        sh 'echo ${GHCR_TOKEN} | docker login ghcr.io -u ${GHCR_USER} --password-stdin'
        sh 'docker push ${IMAGE_REPO}:${IMAGE_TAG}'
        sh 'docker push ${IMAGE_REPO}:latest'
      }
    }

    stage('K8s Deploy (optional)') {
      when {
        expression { return fileExists('k8s/deployment.yaml') }
      }
      steps {
        sh 'kubectl apply -f k8s/'
      }
    }
  }

  post {
    always {
      sh 'docker image prune -f || true'
    }
    success {
      echo 'Pipeline completed successfully.'
    }
    failure {
      echo 'Pipeline failed. Check logs.'
    }
  }
}
