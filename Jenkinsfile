pipeline {
  agent any

  environment {
    APP_NAME = 'mydevschool'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    IMAGE_REPO = 'ghcr.io/aatif05-it/mydevschool'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Normalize Image Repo') {
      steps {
        echo "Using image repository: ${env.IMAGE_REPO}"
      }
    }

    stage('Check Docker') {
      steps {
        script {
          def dockerStatus = bat(returnStatus: true, script: 'docker info >nul 2>&1')
          if (dockerStatus == 0) {
            writeFile file: '.docker_available', text: 'true\n'
            echo 'Docker is available.'
          } else {
            if (fileExists('.docker_available')) {
              bat 'del /f /q .docker_available'
            }
            currentBuild.result = 'UNSTABLE'
            echo 'Docker is not available (likely paused). Skipping Docker/K8s stages.'
          }
        }
      }
    }

    stage('Build Docker Image') {
      when {
        expression { return fileExists('.docker_available') }
      }
      steps {
        bat 'docker build -t %APP_NAME%:%IMAGE_TAG% .'
      }
    }

    stage('Tag Image') {
      when {
        expression { return fileExists('.docker_available') }
      }
      steps {
        bat 'docker tag %APP_NAME%:%IMAGE_TAG% %IMAGE_REPO%:%IMAGE_TAG%'
        bat 'docker tag %APP_NAME%:%IMAGE_TAG% %IMAGE_REPO%:latest'
      }
    }

    stage('Push Image (optional)') {
      when {
        expression { return fileExists('.docker_available') && env.GHCR_TOKEN != null }
      }
      steps {
        bat 'echo %GHCR_TOKEN% | docker login ghcr.io -u %GHCR_USER% --password-stdin'
        bat 'docker push %IMAGE_REPO%:%IMAGE_TAG%'
        bat 'docker push %IMAGE_REPO%:latest'
      }
    }

    stage('Check Kubernetes') {
      when {
        expression { return fileExists('.docker_available') && fileExists('k8s/deployment.yaml') }
      }
      steps {
        script {
          def kubeStatus = bat(returnStatus: true, script: 'kubectl cluster-info >nul 2>&1')
          if (kubeStatus == 0) {
            writeFile file: '.k8s_available', text: 'true\n'
            echo 'Kubernetes API is reachable.'
          } else {
            if (fileExists('.k8s_available')) {
              bat 'del /f /q .k8s_available'
            }
            currentBuild.result = 'UNSTABLE'
            echo 'Kubernetes API is not reachable for Jenkins service. Skipping deploy stage.'
          }
        }
      }
    }

    stage('K8s Deploy (optional)') {
      when {
        expression { return fileExists('.docker_available') && fileExists('.k8s_available') && fileExists('k8s/deployment.yaml') }
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
