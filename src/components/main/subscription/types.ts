export type Currency = 'naira' | 'dollars' | 'pounds';
export type BillingPeriod = 'monthly' | 'yearly';

export interface PricingPlan {
	id: string;
	name: string;
	price: number;
	currency: Currency;
	billingPeriod: BillingPeriod;
	description: string;
	features: string[];
	isCurrentPlan?: boolean;
	highlighted?: boolean;
}
