#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AiNewsStack } from '../lib/stack';

const app = new cdk.App();

const githubConnectionArn = app.node.tryGetContext('githubConnectionArn') as string;
if (!githubConnectionArn) {
  throw new Error('Missing required context: githubConnectionArn. Pass with -c githubConnectionArn=<arn>');
}

new AiNewsStack(app, 'AiNewsStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-west-2',
  },
  githubConnectionArn,
});
