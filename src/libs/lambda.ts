import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import logger from '@libs/logger';

export const middyfy = (handler) => {
  return middy(handler).use([
    injectLambdaContext(logger),
    middyJsonBodyParser(),
  ]);
};
