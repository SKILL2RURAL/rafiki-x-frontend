import { api } from '$lib/api';
import { AxiosError } from 'axios';
import { toast } from 'svelte-sonner';
import { writable, derived, get } from 'svelte/store';
import { auth } from './authStore';

// Types for Subscription Status
export interface PlanLimit {
	limit: number;
	description: string;
	unlimited: boolean;
}

export interface PlanLimits {
	resume?: PlanLimit;
	voice?: PlanLimit;
	chat?: PlanLimit;
}

export interface FeatureUsage {
	feature: string;
	used: number;
	limit: number;
	remaining: number;
	unlimited: boolean;
}

export interface CurrentUsage {
	resume?: FeatureUsage;
	voice?: FeatureUsage;
	chat?: FeatureUsage;
}

export interface SubscriptionStatus {
	subscriptionId: string | null;
	plan: 'FREE' | 'SUPPORT' | string;
	status: string | null;
	billingCycle: string | null;
	startDate: string | null;
	endDate: string | null;
	amount: number | null;
	currency: string | null;
	limits: PlanLimits;
	currentUsage: CurrentUsage;
	active: boolean;
}

// Types for Plans
export interface FreePlan {
	description: string;
	name: string;
	price: number;
	limits: PlanLimits;
}

export interface SupportPlanPricing {
	ngn: number;
	usd: number;
}

export interface SupportPlan {
	description: string;
	name: string;
	limits: PlanLimits;
	pricing: {
		monthly: SupportPlanPricing;
		yearly: SupportPlanPricing;
	};
}

export interface PlansResponse {
	free: FreePlan;
	support: SupportPlan;
}

// Types for Subscription Initialization
export interface InitializeSubscriptionPayload {
	billingCycle: 'MONTHLY' | 'YEARLY';
	currency: 'NGN' | 'USD';
	callbackUrl: string;
}

export interface PaymentData {
	success: boolean;
	authorizationUrl: string;
	accessCode: string;
	reference: string;
	amount: number;
	currency: string;
}

export interface InitializeSubscriptionResponse {
	success: boolean;
	authorizationUrl: string;
	accessCode: string;
	reference: string;
	amount: number;
	currency: string;
}

// Types for Transaction History
export interface Transaction {
	id: number;
	amount: number;
	status: 'SUCCESS' | 'PENDING' | 'FAILED';
	currency: string;
	paidAt: string | null;
	createdAt: string;
	paymentChannel: string;
	reference: string;
}

export interface TransactionsResponse {
	success: boolean;
	message: string;
	data: {
		content: Transaction[];
		totalPages: number;
		totalElements: number;
		page: number;
		last: boolean;
		first: boolean;
		size: number;
	};
}

// Subscription Status Store
interface SubscriptionState {
	status: SubscriptionStatus | null;
	isLoading: boolean;
	error: string | null;
}

const initialSubscriptionState: SubscriptionState = {
	status: null,
	isLoading: false,
	error: null
};

export const subscriptionStatus = writable<SubscriptionState>(initialSubscriptionState);

// Plans Store
interface PlansState {
	plans: PlansResponse | null;
	isLoading: boolean;
	error: string | null;
}

const initialPlansState: PlansState = {
	plans: null,
	isLoading: false,
	error: null
};

export const subscriptionPlans = writable<PlansState>(initialPlansState);

// Transactions Store
interface TransactionsState {
	transactions: Transaction[];
	isLoading: boolean;
	error: string | null;
	totalPages: number;
	page: number;
	size: number;
	first: boolean;
	last: boolean;
	totalElement: number;
}

const initialTransactionsState: TransactionsState = {
	transactions: [],
	isLoading: false,
	error: null,
	totalPages: 0,
	page: 1,
	size: 10,
	first: true,
	last: false,
	totalElement: 0
};

export const transactions = writable<TransactionsState>(initialTransactionsState);

// Derived stores
export const currentPlan = derived(subscriptionStatus, ($status) => $status.status?.plan || 'FREE');
export const isSubscriptionActive = derived(
	subscriptionStatus,
	($status) => $status.status?.active || false
);

// Helper function to generate features from limits
export function generateFeatures(limits: PlanLimits): string[] {
	const features: string[] = [];

	if (limits.chat) {
		if (limits.chat.unlimited) {
			features.push('Unlimited AI chat messages');
		} else {
			features.push(`${limits.chat.limit} ${limits.chat.description}`);
		}
	}

	if (limits.resume) {
		if (limits.resume.unlimited) {
			features.push('Unlimited resume uploads');
		} else {
			features.push(`${limits.resume.limit} ${limits.resume.description}`);
		}
	}

	if (limits.voice) {
		if (limits.voice.unlimited) {
			features.push('Unlimited voice analysis');
		} else {
			features.push(`${limits.voice.limit} ${limits.voice.description}`);
		}
	}

	return features;
}

// Fetch subscription status
export async function fetchSubscriptionStatus() {
	// Check if user has access token before making the API call
	const accessToken = get(auth).accessToken;

	if (!accessToken) {
		// No token, don't make the API call
		subscriptionStatus.set({
			status: null,
			isLoading: false,
			error: null
		});
		return;
	}

	subscriptionStatus.update((state) => ({ ...state, isLoading: true, error: null }));

	try {
		const { data } = await api.get('/subscription/status');

		if (data.success && data.data) {
			subscriptionStatus.set({
				status: data.data,
				isLoading: false,
				error: null
			});
		} else {
			const errorMessage = data.message || 'Failed to load subscription status';
			subscriptionStatus.set({
				status: null,
				isLoading: false,
				error: errorMessage
			});
		}
	} catch (error) {
		console.error('Error fetching subscription status:', error);
		let errorMessage = 'Failed to load subscription status';

		if (error instanceof AxiosError) {
			errorMessage = error.response?.data?.message || errorMessage;
		}

		subscriptionStatus.set({
			status: null,
			isLoading: false,
			error: errorMessage
		});

		// Only show toast for non-401 errors (401 might be expected for unauthenticated users)
		if (error instanceof AxiosError && error.response?.status !== 401) {
			toast.error(errorMessage);
		}
	}
}

// Fetch subscription plans
export async function fetchSubscriptionPlans() {
	subscriptionPlans.update((state) => ({ ...state, isLoading: true, error: null }));

	try {
		const { data } = await api.get('/subscription/plans');

		if (data.success && data.data) {
			subscriptionPlans.set({
				plans: data.data,
				isLoading: false,
				error: null
			});
		} else {
			const errorMessage = data.message || 'Failed to load plans';
			subscriptionPlans.set({
				plans: null,
				isLoading: false,
				error: errorMessage
			});
			toast.error(errorMessage);
		}
	} catch (error) {
		console.error('Error fetching subscription plans:', error);
		let errorMessage = 'Failed to load subscription plans';

		if (error instanceof AxiosError) {
			errorMessage = error.response?.data?.message || errorMessage;
		}

		subscriptionPlans.set({
			plans: null,
			isLoading: false,
			error: errorMessage
		});
		toast.error(errorMessage);
	}
}

// Clear subscription data
export function clearSubscriptionStatus() {
	subscriptionStatus.set(initialSubscriptionState);
}

export function clearSubscriptionPlans() {
	subscriptionPlans.set(initialPlansState);
}

// Helper function to get support plan price
export function getSupportPlanPrice(
	plans: PlansResponse | null,
	billingPeriod: 'monthly' | 'yearly',
	currency: 'naira' | 'dollars'
): number {
	if (!plans?.support) return 0;

	const apiCurrency = currency === 'naira' ? 'ngn' : 'usd';
	return plans.support.pricing[billingPeriod][apiCurrency];
}

// Initialize subscription (start payment process)
export async function initializeSubscription(
	billingCycle: 'monthly' | 'yearly',
	currency: 'naira' | 'dollars',
	callbackUrl: string
): Promise<InitializeSubscriptionResponse | null> {
	try {
		// Convert to API format
		const apiBillingCycle = billingCycle === 'monthly' ? 'MONTHLY' : 'YEARLY';
		const apiCurrency = currency === 'naira' ? 'NGN' : 'USD';

		const payload: InitializeSubscriptionPayload = {
			billingCycle: apiBillingCycle,
			currency: apiCurrency,
			callbackUrl
		};

		const { data } = await api.post('/subscription/subscribe', payload);

		if (data.success && data.data) {
			const paymentData: PaymentData = data.data;

			// Return the payment data
			return {
				success: paymentData.success,
				authorizationUrl: paymentData.authorizationUrl,
				accessCode: paymentData.accessCode,
				reference: paymentData.reference,
				amount: paymentData.amount,
				currency: paymentData.currency
			};
		} else {
			// Handle error response (e.g., "You already have an active subscription")
			const errorMessage = data.message || 'Failed to initialize subscription';
			toast.error(errorMessage);
			return null;
		}
	} catch (error) {
		console.error('Error initializing subscription:', error);
		// Don't show toast here as the API interceptor will handle it
		return null;
	}
}

// Cancel subscription
export async function cancelSubscription(): Promise<boolean> {
	try {
		const { data } = await api.post('/subscription/cancel');

		if (data.success) {
			toast.success(data.message || 'Subscription cancelled successfully');
			// Refresh subscription status after cancellation
			await fetchSubscriptionStatus();
			return true;
		} else {
			const errorMessage = data.message || 'Failed to cancel subscription';
			toast.error(errorMessage);
			return false;
		}
	} catch (error) {
		console.error('Error cancelling subscription:', error);
		return false;
	}
}

// Fetch transaction history
export async function fetchTransactions(page: number, size: number): Promise<boolean> {
	// Check if user has access token before making the API call
	const accessToken = get(auth).accessToken;

	if (!accessToken) {
		return false;
	}

	transactions.update((state) => ({ ...state, isLoading: true, error: null }));
	const params = new URLSearchParams();
	params.append('page', page.toString());
	params.append('size', size.toString());

	try {
		const { data } = await api.get<TransactionsResponse>(
			'/subscription/transactions?' + params.toString()
		);

		if (data.success && data.data) {
			const res = data.data;
			console.log('Transaction data =>', res);

			transactions.set({
				transactions: res.content,
				isLoading: false,
				error: null,
				totalPages: res.totalPages,
				page: res.page,
				size: res.size,
				first: res.first,
				last: res.last,
				totalElement: res.totalElements
			});
			return true;
		} else {
			const errorMessage = data.message || 'Failed to load transaction history';
			transactions.set({
				transactions: [],
				isLoading: false,
				error: errorMessage,
				totalPages: 0,
				page: 1,
				size: 0,
				first: true,
				last: false,
				totalElement: 0
			});
			return false;
		}
	} catch (error) {
		console.error('Error fetching transactions:', error);
		let errorMessage = 'Failed to load transaction history';

		if (error instanceof AxiosError) {
			errorMessage = error.response?.data?.message || errorMessage;
		}

		transactions.set({
			transactions: [],
			isLoading: false,
			error: errorMessage,
			totalPages: 0,
			page: 1,
			size: 0,
			first: true,
			last: false,
			totalElement: 0
		});

		// Only show toast for non-401 errors
		if (error instanceof AxiosError && error.response?.status !== 401) {
			toast.error(errorMessage);
		}
		return false;
	}
}
