#!/usr/bin/env bash
set -euo pipefail

APP_IMAGE="${1:-ghcr.io/owner/mydevschool:latest}"

echo "[1/4] Starting minikube if needed..."
minikube status >/dev/null 2>&1 || minikube start

echo "[2/4] Updating image in deployment manifest..."
sed -i "s#ghcr.io/owner/mydevschool:latest#${APP_IMAGE}#g" k8s/deployment.yaml

echo "[3/4] Applying Kubernetes manifests..."
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

echo "[4/4] Waiting for rollout..."
kubectl rollout status deployment/mydevschool-web

echo "Deployment done. Open service using:"
minikube service mydevschool-web-service --url
