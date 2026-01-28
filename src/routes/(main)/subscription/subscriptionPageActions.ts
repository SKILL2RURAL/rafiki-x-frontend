import {
	handleCancel,
	handleRenew,
	handleSupportPlanAction
} from '../../../components/main/subscription/subscriptionUtils';
import type { BillingPeriod, Currency } from '../../../components/main/subscription/types';

type Flag = { value: boolean };

export async function onSupportPlanAction(options: {
	isSupportPlanCurrent: boolean;
	isCancelled: boolean;
	isAuthenticated: boolean;
	supportPlanPeriod: BillingPeriod;
	currency: Currency;
	onShowCreateAccount: () => void;
	onOpenRenewModal: () => void;
	isInitializing: Flag;
	isCancelling: Flag;
}) {
	// If subscription is cancelled, show renew modal instead
	if (options.isSupportPlanCurrent && options.isCancelled) {
		options.onOpenRenewModal();
		return;
	}

	await handleSupportPlanAction(
		options.isSupportPlanCurrent,
		options.isAuthenticated,
		options.supportPlanPeriod,
		options.currency,
		options.onShowCreateAccount,
		options.isInitializing,
		options.isCancelling,
		options.isCancelled
	);
}

export async function onFreePlanAction(options: {
	isSupportPlanCurrent: boolean;
	isAuthenticated: boolean;
	onShowCreateAccount: () => void;
	isCancelling: Flag;
}) {
	if (options.isSupportPlanCurrent) {
		// If on support plan, cancel it when selecting free plan
		await handleCancel(options.isAuthenticated, options.onShowCreateAccount, options.isCancelling);
	}
}

export function onManagePlan(onOpenManageModal: () => void) {
	onOpenManageModal();
}

export async function onCancelPlan(options: {
	isAuthenticated: boolean;
	onShowCreateAccount: () => void;
	isCancelling: Flag;
}) {
	await handleCancel(options.isAuthenticated, options.onShowCreateAccount, options.isCancelling);
}

export async function onConfirmRenewPlan(options: {
	isAuthenticated: boolean;
	supportPlanPeriod: BillingPeriod;
	currency: Currency;
	onShowCreateAccount: () => void;
	isInitializing: Flag;
}) {
	await handleRenew(
		options.isAuthenticated,
		options.supportPlanPeriod,
		options.currency,
		options.onShowCreateAccount,
		options.isInitializing
	);
}
