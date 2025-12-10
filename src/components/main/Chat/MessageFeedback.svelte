<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import like from '$lib/assets/icons/likeIcon.png';
  import thumDown from '$lib/assets/icons/thumbDown.png';
  import { chatStore } from '$lib/stores/chatStore';
  import { toast } from 'svelte-sonner';
  let {
    messageId,
    isTyping,
    feedback
  }: { messageId?: number; isTyping?: boolean; feedback?: 'LIKE' | 'DISLIKE' | null } = $props();

  async function handleFeedback(type: 'LIKE' | 'DISLIKE') {
    if (!messageId) return;
    const defaultText =
      type === 'LIKE' ? 'Very helpful response!' : 'The response was not relevant to my question';
    try {
      await chatStore.submitMessageFeedback(messageId, {
        feedbackType: type,
        feedbackText: defaultText
      });
      toast.success(type === 'LIKE' ? 'Response Liked successfully' : 'Response Disliked successfully');
    } catch (e) {
      toast.error('Failed to submit feedback');
    }
  }
</script>

{#if !isTyping}
  <div class="flex items-center">
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          class="hover:bg-gray-100 rounded-lg p-2"
          aria-label="Like"
          onclick={() => handleFeedback('LIKE')}
        >
          <img src={like} width="15" height="15" class="cursor-pointer" alt="Like Icon" />
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">
          <p>Like</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>

    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger
          class="hover:bg-gray-100 rounded-lg p-2"
          aria-label="Dislike"
          onclick={() => handleFeedback('DISLIKE')}
        >
          <img src={thumDown} width="15" height="15" class="cursor-pointer" alt="thumb down" />
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom">
          <p>Dislike</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>

    {#if feedback}
      <span class="ml-2 text-xs text-[#808990]">
        {feedback === 'LIKE' ? 'liked' : 'disliked'}
      </span>
    {/if}
  </div>
{/if}

