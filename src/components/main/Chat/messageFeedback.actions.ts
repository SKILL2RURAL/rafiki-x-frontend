export type FeedbackType = 'LIKE' | 'DISLIKE';

export async function submitDefaultFeedback(options: {
	messageId?: number;
	currentFeedback?: FeedbackType | null;
	type: FeedbackType;
	submit: (
		messageId: number,
		payload: { feedbackType: FeedbackType; feedbackText: string }
	) => Promise<unknown>;
}) {
	if (!options.messageId) return;
	if (options.currentFeedback === options.type) return;

	const defaultText =
		options.type === 'LIKE'
			? 'Very helpful response!'
			: 'The response was not relevant to my question';

	await options.submit(options.messageId, {
		feedbackType: options.type,
		feedbackText: defaultText
	});
}
