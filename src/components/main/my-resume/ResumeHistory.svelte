<script lang="ts">
	let { history }: { history: Array<{ title: string }> } = $props();
</script>

<aside class="w-64">
	<h2 class="">Chat Histor</h2>
	{#if history.length === 0}
		<p class="">No history available</p>
	{:else}
		<ul class="">
			{#each history as item}
				<li class="flex justify-between items-cente">
					<span>{item.title}</span>
					<!-- {/*Button*/} -->
				</li>
			{/each}
		</ul>
	{/if}

	<div>
		<!-- {/*Button to go back*/}
        {/*Button to clear history*/} -->
	</div>
</aside>
