
output "vpc_id" {
  description = "DocConnect VPC ID"
  value       = aws_vpc.docconnect.id
}

output "public_subnet_ids" {
  description = "DocConnect public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "backend_ecr_url" {
  description = "Backend Docker image repository"
  value       = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_url" {
  description = "Frontend Docker image repository"
  value       = aws_ecr_repository.frontend.repository_url
}

output "eks_cluster_name" {
  description = "DocConnect EKS cluster name"
  value       = aws_eks_cluster.docconnect.name
}

output "eks_cluster_endpoint" {
  description = "DocConnect Kubernetes API endpoint"
  value       = aws_eks_cluster.docconnect.endpoint
}
