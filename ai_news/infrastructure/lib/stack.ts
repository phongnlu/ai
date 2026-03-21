import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import { Construct } from 'constructs';

export interface AiNewsStackProps extends cdk.StackProps {
  githubConnectionArn: string;
}

export class AiNewsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AiNewsStackProps) {
    super(scope, id, props);

    // ── S3 bucket for articles.json + feed.xml ─────────────────────────────────
    const bucket = new s3.Bucket(this, 'DataBucket', {
      bucketName: `ai-news-data-${this.account}`,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // ── IAM instance role (runs the container / source service) ────────────────
    const instanceRole = new iam.Role(this, 'InstanceRole', {
      roleName: 'ai-news-apprunner-instance',
      assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com'),
    });
    bucket.grantReadWrite(instanceRole);
    instanceRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['ssm:GetParameter', 'ssm:GetParameters'],
      resources: [`arn:aws:ssm:${this.region}:${this.account}:parameter/ai-news/*`],
    }));

    // ── Auto-scaling: fixed single instance (prevents surprise scale-out costs) ──
    const scaling = new apprunner.CfnAutoScalingConfiguration(this, 'Scaling', {
      autoScalingConfigurationName: 'ai-news-single',
      minSize: 1,
      maxSize: 1,
      maxConcurrency: 100,
    });

    // ── App Runner service (source: GitHub) ────────────────────────────────────
    const service = new apprunner.CfnService(this, 'Service', {
      serviceName: 'ai-news',
      sourceConfiguration: {
        autoDeploymentsEnabled: false,
        authenticationConfiguration: {
          connectionArn: props.githubConnectionArn,
        },
        codeRepository: {
          repositoryUrl: 'https://github.com/phongnlu/ai',
          sourceCodeVersion: { type: 'BRANCH', value: 'master' },
          sourceDirectory: 'ai_news',
          codeConfiguration: {
            configurationSource: 'REPOSITORY', // reads apprunner.yaml
          },
        },
      },
      // Minimum valid CPU/memory combination
      instanceConfiguration: {
        instanceRoleArn: instanceRole.roleArn,
        cpu: '256',    // 0.25 vCPU
        memory: '512', // 0.5 GB
      },
      autoScalingConfigurationArn: scaling.attrAutoScalingConfigurationArn,
      healthCheckConfiguration: {
        protocol: 'HTTP',
        path: '/api/feed',
        interval: 20,
        timeout: 5,
        healthyThreshold: 1,
        unhealthyThreshold: 5,
      },
    });

    // ── Outputs ────────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'S3 bucket for article data',
    });
    new cdk.CfnOutput(this, 'ServiceUrl', {
      value: `https://${service.attrServiceUrl}`,
      description: 'App Runner service URL',
    });
  }
}
