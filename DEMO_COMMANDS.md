# 🎯 MyDevSchool CI/CD Pipeline Demo Script

## For Presenting to Your Manager/Sir

---

## **Part 1: Verify System is Ready**

```bash
# Check Minikube status
minikube status

# Expected Output:
# minikube
# type: Control Plane
# host: Running
# kubelet: Running
# apiserver: Running
# kubeconfig: Configured
```

```bash
# Check Kubernetes cluster
kubectl cluster-info

# Expected Output:
# Kubernetes control plane is running at https://127.0.0.1:41764
```

```bash
# Check Docker
docker --version

# Expected Output:
# Docker version 29.2.1, build a5c7197
```

---

## **Part 2: Show Kubernetes Resources**

```bash
# See everything running
kubectl get all

# Expected Output:
# PODS - 2 running
# SERVICES - NodePort on :30080
# DEPLOYMENT - mydevschool-web with 2 replicas
# REPLICASET - Managing the pods
```

```bash
# Check pods in detail
kubectl get pods -o wide

# Expected Output:
# NAME                               READY   STATUS    RESTARTS   AGE    IP
# mydevschool-web-5bccc69ccd-p66vk   1/1     Running   0          5m     10.244.0.X
# mydevschool-web-5bccc69ccd-qjqff   1/1     Running   0          5m     10.244.0.X
```

```bash
# Check service details
kubectl get svc mydevschool-web-service

# Expected Output:
# NAME                      TYPE        CLUSTER-IP       PORT(S)        AGE
# mydevschool-web-service   NodePort    10.109.112.212   80:30080/TCP   10h
```

```bash
# Check deployment status
kubectl describe deployment mydevschool-web

# Shows: Replicas desired vs running, image, pods, events
```

---

## **Part 3: View Logs & Health**

```bash
# View website logs
kubectl logs -f deployment/mydevschool-web

# Shows: nginx access logs from both pods
# Every time you access the website, logs appear here
```

```bash
# Check specific pod
kubectl logs mydevschool-web-5bccc69ccd-p66vk

# Shows: Logs from Pod 1
```

```bash
# Check pod details (health probes)
kubectl describe pod -l app=mydevschool-web

# Shows:
# - Readiness Probe: PASS ✅
# - Liveness Probe: PASS ✅
# - Container running
```

```bash
# Monitor pod resources
kubectl top pods

# Shows: CPU and Memory usage of each pod
```

---

## **Part 4: Start Port Forwarding**

```bash
# Open your website locally
kubectl port-forward svc/mydevschool-web-service 3000:80

# This terminal will show:
# Forwarding from 127.0.0.1:3000 -> 80
# Handling connection for 3000 (when accessed)

# KEEP THIS RUNNING!
```

---

## **Part 5: Access Website (In Browser)**

```
Open in Browser: http://localhost:3000

You should see your MyDevSchool website!
```

---

## **Part 6: Show Jenkins Pipeline (Optional)**

```bash
# View Jenkinsfile
cat Jenkinsfile

# Shows the entire CI/CD pipeline stages
```

```bash
# Check image in Minikube
minikube image ls | grep mydevschool

# Shows: docker.io/library/mydevschool:latest
```

---

## **Part 7: Demonstrate Auto-Scaling**

```bash
# Scale to 3 replicas
kubectl scale deployment mydevschool-web --replicas=3

# Verify new pod starting
kubectl get pods

# Shows: 3 pods now running (1 newly created)
```

```bash
# Scale back to 2
kubectl scale deployment mydevschool-web --replicas=2

# Shows: 1 pod terminating
```

---

## **Part 8: Test High Availability (Chaos Engineering)**

```bash
# Kill one pod (it auto-restarts)
kubectl delete pod mydevschool-web-5bccc69ccd-p66vk

# Immediately watch pods
kubectl get pods -w

# You'll see:
# - Pod terminating
# - New pod starting (automatically)
# - Website still works!
```

```bash
# Website still accessible
# http://localhost:3000 (still works!)

# This shows: High Availability & Auto-Healing ✅
```

---

## **Part 9: Show Rolling Update (Code Change)**

```bash
# In your repo, make a change to website
# Example: Edit index.html

git add . && git commit -m "Demo: website update" && git push origin main

# Jenkins automatically:
# 1. Pulls code
# 2. Builds Docker image
# 3. Loads to Minikube
# 4. Deploys to Kubernetes

# Check deployment status
kubectl rollout status deployment mydevschool-web

# View pods restarting
kubectl get pods -w
```

---

## **Part 10: Show Jenkins Build History**

```bash
# Open Jenkins UI
http://localhost:8080

# Show:
# - Build history
# - Recent successful builds
# - Build logs
# - Pipeline visualization
```

---

## **Complete Demo Flow (10 minutes)**

```
⏱️  Step 1 (30 sec):  Run: kubectl get all
    └─ Show: All resources running

⏱️  Step 2 (30 sec):  Run: kubectl get pods -o wide
    └─ Show: 2 pods with IPs, status

⏱️  Step 3 (30 sec):  Run: kubectl describe pod -l app=mydevschool-web
    └─ Show: Health checks passing

⏱️  Step 4 (1 min):   Run: kubectl port-forward svc/mydevschool-web-service 3000:80
    └─ Keep running in background

⏱️  Step 5 (1 min):   Open: http://localhost:3000 in browser
    └─ Show: Website running

⏱️  Step 6 (1 min):   Run: kubectl logs -f deployment/mydevschool-web
    └─ Show: Logs updating from both pods

⏱️  Step 7 (1 min):   Run: kubectl scale deployment mydevschool-web --replicas=3
    └─ Show: Scaling to 3 pods

⏱️  Step 8 (1 min):   Run: kubectl get pods -w
    └─ Show: New pod starting and becoming ready

⏱️  Step 9 (1 min):   Run: kubectl delete pod <POD_NAME>
    └─ Show: Pod auto-restarting (high availability)

⏱️  Step 10 (2 min):  Show Jenkins UI
    └─ Show: Build history and pipeline
```

---

## **Quick Commands Summary for Demo**

```bash
# Copy-paste these in order:

# 1. Show all resources
kubectl get all

# 2. Show pods detail
kubectl get pods -o wide

# 3. Show service
kubectl get svc

# 4. Show pod health
kubectl describe pod -l app=mydevschool-web

# 5. Start port forward (keep running)
kubectl port-forward svc/mydevschool-web-service 3000:80

# 6. In new terminal - check logs
kubectl logs -f deployment/mydevschool-web

# 7. Scale replicas
kubectl scale deployment mydevschool-web --replicas=3

# 8. Watch pods
kubectl get pods -w

# 9. Kill pod (auto-restarts)
kubectl delete pod $(kubectl get pod -l app=mydevschool-web -o jsonpath='{.items[0].metadata.name}')

# 10. Check roll out
kubectl rollout status deployment mydevschool-web
```

---

## **Key Points to Explain**

### 🎯 Show These:

1. **Kubernetes Resources**: 2 pods always running (high availability)
2. **Load Balancing**: Service routes traffic between pods
3. **Health Checks**: Readiness + Liveness probes working
4. **Auto-Healing**: Pod died → automatically restarted
5. **Scaling**: Easy scale up/down (2→3 replicas)
6. **Website**: Running at http://localhost:3000
7. **CI/CD**: Jenkins auto-builds + deploys on git push
8. **Logs**: Real-time pod logs showing requests

---

## **Technical Details to Mention**

```
Architecture:
├─ GitHub (Source code)
├─ Jenkins (CI/CD - automatic builds)
├─ Docker (Container images)
├─ Minikube (Local Kubernetes cluster)
├─ Kubernetes (Orchestration)
│  ├─ Deployment (manages replicas)
│  ├─ Pods (running containers)
│  └─ Service (load balancing)
└─ Website (serving HTTP)

Benefits:
✅ High Availability (multiple pods)
✅ Auto-Healing (failed pods restart)
✅ Easy Scaling (add/remove pods)
✅ Continuous Deployment (auto-deploy on code change)
✅ Load Balancing (distribute traffic)
✅ Container Orchestration (Kubernetes manages everything)
```

---

## **Useful Demo Notes**

- **Before demo**: Run all `kubectl get` commands to show baseline
- **During demo**: Keep one terminal showing logs (`kubectl logs -f`)
- **Keep browser open**: Have http://localhost:3000 ready
- **Terminal size**: Make terminals larger for visibility
- **Timing**: Allow ~2-3 seconds for pod scaling/updates to show
- **PowerPoint**: Have screenshots ready for backup

---

**Good luck with your presentation! 🚀**
