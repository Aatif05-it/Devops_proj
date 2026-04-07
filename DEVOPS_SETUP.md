# DevOps Setup (Git + GitHub + Jenkins + Docker + Kubernetes + Minikube)

## Added to this project
- GitHub Actions pipeline: .github/workflows/ci-cd.yml
- Docker image build: Dockerfile
- Jenkins pipeline: Jenkinsfile
- Kubernetes manifests: k8s/deployment.yaml, k8s/service.yaml
- Minikube deploy script: scripts/deploy-minikube.sh
- Git ignore: .gitignore

## Connect to GitHub
1. Initialize git:
   git init
2. Commit files:
   git add .
   git commit -m "Add DevOps pipeline (GitHub Actions, Jenkins, Docker, K8s, Minikube)"
3. Connect to remote repository:
   git branch -M main
   git remote add origin https://github.com/Aatif05-it/Devops_proj.git
   git push -u origin main

## GitHub Actions CI/CD
- On push to main/master, workflow builds Docker image and pushes to GHCR.
- Image path: ghcr.io/<owner>/<repo>

## Jenkins
- Create Jenkins Pipeline job and point SCM to this repo.
- Set optional credentials if pushing image:
  - GHCR_USER
  - GHCR_TOKEN

## Docker local run
1. Build:
   docker build -t mydevschool:local .
2. Run:
   docker run -d -p 8080:80 --name mydevschool mydevschool:local
3. Open:
   http://localhost:8080

## Minikube deploy
1. Ensure kubectl + minikube installed.
2. Run:
   bash scripts/deploy-minikube.sh ghcr.io/aatif05-it/devops_proj:latest

## Important
- Image path is preconfigured as ghcr.io/aatif05-it/devops_proj:latest.
- For private GHCR images, create imagePullSecret in cluster.
