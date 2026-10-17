# Terraform directory reserved for Person 3 (AWS + Terraform)
# DocConnect — Terraform Infrastructure

## Overview

This directory contains the Terraform configuration used to provision the AWS infrastructure for DocConnect.

## Infrastructure Components

- Amazon VPC and public subnets
- Internet Gateway and public routing
- Amazon ECR repositories for backend and frontend images
- Amazon EKS cluster
- Managed EKS worker node group
- Terraform outputs for infrastructure references

## Prerequisites

- Terraform CLI
- AWS CLI
- An AWS account with authorized permissions
- kubectl for Kubernetes verification

## Setup

Initialize Terraform:

```bash
terraform init
```

Review the proposed infrastructure changes:

```bash
terraform plan
```

Apply changes only after reviewing the plan and confirming authorization:

```bash
terraform apply
```

## Verify the Kubernetes Cluster

After infrastructure provisioning, configure kubectl:

```bash
aws eks update-kubeconfig --region ap-south-1 --name docconnect-dev
kubectl get nodes
kubectl get pods -A
```

## Outputs

Terraform provides outputs for the EKS cluster, ECR repositories, VPC, and subnet references.

Run the following command to inspect configured outputs:

```bash
terraform output
```

## Security Notes

- Never commit AWS credentials or application secrets.
- Do not commit Terraform state files, state backups, or generated plan files.
- Keep Terraform state in an appropriately secured location.
- Review all proposed changes before applying or destroying infrastructure.

## Cost Considerations

Amazon EKS and associated compute resources may incur ongoing charges. Review AWS billing and coordinate with the project team before changing or deleting shared resources.

## Ownership

Person 3 is responsible for Terraform and AWS infrastructure provisioning. Kubernetes application manifests and application deployment are handled by Person 4.
# - providers.tf
# - terraform.tfvars.example
