import { api } from '$lib/api';
import { AxiosError } from 'axios';
import { toast } from 'svelte-sonner';
import { writable } from 'svelte/store';

// Types for Reviews
export interface Review {
	id: number;
	userId: number;
	userFirstName: string;
	userLastName: string;
	userEmail: string;
	rating: number;
	comment: string;
	createdAt: string;
	updatedAt: string;
}

export interface SubmitReviewPayload {
	rating: number;
	comment: string;
}

// Review Submission Store
interface ReviewState {
	isSubmitting: boolean;
	error: string | null;
	lastSubmittedReview: Review | null;
}

const initialReviewState: ReviewState = {
	isSubmitting: false,
	error: null,
	lastSubmittedReview: null
};

export const reviewStore = writable<ReviewState>(initialReviewState);

// Submit a review
export async function submitReview(payload: SubmitReviewPayload): Promise<Review | null> {
	reviewStore.update((state) => ({ ...state, isSubmitting: true, error: null }));

	try {
		// Only include comment if it's not empty
		const requestPayload: { rating: number; comment?: string } = {
			rating: payload.rating
		};

		if (payload.comment && payload.comment.trim().length > 0) {
			requestPayload.comment = payload.comment.trim();
		}

		const { data } = await api.post('/reviews', requestPayload);

		if (data.success && data.data) {
			const review: Review = data.data;
			reviewStore.set({
				isSubmitting: false,
				error: null,
				lastSubmittedReview: review
			});
			toast.success(data.message || 'Review submitted successfully');
			return review;
		} else {
			const errorMessage = data.message || 'Failed to submit review';
			reviewStore.set({
				isSubmitting: false,
				error: errorMessage,
				lastSubmittedReview: null
			});
			toast.error(errorMessage);
			return null;
		}
	} catch (error) {
		console.error('Error submitting review:', error);
		let errorMessage = 'Failed to submit review';

		if (error instanceof AxiosError) {
			errorMessage = error.response?.data?.message || errorMessage;
		}

		reviewStore.set({
			isSubmitting: false,
			error: errorMessage,
			lastSubmittedReview: null
		});

		// Don't show toast here as the API interceptor will handle it
		return null;
	}
}

// Clear review state
export function clearReviewState() {
	reviewStore.set(initialReviewState);
}
