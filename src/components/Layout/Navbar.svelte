<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { Menu } from 'lucide-svelte';
</script>

<nav
	class="h-[var(--navbar-height)] flex justify-between items-center p-5 bg-[#FCFCFC] border-b-[0.5] border-[#C8CCD0]"
>
	<div>
		<Menu size={30} class="cursor-pointer lg:hidden" />
	</div>
	<Button class="bg-gradient h-[40px] w-[100px]">Sign in</Button>
</nav>
