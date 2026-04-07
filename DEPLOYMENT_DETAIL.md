# 🚀 MyDevSchool - Complete Deployment & Access Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Accessing the Application](#accessing-the-application)
6. [Monitoring & Debugging](#monitoring--debugging)
7. [Pipeline Workflow](#pipeline-workflow)
8. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start

### To Access Your Running Website Right Now:

```bash
# Option 1: Using Port Forwarding (LOCAL ACCESS)
kubectl port-forward svc/mydevschool-web-service 3000:80
# Then visit: http://localhost:3000

# Option 2: Using Minikube Service
minikube service mydevschool-web-service --url
# Then visit the URL shown

# Option 3: Using NodePort (NETWORK ACCESS)
# Visit: http://192.168.49.2:30080
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Windows Machine                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐                                       │
│  │   Git/GitHub     │  → Stores source code                │
│  │  (Devops_proj)   │                                       │
│  └────────┬─────────┘                                       │
│           │                                                 │
│           ▼                                                 │
│  ┌──────────────────┐                                       │
│  │    Jenkins       │  → Automates CI/CD pipeline          │
│  │  (Port 8080)     │                                       │
│  └────────┬─────────┘                                       │
│           │                                                 │
│    ┌──────┴──────────────┐                                 │
│    │                     │                                 │
│    ▼                     ▼                                 │
│ ┌─────────┐         ┌──────────────┐                       │
│ │  Docker │         │   Minikube   │                       │
│ │  Daemon │         │  (K8s Local) │                       │
│ └─────────┘         └──────┬───────┘                       │
│                            │                               │
│                   ┌────────┴────────┐                      │
│                   │                 │                      │
│                   ▼                 ▼                      │
│              ┌─────────────────────────────┐              │
│              │   Kubernetes Cluster        │              │
│              │  ┌──────────────────────┐   │              │
│              │  │ Pod 1: nginx+website │   │              │
│              │  ├──────────────────────┤   │              │
│              │  │ Pod 2: nginx+website │   │              │
│              │  ├──────────────────────┤   │              │
│              │  │ Service NodePort:30080   │              │
│              │  └──────────────────────┘   │              │
│              └────────────┬─────────────────┘              │
│                           │                               │
│                 ┌─────────┴─────────┐                     │
│                 │                   │                     │
│         http://localhost:3000   http://192.168.49.2:30080 │
│                 │                   │                     │
│                 ▼                   ▼                     │
│            ┌─────────────────────────┐                   │
│            │   Your Browser          │                   │
│            │  (MyDevSchool Website)  │                   │
│            └─────────────────────────┘                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Prerequisites

Before running, ensure you have:

```bash
# Check all installations
docker --version          # Should be 29.0+
minikube version          # Should be 1.38+
kubectl version --client  # Should be 1.34+
git --version             # Should be 2.40+
```

### Required Tools:
- **Docker**: Container runtime (builds mydevschool image)
- **Minikube**: Local Kubernetes cluster
- **kubectl**: Kubernetes command-line tool
- **Git**: Version control
- **Jenkins**: CI/CD automation (optional, but recommended)

---

## 📦 Step-by-Step Setup

### Step 1: Start Minikube Cluster

```bash
# Start Minikube with Docker driver
minikube start --driver=docker --cpus=2 --memory=2048

# Verify it's running
kubectl get nodes
# Expected output: minikube   Ready    control-plane   STATUS

# Check Kubernetes version
kubectl version
```

### Step 2: Clone/Prepare Repository

```bash
# Navigate to project
cd c:\Users\KHAN\Desktop\mydevschool

# Verify files exist
ls -la Dockerfile           # Must exist
ls -la k8s/deployment.yaml  # Must exist
ls -la k8s/service.yaml     # Must exist
```

### Step 3: Build Docker Image

```bash
# Build the Docker image
docker build -t mydevschool:latest .

# Verify image was built
docker images | grep mydevschool
# Expected: mydevschool    latest    <IMAGE_ID>    <TIME>
```

### Step 4: Load Image into Minikube

```bash
# Load Docker image into Minikube cluster
minikube image load mydevschool:latest

# Verify image is in Minikube
minikube image ls | grep mydevschool
# Expected: docker.io/library/mydevschool:latest
```

### Step 5: Deploy to Kubernetes

```bash
# Apply deployment and service manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Verify deployment
kubectl get deployments
# Expected: mydevschool-web   2/2     2            2

# Verify service
kubectl get svc
# Expected: mydevschool-web-service   NodePort    10.x.x.x   <none>   80:30080/TCP
```

### Step 6: Check Pod Status

```bash
# Get pod status
kubectl get pods

# Wait for pods to be Ready
# Expected: 
# NAME                               READY   STATUS    RESTARTS   AGE
# mydevschool-web-6754d9689b-4nqpv   1/1     Running   0          30s
# mydevschool-web-6754d9689b-mtfl6   1/1     Running   0          30s
```

---

## 🌐 Accessing the Application

### Method 1: Port Forwarding (Recommended for Development)

```bash
# Forward local port 3000 to service port 80
kubectl port-forward svc/mydevschool-web-service 3000:80

# Open browser and visit
http://localhost:3000

# Notes:
# - Works on all networks (local development)
# - Simpler for local testing
# - Keep this terminal running
```

### Method 2: Minikube Service

```bash
# Open service in default browser
minikube service mydevschool-web-service

# OR get the URL manually
minikube service mydevschool-web-service --url
# Output: http://192.168.49.2:30080
```

### Method 3: Direct Node Access (If on Same Network)

```bash
# Get Minikube IP
minikube ip
# Output: 192.168.49.2

# Visit in browser
http://192.168.49.2:30080

# Notes:
# - Works if your machine is on the same Docker network
# - Typically used for testing from other machines
```

---

## 📊 What Each File Does

| File | Purpose | Contains |
|------|---------|----------|
| **Dockerfile** | Container definition | nginx base image + copies HTML files |
| **k8s/deployment.yaml** | K8s deployment config | 2 replicas, health checks, image reference |
| **k8s/service.yaml** | K8s service config | NodePort (30080), load balancing, routing |
| **Jenkinsfile** | CI/CD pipeline | Build → Tag → Deploy automation |
| **.git/config** | Git configuration | Repository URL, credentials |

---

## 🔍 Monitoring & Debugging

### View Logs

```bash
# Get pod logs
kubectl logs -f deployments/mydevschool-web

# Get logs from specific pod
kubectl logs mydevschool-web-6754d9689b-4nqpv

# Get logs from all pods
kubectl logs -f deployments/mydevschool-web --all-containers=true
```

### Describe Resources

```bash
# Get detailed deployment info
kubectl describe deployment mydevschool-web

# Get detailed service info
kubectl describe svc mydevschool-web-service

# Get detailed pod info
kubectl describe pod mydevschool-web-6754d9689b-4nqpv
```

### Health Checks

```bash
# Check readiness probe
kubectl get pod mydevschool-web-6754d9689b-4nqpv -o yaml | grep -A 10 readinessProbe

# Check liveness probe
kubectl get pod mydevschool-web-6754d9689b-4nqpv -o yaml | grep -A 10 livenessProbe

# Expected: Both probes should show httpGet path=/
```

### Get Environment Info

```bash
# Get cluster info
kubectl cluster-info

# Get node status
kubectl get nodes -o wide

# Get all resources
kubectl get all
```

---

## 🔄 Complete Pipeline Workflow

When you trigger a Jenkins build, here's what happens:

```
1. CHECKOUT
   └─ Jenkins pulls code from GitHub
   └─ Runs: git fetch, git checkout

2. DOCKER BUILD
   └─ Builds Docker image from Dockerfile
   └─ Command: docker build -t mydevschool:BUILD_NUMBER .
   └─ Result: Docker image in local Docker daemon

3. DOCKER TAG
   └─ Tags image for registry
   └─ Commands:
       - docker tag mydevschool:X ghcr.io/aatif05-it/mydevschool:X
       - docker tag mydevschool:X ghcr.io/aatif05-it/mydevschool:latest

4. CHECK KUBERNETES
   └─ Verifies Minikube cluster is accessible
   └─ Loads image into Minikube: minikube image load mydevschool:X

5. DEPLOY TO KUBERNETES
   └─ Applies manifests to cluster
   └─ Command: kubectl apply -f k8s/
   └─ Creates/updates:
       - Deployment (2 replicas)
       - Service (NodePort on :30080)

6. HEALTH CHECKS
   └─ Kubernetes runs readiness + liveness probes
   └─ Auto-restarts pods if they fail
   └─ Status: All pods should be Running + Ready

7. CLEANUP
   └─ Removes unused Docker images
   └─ Command: docker image prune -f

Result: Application accessible at http://localhost:3000
```

---

## 🧹 Cleanup & Maintenance

### To Stop Everything

```bash
# Delete Kubernetes deployment and service
kubectl delete deployment mydevschool-web
kubectl delete svc mydevschool-web-service

# Stop Minikube
minikube stop

# Delete Minikube cluster (completely reset)
minikube delete

# Remove Docker images (CAREFUL!)
docker rmi mydevschool:latest
docker rmi ghcr.io/aatif05-it/mydevschool:latest
```

### To Restart

```bash
# Start over from Step 1
minikube start --driver=docker
docker build -t mydevschool:latest .
minikube image load mydevschool:latest
kubectl apply -f k8s/
```

---

## 🐛 Troubleshooting

### Problem: Pods not starting (CrashLoopBackOff)

```bash
# Check pod logs
kubectl logs mydevschool-web-6754d9689b-4nqpv

# Describe pod for error messages
kubectl describe pod mydevschool-web-6754d9689b-4nqpv

# Solutions:
# - Check if image exists: minikube image ls
# - Verify Dockerfile is correct
# - Check imagePullPolicy in deployment.yaml (should be "Never" for local)
```

### Problem: Cannot access http://localhost:3000

```bash
# Check if port-forward is running
# (should show: "Forwarding from 127.0.0.1:3000 -> 80")

# If stopped, restart:
kubectl port-forward svc/mydevschool-web-service 3000:80

# Check if service exists
kubectl get svc mydevschool-web-service

# Check service endpoints
kubectl get endpoints mydevschool-web-service
```

### Problem: Jenkins cannot reach Kubernetes

```bash
# Verify kubectl works
kubectl cluster-info

# Check if Jenkins process can run kubectl
# From Jenkins terminal: kubectl get nodes

# Solutions:
# - Verify kubectl is in PATH
# - Check Jenkins user permissions
# - Add Jenkins to sudoers if needed
```

### Problem: Image pull errors

```bash
# For local images, ensure imagePullPolicy is "Never"
kubectl get deployment mydevschool-web -o yaml | grep imagePullPolicy

# If pulling from registry, check credentials
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=USERNAME \
  --docker-password=TOKEN
```

### Problem: Minikube out of disk space

```bash
# Check Minikube disk usage
minikube ssh -- df -h

# Solutions:
# - Clean up images: docker image prune -a
# - Clean up containers: docker container prune -a
# - Increase Minikube disk: minikube config set disk-size 30g
```

---

## 📈 Scaling & Updates

### Scale Replicas

```bash
# Change replicas in deployment.yaml
# From: replicas: 2
# To:   replicas: 3

# Apply changes
kubectl apply -f k8s/deployment.yaml

# OR use kubectl directly
kubectl scale deployment mydevschool-web --replicas=3

# Verify
kubectl get pods
# Should show 3 pods
```

### Update Image

```bash
# Rebuild Docker image
docker build -t mydevschool:latest .

# Load into Minikube
minikube image load mydevschool:latest

# Trigger rollout restart
kubectl rollout restart deployment mydevschool-web

# Watch rollout
kubectl rollout status deployment mydevschool-web
```

---

## 📝 Important Files Reference

### Dockerfile
```dockerfile
FROM nginx:1.27-alpine
COPY . /usr/share/nginx/html
```
- Uses lightweight Alpine-based nginx
- Copies all HTML/CSS/JS files to web root
- Exposes port 80

### k8s/deployment.yaml
```yaml
spec:
  replicas: 2                    # Two running instances
  imagePullPolicy: Never         # Use local images
  readinessProbe:                # Check if ready to serve traffic
    httpGet:
      path: /
      port: 80
    initialDelaySeconds: 5
    periodSeconds: 10
  livenessProbe:                 # Check if container is alive
    httpGet:
      path: /
      port: 80
    initialDelaySeconds: 10
    periodSeconds: 20
```

### k8s/service.yaml
```yaml
type: NodePort                   # Expose on host network
selector:
  app: mydevschool-web          # Route to pods with this label
ports:
  - protocol: TCP
    port: 80                     # Service port
    targetPort: 80               # Pod port
    nodePort: 30080              # Host port
```

---

## 🎯 Success Criteria

Your deployment is working correctly when:

✅ `kubectl get pods` shows `2/2 Running` for both pods  
✅ `kubectl get svc` shows port `80:30080` mapped  
✅ `http://localhost:3000` loads your website  
✅ `kubectl logs` show no errors  
✅ Pod readiness/liveness probes are passing  
✅ Jenkins pipeline completes with SUCCESS (not UNSTABLE)  

---

## 📞 Quick Commands Cheatsheet

```bash
# View everything
kubectl get all

# Watch pods
kubectl get pods -w

# See recent events
kubectl get events --sort-by='.lastTimestamp'

# Port forward
kubectl port-forward svc/mydevschool-web-service 3000:80

# Get service URL
minikube service mydevschool-web-service --url

# Edit deployment
kubectl edit deployment mydevschool-web

# Check resource usage
kubectl top pods
kubectl top nodes

# Restart deployment
kubectl rollout restart deployment mydevschool-web

# View config
kubectl config view

# Get detailed pod info
kubectl describe pod -l app=mydevschool-web
```

---

## 🎉 You're All Set!

Your MyDevSchool application is now running on a complete CI/CD pipeline with:

- ✅ **Source Control**: GitHub
- ✅ **Automation**: Jenkins
- ✅ **Containerization**: Docker
- ✅ **Orchestration**: Kubernetes (Minikube)
- ✅ **Health Monitoring**: Readiness & Liveness Probes
- ✅ **Load Balancing**: Kubernetes Service
- ✅ **Scalability**: 2 replicas (easily changeable)

**Access your application now:**
```
🌐 http://localhost:3000
```

---

**Last Updated**: April 8, 2026  
**Environment**: Windows 11, Minikube v1.38.1, Docker 29.2.1, Kubernetes 1.35.1
