
# DocConnect - EKS development cluster

resource "aws_eks_cluster" "docconnect" {
  name = "${var.project_name}-${var.environment}"

  role_arn = "arn:aws:iam::755729228637:role/docconnect-eks-cluster-role"

  vpc_config {
    subnet_ids = aws_subnet.public[*].id

    endpoint_public_access  = true
    endpoint_private_access = true

    public_access_cidrs = ["45.115.184.225/32"]
  }

  tags = {
    Project = var.project_name
    Env     = var.environment
  }
}

resource "aws_eks_node_group" "docconnect" {
  cluster_name    = aws_eks_cluster.docconnect.name
  node_group_name = "${var.project_name}-workers"

  node_role_arn = "arn:aws:iam::755729228637:role/docconnect-eks-node-role"

  subnet_ids = aws_subnet.public[*].id

  instance_types = ["t3.small"]
  capacity_type  = "ON_DEMAND"

  scaling_config {
    desired_size = 1
    min_size     = 1
    max_size     = 2
  }

  tags = {
    Project = var.project_name
    Env     = var.environment
  }
}
