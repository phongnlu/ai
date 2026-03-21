#!/usr/bin/env bash
# deploy.sh — Deploy ai-news to AWS App Runner (GitHub source, no Docker/ECR)
set -euo pipefail

REGION="us-west-2"
CONNECTION_NAME="ai-news-github"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── AWS CLI wrapper (works around MacPorts Python 2.7 path conflict) ───────────
aws() { PYTHONPATH="" /usr/local/bin/aws "$@"; }
export -f aws

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo ""
echo "=== ai-news deploy ==="
echo "  Account : ${ACCOUNT_ID}"
echo "  Region  : ${REGION}"
echo ""

# ── Step 1: Store ANTHROPIC_API_KEY in SSM (only if not already set) ───────────
echo ">>> Step 1: Checking ANTHROPIC_API_KEY in SSM Parameter Store..."
EXISTING=$(aws ssm get-parameter --name "/ai-news/anthropic-api-key" \
  --region "$REGION" --query "Parameter.Value" --output text 2>/dev/null || echo "")

if [[ -z "$EXISTING" ]]; then
  ENV_FILE="${SCRIPT_DIR}/.env.local"
  ANTHROPIC_KEY=$(grep '^ANTHROPIC_API_KEY=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '\r' || echo "")
  if [[ -z "$ANTHROPIC_KEY" ]]; then
    echo "  ERROR: ANTHROPIC_API_KEY not found in SSM or .env.local"
    exit 1
  fi
  aws ssm put-parameter \
    --name "/ai-news/anthropic-api-key" \
    --value "$ANTHROPIC_KEY" \
    --type "SecureString" \
    --region "$REGION" \
    --no-cli-pager
  echo "  ✓ SSM parameter created"
else
  echo "  ✓ SSM parameter already exists, skipping"
fi

# ── Step 2: Create / verify GitHub connection ──────────────────────────────────
echo ""
echo ">>> Step 2: Checking GitHub App Runner connection..."

# Look for an existing AVAILABLE connection
CONNECTION_ARN=$(aws apprunner list-connections --region "$REGION" \
  --query "ConnectionSummaryList[?Status=='AVAILABLE'].ConnectionArn | [0]" \
  --output text 2>/dev/null || echo "None")

if [[ "$CONNECTION_ARN" == "None" || -z "$CONNECTION_ARN" ]]; then
  # Check if one is pending handshake
  PENDING_ARN=$(aws apprunner list-connections --region "$REGION" \
    --query "ConnectionSummaryList[?Status=='PENDING_HANDSHAKE'].ConnectionArn | [0]" \
    --output text 2>/dev/null || echo "None")

  if [[ "$PENDING_ARN" != "None" && -n "$PENDING_ARN" ]]; then
    echo ""
    echo "  ⚠  A GitHub connection exists but needs authorization."
    echo "     Go to the AWS Console to complete the OAuth handshake:"
    echo "     https://${REGION}.console.aws.amazon.com/apprunner/home#/connections"
    echo ""
    echo "     Re-run ./deploy.sh once the connection shows AVAILABLE."
    exit 1
  fi

  # Create a new connection
  echo "  Creating new GitHub connection '${CONNECTION_NAME}'..."
  CONNECTION_ARN=$(aws apprunner create-connection \
    --connection-name "$CONNECTION_NAME" \
    --provider-type GITHUB \
    --region "$REGION" \
    --query "Connection.ConnectionArn" \
    --output text)

  echo ""
  echo "  ⚠  Connection created but requires one-time GitHub authorization."
  echo "     Open the AWS Console and click 'Complete handshake':"
  echo "     https://${REGION}.console.aws.amazon.com/apprunner/home#/connections"
  echo ""
  echo "     Re-run ./deploy.sh once the connection shows AVAILABLE."
  exit 0
fi

echo "  ✓ GitHub connection: ${CONNECTION_ARN}"

# ── Step 3: Deploy CDK infrastructure ─────────────────────────────────────────
echo ""
echo ">>> Step 3: Deploying CDK infrastructure..."
cd "${SCRIPT_DIR}/infrastructure"

if [[ ! -d node_modules ]]; then
  npm install
fi

echo "  Bootstrapping CDK toolkit (upgrading if needed)..."
PYTHONPATH="" npx cdk bootstrap "aws://${ACCOUNT_ID}/${REGION}" \
  --toolkit-stack-name CDKToolkit \
  -c "githubConnectionArn=${CONNECTION_ARN}"
echo "  ✓ CDK bootstrap complete"

# Clean up orphaned resources if the stack doesn't exist or is in a failed state
STACK_STATUS=$(aws cloudformation describe-stacks \
  --stack-name AiNewsStack --region "$REGION" \
  --query "Stacks[0].StackStatus" --output text 2>/dev/null || echo "DOES_NOT_EXIST")

if [[ "$STACK_STATUS" == "DOES_NOT_EXIST" || "$STACK_STATUS" == "ROLLBACK_COMPLETE" ]]; then
  echo "  Cleaning up orphaned resources from failed previous attempt..."
  aws s3 rb "s3://ai-news-data-${ACCOUNT_ID}" --force 2>/dev/null || true
  if [[ "$STACK_STATUS" == "ROLLBACK_COMPLETE" ]]; then
    aws cloudformation delete-stack --stack-name AiNewsStack --region "$REGION"
    aws cloudformation wait stack-delete-complete --stack-name AiNewsStack --region "$REGION"
  fi
  echo "  ✓ Cleanup done"
fi

PYTHONPATH="" npx cdk deploy AiNewsStack \
  --require-approval never \
  --no-cli-pager \
  -c "githubConnectionArn=${CONNECTION_ARN}" \
  --outputs-file /tmp/ai-news-outputs.json

echo "  ✓ CDK deploy complete"

# ── Step 4: Print service URL ──────────────────────────────────────────────────
echo ""
echo ">>> Deployment complete!"
SERVICE_URL=$(python3 -c \
  "import json; d=json.load(open('/tmp/ai-news-outputs.json')); print(d['AiNewsStack']['ServiceUrl'])" \
  2>/dev/null || echo "(check AWS App Runner console)")

echo ""
echo "  App Runner URL : ${SERVICE_URL}"
echo ""
echo "  Notes:"
echo "  • First build takes ~3-5 min (App Runner builds from source)"
echo "  • Deployment is manual — re-run ./deploy.sh to redeploy"
echo "  • Pipeline runs on startup + every 6h (node-cron via instrumentation.ts)"
echo "  • To trigger manually: POST ${SERVICE_URL}/api/refresh"
echo ""
