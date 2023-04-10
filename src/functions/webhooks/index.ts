import { handlerPath } from '@libs/handler-resolver';
import type { AWS } from '@serverless/typescript';
import * as process from 'process';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  url: true,
  ...(
    process.env.IS_OFFLINE
      ? {
        events: [
          {
            http: {
              method: 'post',
              path: 'webhooks',
            },
          },
        ],
      }
      : {}
  ),
} as AWS['functions'][0];
