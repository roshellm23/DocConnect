# Grafana Prometheus Datasource

- Name: Prometheus
- Type: Prometheus
- Access: Server
- URL: http://prometheus.monitoring.svc.cluster.local:9090
- Namespace: monitoring
- Port: 9090
- Status: Connected (Save & Test successful)

## Architecture
Grafana accesses Prometheus internally through Kubernetes
service discovery. Prometheus is not publicly exposed.
