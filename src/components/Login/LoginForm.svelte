<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	let formData = {
		email: '',
		password: ''
	};
	function handleSubmit() {}
</script>

<form class="space-y-5" on:submit|preventDefault={handleSubmit}>
	<div>
		<label for="email" class="text-sm">Email</label>
		<Input
			type="email"
			bind:value={formData.email}
			placeholder="Enter your email address"
			class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
		/>
	</div>

	<div>
		<label for="password" class="text-sm">Password</label>
		<div class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] flex gap-2 p-2">
			<input
				type="email"
				bind:value={formData.password}
				placeholder="Enter Password"
				class="w-full outline-none placeholder:text-white placeholder:font-satoshi-regular"
			/>
		</div>
	</div>

	<div class="text-[12px] flex justify-between items-center font-satoshi-regular">
		<div class="flex items-center gap-2">
			<Checkbox />
			<p>Remember me</p>
		</div>
		<a href="/">Forget Password?</a>
	</div>
	<Button
		type="submit"
		class="bg-gradient w-full rounded-[8px] mt-5 border border-[#FFFFFF] h-[50px]">Log in</Button
	>
</form>
