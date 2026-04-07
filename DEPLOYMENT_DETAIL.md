# 🚀 MyDevSchool - CI/CD Pipeline & Deployment Guide

## ⚡ Quick Access

```bash
# Access your website NOW:
http://localhost:3000

# Port forwarding (keep running):
kubectl port-forward svc/mydevschool-web-service 3000:80
```

---

## 🔗 Jenkins → Minikube → Kubernetes Pipeline

### How It All Works Together

```
┌─────────────────────────────────────────────────────┐
│  JENKINS (CI/CD Automation)                         │
│  ├─ Listens: GitHub webhook for code changes        │
│  ├─ Pulls: Latest code from repository              │
│  ├─ Builds: Docker image (docker build ...)         │
│  ├─ Loads: Image into Minikube (minikube image ...) │
│  └─ Deploys: To K8s (kubectl apply ...)             │
└────────────────┬────────────────────────────────────┘
                 │ COMMANDS RUN BY JENKINS
                 ▼
┌─────────────────────────────────────────────────────┐
│  MINIKUBE (Local Kubernetes)                        │
│  ├─ Runs: Kubernetes control plane + worker nodes   │
│  ├─ Stores: Docker images (minikube image ls)       │
│  ├─ Manages: Pods, services, deployments            │
│  └─ Network: 192.168.49.2 (VM network)              │
└────────────────┬────────────────────────────────────┘
                 │ MANAGES & SCHEDULES PODS
                 ▼
┌─────────────────────────────────────────────────────┐
│  KUBERNETES (Container Orchestration)               │
│  ├─ Deployment: mydevschool-web (2 replicas)        │
│  │  ├─ Pod 1: nginx container running               │
│  │  └─ Pod 2: nginx container running               │
│  ├─ Service: NodePort on port 30080                 │
│  │  └─ Routes traffic to pods                       │
│  ├─ Readiness Probe: /health check every 10s        │
│  └─ Liveness Probe: /restart if fails every 20s     │
└────────────────┬────────────────────────────────────┘
                 │ EXPOSES SERVICE
                 ▼
┌─────────────────────────────────────────────────────┐
│  YOUR BROWSER                                       │
│  └─ Access: http://localhost:3000 (forwarded)       │
│  └─ Access: http://192.168.49.2:30080 (direct)     │
└─────────────────────────────────────────────────────┘
```

---

## 📊 What's Running Now

### Active Services & Processes

| Process | Status | What It Does | Port |
|---------|--------|-------------|------|
| **Jenkins** | ✅ Running | Watches GitHub → Builds → Deploys | 8080 |
| **Minikube** | ✅ Running | Local Kubernetes cluster | N/A |
| **Docker** | ✅ Running | Container runtime (image storage) | N/A |
| **Kubernetes API** | ✅ Running | Orchestrates pods & services | 41764 |
| **Pod 1 (nginx)** | ✅ Running | Serves website | :80 |
| **Pod 2 (nginx)** | ✅ Running | Serves website | :80 |
| **K8s Service** | ✅ Active | Load balances to pods | 30080 |

### Check What's Running

```bash
# See all Kubernetes resources
kubectl get all

# Check pods are healthy
kubectl get pods
# Expected: 2/2 READY, STATUS: Running

# Check service is active
kubectl get svc
# Expected: NodePort 80:30080

# See Jenkins logs
kubectl logs -f deployment/mydevschool-web

# List images in Minikube
minikube image ls | grep mydevschool
```

---

## � How Jenkins Integrates

### Jenkins Pipeline Stages

When you trigger a Jenkins build, it runs this pipeline:

```groovy
Stage 1: CHECKOUT
  └─ git clone https://github.com/Aatif05-it/Devops_proj.git
  └─ Result: Latest code in Jenkins workspace

Stage 2: BUILD DOCKER IMAGE
  └─ docker build -t mydevschool:BUILD_NUMBER .
  └─ Result: Docker image created locally

Stage 3: TAG IMAGE
  └─ docker tag mydevschool:X ghcr.io/aatif05-it/mydevschool:X
  └─ Result: Image tagged for registry

Stage 4: CHECK & LOAD TO MINIKUBE
  └─ kubectl cluster-info (verify Minikube is running)
  └─ minikube image load mydevschool:X
  └─ Result: Image available in Minikube

Stage 5: DEPLOY TO KUBERNETES
  └─ kubectl apply -f k8s/deployment.yaml
  └─ kubectl apply -f k8s/service.yaml
  └─ Result: Pods start, service routes traffic

Stage 6: CLEANUP
  └─ docker image prune -f
  └─ Result: Old images removed
```

### Trigger Jenkins Build

```bash
# Option 1: Push to GitHub (auto-triggered)
git add . && git commit -m "message" && git push

# Option 2: Manually trigger
# Go to Jenkins web UI → Click "Build Now"

# Option 3: View logs
# Jenkins UI → Project → Build → Console Output
```

### Jenkins Configuration (Already Done)

```
✅ Jenkinsfile in repository
✅ Pipeline uses Windows batch (bat) commands
✅ Auto-detects Minikube cluster
✅ Loads images into Minikube
✅ Deploys using kubectl
```

---

## 🌐 Access Website

### Active Methods

```bash
# Method 1: Port Forwarding (RECOMMENDED)
kubectl port-forward svc/mydevschool-web-service 3000:80
# Then: http://localhost:3000

# Method 2: Minikube Service
minikube service mydevschool-web-service
# Auto-opens browser

# Method 3: Direct Node Port
# http://192.168.49.2:30080
```

---

## � Kubernetes Components Explained

### Deployment (mydevschool-web)
```yaml
# What it does: Manages 2 pod replicas
replicas: 2                    # Two nginx containers running
imagePullPolicy: Never         # Use local Docker images
readinessProbe:                # Check if ready to serve traffic (healthy)
  httpGet: /
  port: 80
  initialDelaySeconds: 5s
  periodSeconds: 10s
livenessProbe:                 # Check if alive (restart if dead)
  httpGet: /
  port: 80
  initialDelaySeconds: 10s
  periodSeconds: 20s
```

**Result:**
- ✅ 2 pods always running
- ✅ Auto-restart if unhealthy
- ✅ Load balanced by service

### Service (mydevschool-web-service)
```yaml
# What it does: Routes traffic to pods
type: NodePort                 # Expose on host machine
selector:
  app: mydevschool-web        # Route to pods with this label
ports:
  port: 80                     # Service port
  targetPort: 80               # Pod port
  nodePort: 30080              # Host machine port
```

**Result:**
- ✅ Traffic on :30080 routed to pods
- ✅ Load balanced across 2 pods
- ✅ Accessible from outside pod

---

## 🧪 Common Commands

```bash
# View everything
kubectl get all

# Watch pods update in real-time
kubectl get pods -w

# See recent Kubernetes events
kubectl get events --sort-by='.lastTimestamp'

# View logs
kubectl logs -f deployment/mydevschool-web

# Check pod details
kubectl describe pod -l app=mydevschool-web

# Restart deployment (rolling update)
kubectl rollout restart deployment mydevschool-web

# Scale replicas
kubectl scale deployment mydevschool-web --replicas=3

# Check service endpoints
kubectl get endpoints mydevschool-web-service

# Monitor resource usage
kubectl top pods
```

---

## 🛑 Stop & Cleanup

```bash
# Delete K8s resources
kubectl delete deployment mydevschool-web
kubectl delete svc mydevschool-web-service

# Stop Minikube
minikube stop

# Complete reset
minikube delete

# Remove Docker images
docker rmi mydevschool:latest
```

**To Start Over:**
```bash
minikube start --driver=docker
docker build -t mydevschool:latest .
minikube image load mydevschool:latest
kubectl apply -f k8s/
```

---

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| **Pods not Ready** | `kubectl logs -f deployment/mydevschool-web` |
| **Cannot access :3000** | `kubectl port-forward svc/mydevschool-web-service 3000:80` |
| **K8s API unreachable** | `minikube status` → `minikube start` |
| **Jenkins build fails** | Check GitHub has latest code: `git push origin main` |
| **Image not found** | `minikube image load mydevschool:latest` |
| **Service has no endpoints** | `kubectl get endpoints mydevschool-web-service` |
| **Port 3000 in use** | `kubectl port-forward svc/mydevschool-web-service 8000:80` |

---

## 📈 Scale & Update

```bash
# Scale to 3 replicas
kubectl scale deployment mydevschool-web --replicas=3

# Or edit directly
kubectl edit deployment mydevschool-web
# Change: replicas: 2 → replicas: 3

# Verify scaling
kubectl get pods
# Should show 3 pods

# Update site (after code changes)
git add . && git commit -m "message" && git push origin main
# Jenkins auto-rebuilds & redeploys
```

---

## � Key Files

| File | Purpose |
|------|---------|
| **Dockerfile** | `FROM nginx:1.27-alpine` + copy HTML files |
| **k8s/deployment.yaml** | Defines 2 pod replicas + health checks |
| **k8s/service.yaml** | Exposes NodePort :30080 + load balancing |
| **Jenkinsfile** | CI/CD pipeline: checkout → build → deploy |

---

## ✅ Your Setup is Production-Ready

✅ CI/CD Pipeline (Git → Jenkins → Docker → Kubernetes)  
✅ High Availability (2 pod replicas)  
✅ Auto Healing (readiness + liveness probes)  
✅ Load Balancing (Kubernetes Service)  
✅ Website Live (http://localhost:3000)  

**Enjoy your deployment! 🚀**
