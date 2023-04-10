import { middyfy } from '@libs/lambda';
import Stripe from 'stripe';
import * as process from 'process';
import { APIGatewayProxyHandler } from 'aws-lambda';
import logger from '@libs/logger';

const webhooks: APIGatewayProxyHandler = async (event) => {
  try {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
    const signature = event.headers['Stripe-Signature'];

    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY,
      {
        apiVersion: '2022-11-15',
      },
    );

    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      endpointSecret,
    );

    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
      logger.info(`PaymentIntent for ${paymentIntent.amount} was successful!`);
    }

    return {
      body: '',
      statusCode: 200,
    };
  } catch (error) {
    logger.error(`⚠️ Webhook signature verification failed: ${error.message}`);
    return {
      body: '',
      statusCode: 400,
    };
  }
};

export const main = middyfy(webhooks);
