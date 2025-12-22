<script lang="ts">
	import like from '$lib/assets/icons/likeIcon.png';
	import likeActive from '$lib/assets/icons/likeIconActive.png';
	import thumDown from '$lib/assets/icons/thumbDown.png';
	import thumbDownActive from '$lib/assets/icons/thumbDownActive.png';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { chatStore } from '$lib/stores/chatStore';
	let {
		messageId,
		isTyping,
		feedback
	}: { messageId?: number; isTyping?: boolean; feedback?: 'LIKE' | 'DISLIKE' | null } = $props();

	const isLiked = $derived(feedback === 'LIKE');
	const isDisliked = $derived(feedback === 'DISLIKE');

	async function handleFeedback(type: 'LIKE' | 'DISLIKE') {
		if (!messageId) return;
		if (feedback === type) return;
		const defaultText =
			type === 'LIKE' ? 'Very helpful response!' : 'The response was not relevant to my question';

		await chatStore.submitMessageFeedback(messageId, {
			feedbackType: type,
			feedbackText: defaultText
		});
	}
</script>

{#if !isTyping}
	<div class="flex items-center">
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger
					class={`rounded-full p-2 ${isLiked ? 'opacity-50 cursor-not-allowed hover:bg-[#F7FBFD]' : 'hover:bg-gray-100'}`}
					aria-label="Like"
					onclick={() => !isLiked && handleFeedback('LIKE')}
				>
					<img
						src={isLiked ? likeActive : like}
						width="15"
						height="15"
						class="cursor-pointer"
						alt="Like Icon"
					/>
				</Tooltip.Trigger>
				<Tooltip.Content side="bottom">
					<p>{isLiked ? 'Liked' : 'Like'}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>

		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger
					class={`rounded-full p-2 ${isDisliked ? 'opacity-50 cursor-not-allowed hover:bg-[#F7FBFD]' : 'hover:bg-gray-100'}`}
					aria-label="Dislike"
					onclick={() => !isDisliked && handleFeedback('DISLIKE')}
				>
					<img
						src={isDisliked ? thumbDownActive : thumDown}
						width="15"
						height="15"
						class="cursor-pointer"
						alt="thumb down"
					/>
				</Tooltip.Trigger>
				<Tooltip.Content side="bottom">
					<p>{isDisliked ? 'Disliked' : 'Dislike'}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</div>
{/if}
