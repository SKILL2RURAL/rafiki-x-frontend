import { browser } from '$app/environment';
import { toast } from 'svelte-sonner';
import type { BillingPeriod, Currency } from './types';
import {
	initializeSubscription,
	reactivateSubscription,
	cancelSubscription,
	fetchSubscriptionStatus,
	fetchSubscriptionPlans
} from '$lib/stores/subscription';
import type { AxiosError } from 'axios';

export interface SubscriptionHandlers {
	handleUpgrade: (
		isAuthenticated: boolean,
		supportPlanPeriod: BillingPeriod,
		currency: Currency,
		onShowCreateAccount: () => void,
		isInitializing: { value: boolean }
	) => Promise<void>;
	handleCancel: (
		isAuthenticated: boolean,
		onShowCreateAccount: () => void,
		isCancelling: { value: boolean }
	) => Promise<void>;
	handleRenew: (
		isAuthenticated: boolean,
		supportPlanPeriod: BillingPeriod,
		currency: Currency,
		onShowCreateAccount: () => void,
		isInitializing: { value: boolean }
	) => Promise<void>;
	handleSupportPlanAction: (
		isSupportPlanCurrent: boolean,
		isAuthenticated: boolean,
		supportPlanPeriod: BillingPeriod,
		currency: Currency,
		onShowCreateAccount: () => void,
		isInitializing: { value: boolean },
		isCancelling: { value: boolean },
		isCancelled?: boolean
	) => Promise<void>;
	handleRetry: () => void;
	handlePaymentCallback: () => void;
}

// Handle subscription upgrade
export async function handleUpgrade(
	isAuthenticated: boolean,
	supportPlanPeriod: BillingPeriod,
	currency: Currency,
	onShowCreateAccount: () => void,
	isInitializing: { value: boolean }
): Promise<void> {
	if (!isAuthenticated) {
		onShowCreateAccount();
		return;
	}

	if (isInitializing.value) return;

	isInitializing.value = true;

	try {
		const callbackUrl = browser
			? `${window.location.origin}/subscription?payment=success`
			: '/subscription?payment=success';

		const paymentData = await initializeSubscription(supportPlanPeriod, currency, callbackUrl);

		if (paymentData?.authorizationUrl) {
			// Redirect to payment gateway
			if (browser) {
				window.location.href = paymentData.authorizationUrl;
			}
		}
	} catch (error) {
		console.error('Error during subscription initialization:', error);
		toast.error('Error during subscription initialization');
		isInitializing.value = false;
	}
}

// Handle subscription cancellation
export async function handleCancel(
	isAuthenticated: boolean,
	onShowCreateAccount: () => void,
	isCancelling: { value: boolean }
): Promise<void> {
	if (!isAuthenticated) {
		onShowCreateAccount();
		return;
	}

	if (isCancelling.value) return;

	isCancelling.value = true;

	try {
		await cancelSubscription();
		isCancelling.value = false;
		// Note: cancelSubscription already calls fetchSubscriptionStatus()
		// The loading state will be reset when the plan changes (handled in component)
	} catch (error) {
		console.error('Error during subscription cancellation:', error);
		// On error, reset the loading state immediately
		isCancelling.value = false;
	}
	// On success, keep loading state true until plan changes (handled by $effect in component)
}

// Handle subscription reactivation (for cancelled subscriptions)
export async function handleRenew(
	isAuthenticated: boolean,
	supportPlanPeriod: BillingPeriod,
	currency: Currency,
	onShowCreateAccount: () => void,
	isInitializing: { value: boolean }
): Promise<void> {
	if (!isAuthenticated) {
		onShowCreateAccount();
		return;
	}

	if (isInitializing.value) return;

	isInitializing.value = true;

	try {
		const result = await reactivateSubscription();

		if (result) {
			// Subscription reactivated successfully
			// fetchSubscriptionStatus is already called in reactivateSubscription
			// Reset loading state when subscription status updates
			isInitializing.value = false;
		} else {
			isInitializing.value = false;
		}
	} catch (error) {
		console.error('Error during subscription reactivation:', error);
		toast.error(
			(error as unknown as AxiosError<{ message: string }>)?.response?.data?.message ||
				'Error during subscription reactivation'
		);
		isInitializing.value = false;
	}
}

// Handle support plan action (upgrade, cancel, or renew)
export async function handleSupportPlanAction(
	isSupportPlanCurrent: boolean,
	isAuthenticated: boolean,
	supportPlanPeriod: BillingPeriod,
	currency: Currency,
	onShowCreateAccount: () => void,
	isInitializing: { value: boolean },
	isCancelling: { value: boolean },
	isCancelled?: boolean
): Promise<void> {
	// If subscription is cancelled, renew it
	if (isSupportPlanCurrent && isCancelled) {
		await handleRenew(
			isAuthenticated,
			supportPlanPeriod,
			currency,
			onShowCreateAccount,
			isInitializing
		);
	} else if (isSupportPlanCurrent) {
		// If subscription is active, cancel it
		await handleCancel(isAuthenticated, onShowCreateAccount, isCancelling);
	} else {
		// If no subscription, upgrade
		await handleUpgrade(
			isAuthenticated,
			supportPlanPeriod,
			currency,
			onShowCreateAccount,
			isInitializing
		);
	}
}

// Handle retry for failed plan fetch
export function handleRetry(): void {
	fetchSubscriptionPlans();
}

// Handle payment success callback
export function handlePaymentCallback(isInitializing?: { value: boolean }): void {
	if (browser) {
		const urlParams = new URLSearchParams(window.location.search);
		const paymentStatus = urlParams.get('payment');

		if (paymentStatus === 'success') {
			toast.success('Payment successful! Your subscription is being activated.');
			// Reset loading state immediately
			if (isInitializing) {
				isInitializing.value = false;
			}
			// Refresh subscription status
			fetchSubscriptionStatus();
			// Clean up URL
			window.history.replaceState({}, '', '/subscription');
		}
	}
}
