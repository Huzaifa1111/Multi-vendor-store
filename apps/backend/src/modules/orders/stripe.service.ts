
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_...';
        this.stripe = new Stripe(secretKey, {
            // apiVersion: '2023-10-16', // Let it use default or pinned version
        });
    }

    async createPaymentIntent(amount: number, currency: string = 'usd') {
        return this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });
    }

    async retrievePaymentIntent(id: string) {
        return this.stripe.paymentIntents.retrieve(id);
    }
}
