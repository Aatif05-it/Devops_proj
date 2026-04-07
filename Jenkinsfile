pipeline {
  agent any

  environment {
    APP_NAME = 'mydevschool'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    IMAGE_REPO = "ghcr.io/${env.GIT_URL?.tokenize('/')[-2] ?: 'owner'}/${APP_NAME}"
    DOCKER_AVAILABLE = 'false'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Check Docker') {
      steps {
        script {
          def dockerStatus = bat(returnStatus: true, script: 'docker info >nul 2>&1')
          if (dockerStatus == 0) {
            env.DOCKER_AVAILABLE = 'true'
            echo 'Docker is available.'
          } else {
            env.DOCKER_AVAILABLE = 'false'
            currentBuild.result = 'UNSTABLE'
            echo 'Docker is not available (likely paused). Skipping Docker/K8s stages.'
          }
        }
      }
    }

    stage('Build Docker Image') {
      when {
        expression { return env.DOCKER_AVAILABLE == 'true' }
      }
      steps {
        bat 'docker build -t %APP_NAME%:%IMAGE_TAG% .'
      }
    }

    stage('Tag Image') {
      when {
        expression { return env.DOCKER_AVAILABLE == 'true' }
      }
      steps {
        bat 'docker tag %APP_NAME%:%IMAGE_TAG% %IMAGE_REPO%:%IMAGE_TAG%'
        bat 'docker tag %APP_NAME%:%IMAGE_TAG% %IMAGE_REPO%:latest'
      }
    }

    stage('Push Image (optional)') {
      when {
        expression { return env.DOCKER_AVAILABLE == 'true' && env.GHCR_TOKEN != null }
      }
      steps {
        bat 'echo %GHCR_TOKEN% | docker login ghcr.io -u %GHCR_USER% --password-stdin'
        bat 'docker push %IMAGE_REPO%:%IMAGE_TAG%'
        bat 'docker push %IMAGE_REPO%:latest'
      }
    }

    stage('K8s Deploy (optional)') {
      when {
        expression { return env.DOCKER_AVAILABLE == 'true' && fileExists('k8s/deployment.yaml') }
      }
      steps {
        bat 'kubectl apply -f k8s/'
      }
    }
  }

  post {
    always {
      script {
        bat(returnStatus: true, script: 'docker image prune -f')
      }
    }
    success {
      echo 'Pipeline completed successfully.'
    }
    failure {
      echo 'Pipeline failed. Check logs.'
    }
  }
}
