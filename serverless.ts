import type { AWS } from '@serverless/typescript';
import { hello } from '@functions/index';
import { EsbuildOptions } from 'serverless-esbuild/dist/types';

const serverlessConfiguration: AWS = {
  service: 'stripe-webhooks',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-northeast-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      LOG_LEVEL: 'INFO',
      POWERTOOLS_SERVICE_NAME: 'stripe-webhooks',
      POWERTOOLS_LOGGER_LOG_EVENT: 'true',
    },
    layers: [
      'arn:aws:lambda:ap-northeast-1:094274105915:layer:AWSLambdaPowertoolsTypeScript:10',
    ],
  },
  // import the function via paths
  functions: {
    hello,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: [
        'aws-sdk',
        '@aws-lambda-powertools/logger',
      ],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      watch: {
        pattern: ['src/**/*.ts'],
        ignore: ['.build', 'dist', 'node_modules', '.serverless'],
      },
    } as EsbuildOptions,
    'serverless-offline': {
      noPrependStageInUrl: true,
      reloadHandler: true,
    },
  },
};

module.exports = serverlessConfiguration;
