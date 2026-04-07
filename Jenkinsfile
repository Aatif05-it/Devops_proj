pipeline {
  agent any

  environment {
    APP_NAME = 'mydevschool'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    IMAGE_REPO = "ghcr.io/${(env.GIT_URL?.tokenize('/')[-2] ?: 'aatif05-it').toLowerCase()}/${APP_NAME}"
  }

  stages {
    stage('Declarative: Checkout SCM') {
      steps {
        retry(3) {
          checkout([
            $class: 'GitSCM',
            branches: [[name: '*/main']],
            userRemoteConfigs: [[url: 'https://github.com/Aatif05-it/Devops_proj.git']],
            extensions: [
              [$class: 'CloneOption', shallow: true, depth: 1, timeout: 120],
              [$class: 'PruneStaleBranch'],
              [$class: 'RelativeTargetDirectory', relativeTargetDir: '.']
            ]
          ])
        }
      }
    }

    stage('Normalize Image Repo') {
      steps {
        echo "Using image repository: ${IMAGE_REPO}"
      }
    }

    stage('Check Docker') {
      steps {
        script {
          int dockerStatus = bat(returnStatus: true, script: '@docker info >nul 2>&1')
          if (dockerStatus != 0) {
            error 'Docker is not available. Aborting pipeline.'
          }
          echo 'Docker is available.'
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          if (fileExists('Dockerfile')) {
            bat "@docker build -t ${APP_NAME}:${IMAGE_TAG} ."
          }
        }
      }
    }

    stage('Tag Image') {
      steps {
        script {
          if (fileExists('Dockerfile')) {
            bat "@docker tag ${APP_NAME}:${IMAGE_TAG} ${IMAGE_REPO}:${IMAGE_TAG}"
            bat "@docker tag ${APP_NAME}:${IMAGE_TAG} ${IMAGE_REPO}:latest"
          }
        }
      }
    }

    stage('Push Image (optional)') {
      when {
        expression { return env.GHCR_TOKEN != null }
      }
      steps {
        script {
          if (fileExists('Dockerfile')) {
            withEnv(["GHCR_TOKEN=${env.GHCR_TOKEN}"]) {
              bat '''@(
                setlocal enabledelayedexpansion
                @for /f "tokens=*" %%A in ('type GHCR_TOKEN 2^>nul ^| findstr . ^|^| echo !GHCR_TOKEN!') do @(
                  echo %%A | docker login ghcr.io -u ${GHCR_USER} --password-stdin
                )
                docker push ${IMAGE_REPO}:${IMAGE_TAG}
                docker push ${IMAGE_REPO}:latest
              )'''
            }
          }
        }
      }
    }

    stage('Check Kubernetes') {
      steps {
        script {
          env.K8S_AVAILABLE = bat(returnStatus: true, script: '@kubectl cluster-info >nul 2>&1').toString() == '0'
          if (!env.K8S_AVAILABLE) {
            echo 'Kubernetes API is not reachable for Jenkins service. Skipping deploy stage.'
          }
        }
      }
    }

    stage('K8s Deploy (optional)') {
      when {
        expression { 
          return env.K8S_AVAILABLE == 'true' && fileExists('k8s/deployment.yaml')
        }
      }
      steps {
        script {
          bat '@kubectl apply -f k8s/'
        }
      }
    }
  }

  post {
    always {
      script {
        bat(returnStatus: true, script: '@docker image prune -f')
      }
    }
    success {
      echo 'Pipeline completed successfully.'
    }
    unstable {
      echo 'Pipeline completed with warnings. Review logs.'
    }
    failure {
      echo 'Pipeline failed. Check logs for details.'
    }
  }
}
