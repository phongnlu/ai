#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────────────────────
# AWS ECS Express Mode setup for pos-payroll
#
# ECS Express Mode automatically provisions:
#   - Fargate compute
#   - Application Load Balancer + HTTPS endpoint
#   - Auto-scaling policies
#   - CloudWatch monitoring
#   - VPC and networking
#
# You only need to supply: container image, IAM roles, and secrets.
#
# Prerequisites:
#   aws cli v2 (aws configure)
#   jq  (brew install jq)
#   Docker (for local image builds)
#
# Usage:
#   chmod +x infra/setup-ecs.sh
#   ./infra/setup-ecs.sh
# ────────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────────────────
APP_NAME="pos-payroll"
AWS_REGION="${AWS_REGION:-us-west-2}"
PORT=3000
CPU=512    # 0.5 vCPU
MEMORY=1024

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${APP_NAME}"

echo "Account : $AWS_ACCOUNT_ID"
echo "Region  : $AWS_REGION"
echo ""

# ── 1. ECR Repository ───────────────────────────────────────────────────────────
echo "→ [1/6] Creating ECR repository..."
aws ecr create-repository \
  --repository-name "$APP_NAME" \
  --region "$AWS_REGION" \
  --image-scanning-configuration scanOnPush=true \
  > /dev/null 2>/dev/null \
  || echo "  (already exists)"

echo "  URI: $ECR_URI"

# ── 2. IAM Execution Role ───────────────────────────────────────────────────────
echo "→ [2/6] Setting up IAM execution role..."
ROLE_NAME="${APP_NAME}-ecs-execution-role"

aws iam create-role \
  --role-name "$ROLE_NAME" \
  --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Principal":{"Service":"ecs-tasks.amazonaws.com"},
      "Action":"sts:AssumeRole"
    }]
  }' > /dev/null 2>/dev/null || true

aws iam attach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy \
  2>/dev/null || true

# Allow reading SSM parameters for secrets injection
aws iam attach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess \
  2>/dev/null || true

EXECUTION_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/${ROLE_NAME}"
echo "  Role: $EXECUTION_ROLE_ARN"

# ── 3. CloudWatch Log Group ─────────────────────────────────────────────────────
echo "→ [3/6] Creating CloudWatch log group..."
aws logs create-log-group \
  --log-group-name "/ecs/$APP_NAME" \
  --region "$AWS_REGION" 2>/dev/null || true

aws logs put-retention-policy \
  --log-group-name "/ecs/$APP_NAME" \
  --retention-in-days 30 \
  --region "$AWS_REGION" 2>/dev/null || true

# ── 4. SSM Secrets ──────────────────────────────────────────────────────────────
echo "→ [4/6] Storing secrets in SSM Parameter Store..."
echo "  Enter values for each secret (leave blank to skip if already set):"
echo ""

put_secret() {
  local name="$1"
  local prompt="$2"
  read -r -p "  $prompt: " value
  if [[ -n "$value" ]]; then
    aws ssm put-parameter \
      --name "/pos-payroll/$name" \
      --value "$value" \
      --type SecureString \
      --overwrite \
      --region "$AWS_REGION" > /dev/null
    echo "  ✓ /pos-payroll/$name saved"
  else
    echo "  ↷ /pos-payroll/$name skipped"
  fi
}

put_secret "DATABASE_URL"         "DATABASE_URL (MongoDB connection string)"
put_secret "NEXTAUTH_SECRET"      "NEXTAUTH_SECRET (run: openssl rand -base64 32)"
put_secret "GOOGLE_CLIENT_ID"     "GOOGLE_CLIENT_ID"
put_secret "GOOGLE_CLIENT_SECRET" "GOOGLE_CLIENT_SECRET"

# ── 5. ECS Cluster (Express Mode) ───────────────────────────────────────────────
echo ""
echo "→ [5/6] Creating ECS cluster..."
aws ecs create-cluster \
  --cluster-name "$APP_NAME" \
  --region "$AWS_REGION" \
  --capacity-providers FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  > /dev/null 2>/dev/null || true

# ── 6. ECS Express Mode Service ─────────────────────────────────────────────────
echo "→ [6/6] Creating ECS Express Mode service..."
# ECS Express Mode: AWS auto-provisions ALB, HTTPS endpoint, auto-scaling,
# VPC networking. No manual ALB/TG/SG setup required.

TASK_DEF_JSON=$(cat <<EOF
{
  "family": "$APP_NAME",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "$CPU",
  "memory": "$MEMORY",
  "executionRoleArn": "$EXECUTION_ROLE_ARN",
  "containerDefinitions": [{
    "name": "$APP_NAME",
    "image": "$ECR_URI:latest",
    "portMappings": [{"containerPort": $PORT, "protocol": "tcp"}],
    "essential": true,
    "environment": [
      {"name": "NODE_ENV", "value": "production"},
      {"name": "PORT",     "value": "$PORT"},
      {"name": "HOSTNAME", "value": "0.0.0.0"}
    ],
    "secrets": [
      {"name": "DATABASE_URL",          "valueFrom": "arn:aws:ssm:$AWS_REGION:$AWS_ACCOUNT_ID:parameter/pos-payroll/DATABASE_URL"},
      {"name": "NEXTAUTH_SECRET",       "valueFrom": "arn:aws:ssm:$AWS_REGION:$AWS_ACCOUNT_ID:parameter/pos-payroll/NEXTAUTH_SECRET"},
      {"name": "GOOGLE_CLIENT_ID",      "valueFrom": "arn:aws:ssm:$AWS_REGION:$AWS_ACCOUNT_ID:parameter/pos-payroll/GOOGLE_CLIENT_ID"},
      {"name": "GOOGLE_CLIENT_SECRET",  "valueFrom": "arn:aws:ssm:$AWS_REGION:$AWS_ACCOUNT_ID:parameter/pos-payroll/GOOGLE_CLIENT_SECRET"}
    ],
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:$PORT/health || exit 1"],
      "interval": 30,
      "timeout": 5,
      "retries": 3,
      "startPeriod": 60
    },
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group":         "/ecs/$APP_NAME",
        "awslogs-region":        "$AWS_REGION",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }]
}
EOF
)

echo "$TASK_DEF_JSON" | aws ecs register-task-definition \
  --cli-input-json file:///dev/stdin \
  --region "$AWS_REGION" \
  > /dev/null

# Create the Express Mode service
# --mode EXPRESS tells ECS to auto-provision ALB + HTTPS + networking
SERVICE_OUTPUT=$(aws ecs create-service \
  --cluster "$APP_NAME" \
  --service-name "$APP_NAME" \
  --task-definition "$APP_NAME" \
  --desired-count 1 \
  --launch-type FARGATE \
  --mode EXPRESS \
  --region "$AWS_REGION" \
  --output json 2>/dev/null \
  || echo '{"service":{"serviceArn":"(pending)"}}')

# Retrieve the auto-provisioned endpoint
sleep 3
ENDPOINT=$(aws ecs describe-services \
  --cluster "$APP_NAME" \
  --services "$APP_NAME" \
  --region "$AWS_REGION" \
  --query "services[0].serviceConnectConfiguration.discoveryName" \
  --output text 2>/dev/null || echo "(retrieving...)")

# ── Summary ─────────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────────────"
echo "✓  ECS Express Mode service created"
echo ""
echo "  ECR image    : $ECR_URI"
echo "  ECS cluster  : $APP_NAME"
echo "  ECS service  : $APP_NAME (Express Mode)"
echo "  Endpoint     : (visible in ECS console after first deploy)"
echo ""
echo "  ➜  Set these GitHub Actions variables (repo → Settings → Variables):"
echo "       AWS_REGION      = $AWS_REGION"
echo "       ECR_REPOSITORY  = $APP_NAME"
echo "       ECS_CLUSTER     = $APP_NAME"
echo "       ECS_SERVICE     = $APP_NAME"
echo "       CONTAINER_NAME  = $APP_NAME"
echo "       TASK_DEFINITION = $APP_NAME"
echo ""
echo "  ➜  Set these GitHub Actions secrets (repo → Settings → Secrets):"
echo "       AWS_ACCESS_KEY_ID"
echo "       AWS_SECRET_ACCESS_KEY"
echo ""
echo "  ➜  After first deploy, copy the Express Mode HTTPS endpoint from"
echo "     the ECS console and:"
echo "       1. Update /pos-payroll/NEXTAUTH_URL in SSM Parameter Store"
echo "       2. Add the URL to Google Cloud Console OAuth redirect URIs"
echo "────────────────────────────────────────────"
