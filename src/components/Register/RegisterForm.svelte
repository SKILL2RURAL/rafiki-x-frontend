<script>
	import { goto } from '$app/navigation';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Eye, EyeOff } from 'lucide-svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { countries } from '$lib/countries';

	let formData = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		country: '',
		agree: false,
		gender: '',
		ageGroup: ''
	};
	let searchQuery = '';
	let isPasswordVisible = false;

	$: filteredCountries = countries.filter((country) =>
		country.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const passwordRequirements = [
		'One Special Character',
		'One Number',
		'One Uppercase character',
		'8 Character Min',
		'One Lowercase character'
	];

	function handleSubmit() {
		console.log(formData);
		goto('/');
	}

	function togglePasswordVisibility() {
		isPasswordVisible = !isPasswordVisible;
	}
</script>

<form class="space-y-5 mt-5 text-white" on:submit|preventDefault={handleSubmit}>
	<div class="grid md:grid-cols-2 gap-5">
		<div>
			<label for="firstName" class="text-sm">First Name</label>
			<Input
				type="text"
				bind:value={formData.firstName}
				placeholder="Enter your first name"
				class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
			/>
		</div>
		<div>
			<label for="lastName" class="text-sm">Last Name</label>
			<Input
				type="text"
				bind:value={formData.lastName}
				placeholder="Enter your last name"
				class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
			/>
		</div>
	</div>

	<div>
		<label for="email" class="text-sm">Email</label>
		<Input
			type="email"
			bind:value={formData.email}
			placeholder="Enter your email address"
			class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
		/>
	</div>

	<!-- COUNTRY DROPDOWN -->
	<div>
		<label for="country" class="text-sm">Country</label>
		<Select.Root type="single" name="country" bind:value={formData.country}>
			<Select.Trigger
				class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white text-white w-full data-[placeholder]:text-white placeholder:font-satoshi-regular placeholder:text-[14px]:"
			>
				{formData.country ? formData.country : 'Select your country'}
			</Select.Trigger>
			<Select.Content class="max-h-[500px] overflow-auto">
				<!-- <Input type="search" placeholder="Search country" class="ring-0 outline-none" />
				{#each countries as country}
					<Select.Item value={country}>{country}</Select.Item>
				{/each} -->

				<Select.Content class="max-h-[400px] overflow-hidden">
					<!-- Sticky search input -->
					<div class="sticky top-0 bg-white z-10 p-1 border-b">
						<Input
							type="text"
							placeholder="Search country"
							class="w-full ring-0 outline-none text-sm p-1"
							bind:value={searchQuery}
						/>
					</div>

					<!-- Scrollable country list -->
					<div class="overflow-y-auto max-h-[160px]">
						{#each filteredCountries as country}
							<Select.Item value={country} class="p-2 hover:bg-gray-100 cursor-pointer">
								{country}
							</Select.Item>
						{/each}
						{#if filteredCountries.length === 0}
							<div class="p-2 text-gray-500 text-sm">No countries found</div>
						{/if}
					</div>
				</Select.Content>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="grid md:grid-cols-2 gap-5">
		<!-- GENDER  -->
		<div>
			<label for="country" class="text-sm">Gender</label>
			<Select.Root type="single" name="country" bind:value={formData.gender}>
				<Select.Trigger
					class="capitalize mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white text-white w-full data-[placeholder]:text-white placeholder:font-satoshi-regular placeholder:text-[14px]:"
				>
					{formData.gender ? formData.gender : 'Select gender'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="male">Male</Select.Item>
					<Select.Item value="female">Female</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<div>
			<label for="country" class="text-sm">Age Group</label>
			<Select.Root type="single" name="country" bind:value={formData.ageGroup}>
				<Select.Trigger
					class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white text-white w-full data-[placeholder]:text-white placeholder:font-satoshi-regular placeholder:text-[14px]:"
				>
					{formData.ageGroup ? formData.ageGroup : 'Select age group'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="12-15 years">12-15 years</Select.Item>
					<Select.Item value="16-21 years">16-21 years</Select.Item>
					<Select.Item value="22-26 years">22-26 years</Select.Item>
					<Select.Item value="27-35 years">27-35 years</Select.Item>
					<Select.Item value="36 above">36 above</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<div>
		<label for="password" class="text-sm">Password</label>
		<div
			class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] flex gap-2 p-2 px-3 justify-between items-center"
		>
			<input
				type={isPasswordVisible ? 'password' : 'text'}
				bind:value={formData.password}
				placeholder="Enter Password"
				class="w-full outline-none placeholder:text-white placeholder:font-satoshi-regular placeholder:text-[14px]"
			/>
			<button
				type="button"
				on:click={togglePasswordVisibility}
				aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
			>
				{#if isPasswordVisible}
					<Eye size={20} cursor="pointer" />
				{:else}
					<EyeOff size={20} cursor="pointer" />
				{/if}
			</button>
		</div>
		<div class="flex gap-2 flex-wrap items-center mt-3">
			{#each passwordRequirements as requirement}
				<div class="border border-white rounded-[4px] px-2 py-1 text-[10px]">
					<p>{requirement}</p>
				</div>
			{/each}
		</div>
	</div>

	<div class="text-[12px] flex gap-2 items-center font-satoshi-regular">
		<Checkbox bind:checked={formData.agree} />
		<p>I have read and agree with RafikiX</p>
	</div>
	<Button
		class="bg-gradient w-full rounded-[8px] mt-5 border border-[#FFFFFF] h-[50px]"
		type="submit">Sign up</Button
	>
</form>
