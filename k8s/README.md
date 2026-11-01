# DocConnect Kubernetes Deployment

Namespace: `docconnect`

## Kubernetes Resources

- `namespace.yaml`: Application namespace.
- `backend-deployment.yaml`: Backend Deployment and ClusterIP Service.
- `frontend-deployment.yaml`: Frontend Deployment and public LoadBalancer Service.
- `postgres-statefulset.yaml`: PostgreSQL StatefulSet and headless Service.
- `postgres-configmap.yaml`: PostgreSQL configuration.
- `configmap.yaml`: Backend application configuration.
- `secrets.yaml`: Local Kubernetes Secrets, excluded from Git.
- `hpa.yaml`: Backend Horizontal Pod Autoscaler.

## Architecture

- Frontend: React application exposed through an internet-facing AWS Network Load Balancer.
- Backend: Express application exposed internally through `backend-service`.
- Database: PostgreSQL StatefulSet with persistent EBS storage.
- Autoscaling: Backend HPA based on CPU utilization.
- Health checks: Kubernetes readiness and liveness probes.

## Image Deployment

Jenkins builds and pushes versioned Docker images to Amazon ECR. It generates image tags using the Git commit and Jenkins build number, then updates the Deployments using `kubectl set image`.

The image references in the Deployment manifests represent the currently verified deployment baseline. Future Jenkins builds can use newer tags.

## Verification

```bash
kubectl get deployments -n docconnect
kubectl get pods -n docconnect
kubectl get services -n docconnect
kubectl get statefulset -n docconnect
kubectl get pvc -n docconnect
kubectl get hpa -n docconnect
```

## Security

- Never commit Kubernetes Secret values.
- `secrets.yaml` is excluded through `.gitignore`.
- Never commit passwords, JWT secrets, kubeconfig files or cloud credentials.
