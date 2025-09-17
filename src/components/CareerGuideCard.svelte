<script lang="ts">
	// import image from '$lib/assets/icons/career1.svg';
	import { MoveUpRight } from 'lucide-svelte';

	let { title, image }: { title: string; image: string } = $props();
</script>

<div
	class="bg-[#F7FBFD] rounded-[10px] p-5 text-[#686868] min-w-[240px] lg:min-w-full lg:w-fit flex flex-col justify-between"
>
	<p class="lg:max-w-[150px] mb-10 text-left">{title}</p>
	<div class="flex items-center gap-2 justify-between">
		<img src={image} alt="" />
		<MoveUpRight color="#808990" />
	</div>
</div>
