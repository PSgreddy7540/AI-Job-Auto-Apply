# Kubernetes Deployment Guide

This directory contains all Kubernetes manifests for deploying the AI Job Application Automator on a Kubernetes cluster.

## Overview

The deployment has been migrated from Docker Compose to Kubernetes for better scalability, reliability, and cloud-native operations.

## Files

### Core Deployment Files

1. **backend-deployment.yaml** - Kubernetes Deployment for the backend service
   - 3 replicas for high availability
   - Rolling update strategy (maxSurge: 1, maxUnavailable: 0)
   - Resource limits and requests
   - Health checks (liveness and readiness probes)
   - Pod anti-affinity for distribution

2. **backend-service.yaml** - Kubernetes Services
   - ClusterIP service for internal communication
   - LoadBalancer service for external access
   - Port 80 → 8000 mapping

3. **configmap.yaml** - Configuration management
   - Development configuration (ai-job-config)
   - Production configuration (ai-job-config-prod)
   - Logging, CORS, and rate limiting settings

4. **secrets-template.yaml** - Secrets template (DO NOT commit actual secrets)
   - Database connection strings
   - Redis URLs
   - JWT and API keys
   - Email configurations
   - Use this as a template to create actual secrets

5. **ingress.yaml** - Ingress and Network Policies
   - NGINX ingress controller configuration
   - TLS/HTTPS support with Let's Encrypt
   - Rate limiting and request size limits
   - NetworkPolicy for security

6. **README.md** - This file

## Prerequisites

- Kubernetes cluster (1.19+)
- kubectl configured to access your cluster
- NGINX ingress controller
- Cert-manager for TLS certificates (optional but recommended)
- PostgreSQL and Redis services (external or deployed separately)

## Quick Start

### 1. Create Kubernetes Secrets

```bash
# Create secrets from template (customize values first)
kubectl create secret generic ai-job-secrets \
  --from-literal=database-url='postgresql://user:pass@postgres:5432/db' \
  --from-literal=redis-url='redis://user:pass@redis:6379/0' \
  --from-literal=jwt-secret='your-secret-key'
```

### 2. Deploy ConfigMap

```bash
kubectl apply -f configmap.yaml
```

### 3. Deploy Deployment

```bash
kubectl apply -f backend-deployment.yaml
```

### 4. Deploy Services

```bash
kubectl apply -f backend-service.yaml
```

### 5. Deploy Ingress

```bash
kubectl apply -f ingress.yaml
```

### Deploy All at Once

```bash
kubectl apply -f .
```

## Verification

### Check Deployment Status

```bash
kubectl get deployments
kubectl describe deployment ai-job-backend
kubectl get pods
```

### View Logs

```bash
kubectl logs -f deployment/ai-job-backend
kubectl logs -f pod/ai-job-backend-xxxx
```

### Check Services

```bash
kubectl get services
kubectl get ingress
```

## Monitoring

### Health Check

```bash
kubectl exec -it pod/ai-job-backend-xxxx -- curl http://localhost:8000/health
```

### Port Forwarding

```bash
kubectl port-forward svc/ai-job-backend 8000:80
```

## Scaling

### Manual Scaling

```bash
kubectl scale deployment ai-job-backend --replicas=5
```

### Horizontal Pod Autoscaler (HPA)

```bash
kubectl autoscale deployment ai-job-backend --min=3 --max=10 --cpu-percent=80
```

## Updates and Rollouts

### Update Image

```bash
kubectl set image deployment/ai-job-backend \
  ai-job-backend=psreddy7540/ai-job-backend:v2.0.0
```

### Check Rollout Status

```bash
kubectl rollout status deployment/ai-job-backend
```

### Rollback to Previous Version

```bash
kubectl rollout undo deployment/ai-job-backend
```

## Cleanup

```bash
kubectl delete -f .
```

## Security Considerations

1. **Secrets Management**: Use tools like Sealed Secrets or HashiCorp Vault for production
2. **RBAC**: Implement Role-Based Access Control for cluster access
3. **Network Policies**: Review and adjust network policies for your environment
4. **Image Registry**: Use private image registries with authentication
5. **Pod Security**: Consider using Pod Security Policies or Pod Security Standards

## Troubleshooting

### Pod Stuck in Pending

```bash
kubectl describe pod ai-job-backend-xxxx
```

### Service Not Accessible

```bash
kubectl get endpoints ai-job-backend
kubectl describe service ai-job-backend
```

### Ingress Not Working

```bash
kubectl get ingress
kubectl describe ingress ai-job-backend-ingress
```

## Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [Cert-Manager](https://cert-manager.io/)
- [Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
