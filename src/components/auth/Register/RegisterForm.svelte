<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Eye, EyeOff } from 'lucide-svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { onMount } from 'svelte';
	import { auth, getCountries, isLoading, register } from '$lib/stores/authStore';
	import { toast } from 'svelte-sonner';
	import type { RegisterPayload } from '$lib/types/auth';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { AxiosError } from 'axios';

	// Get List of countries on mount
	onMount(async () => {
		if (!$auth.countries) await getCountries();
	});

	$: countries = $auth.countries ?? [];

	// form state
	let formData: RegisterPayload = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		country: '',
		agree: false,
		gender: undefined,
		ageGroup: undefined
	};
	let searchQuery = '';
	let isPasswordVisible = false;

	$: filteredCountries = countries.filter((country: { code: string; name: string }) =>
		country.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const passwordRequirements = [
		{ text: 'One Special Character', check: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
		{ text: 'One Number', check: (pwd: string) => /\d/.test(pwd) },
		{ text: 'One Uppercase character', check: (pwd: string) => /[A-Z]/.test(pwd) },
		{ text: '8 Character Min', check: (pwd: string) => pwd.length >= 8 },
		{ text: 'One Lowercase character', check: (pwd: string) => /[a-z]/.test(pwd) }
	];

	// Reactive check for each requirement
	$: requirementStatus = passwordRequirements.map((req) => ({
		text: req.text,
		met: req.check(formData.password)
	}));

	// Helper function to capitalize names (first letter uppercase, rest lowercase)
	function capitalizeName(name: string): string {
		if (!name) return name;
		return name
			.trim()
			.split(/\s+/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

	async function handleSubmit() {
		if (!formData.firstName) {
			toast.error('First name is required');
			return;
		}
		if (!formData.lastName) {
			toast.error('Last name is required');
			return;
		}
		if (!formData.email) {
			toast.error('Email is required');
			return;
		}
		if (!formData.country) {
			toast.error('Country is required');
			return;
		}
		if (!formData.gender || (formData.gender !== 'male' && formData.gender !== 'female')) {
			toast.error('Gender is required');
			return;
		}
		if (!formData.ageGroup) {
			toast.error('Age group is required');
			return;
		}
		if (!formData.password) {
			toast.error('Password is required');
			return;
		}

		if (!formData.agree) {
			toast.error('You must agree to the terms and conditions');
			return;
		}

		const country =
			countries && countries.find((country) => country.name === formData.country)?.code;

		if (!country) {
			toast.error('Country is required');
			return;
		}

		try {
			// Capitalize names before sending to backend
			const payloadToSend: RegisterPayload = {
				...formData,
				firstName: capitalizeName(formData.firstName),
				lastName: capitalizeName(formData.lastName)
			};
			await register(payloadToSend);
			goto('/verify-email');
		} catch (error: any) {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data.message);
			}
		}
	}

	function togglePasswordVisibility() {
		isPasswordVisible = !isPasswordVisible;
	}
</script>

<!-- svelte-ignore component_name_lowercase -->
<form class="space-y-5 mt-5 text-white" on:submit|preventDefault={handleSubmit}>
	<div class="grid md:grid-cols-2 gap-5">
		<div>
			<label for="firstName" class="text-sm">First Name</label>
			<Input
				type="text"
				bind:value={formData.firstName}
				placeholder="Enter your first name"
				class="mt-2 border border-[#D0D5DD] h-10 rounded-xl bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
			/>
		</div>
		<div>
			<label for="lastName" class="text-sm">Last Name</label>
			<Input
				type="text"
				bind:value={formData.lastName}
				placeholder="Enter your last name"
				class="mt-2 border border-[#D0D5DD] h-10 rounded-xl bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
			/>
		</div>
	</div>

	<div>
		<label for="email" class="text-sm">Email</label>
		<Input
			type="email"
			bind:value={formData.email}
			placeholder="Enter your email address"
			class="mt-2 border border-[#D0D5DD] h-10 rounded-xl bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
		/>
	</div>

	<!-- COUNTRY DROPDOWN -->
	<div>
		<label for="country" class="text-sm">Country</label>
		<Select.Root type="single" name="country" bind:value={formData.country}>
			<Select.Trigger
				class="mt-2 border border-[#D0D5DD] h-10 rounded-xl bg-[#FFFFFF4D] text-white w-full data-placeholder:text-white data-placeholder:opacity-100 font-satoshi-regular text-[14px]"
			>
				{formData.country ? formData.country : 'Select Your Country'}
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
							class="w-full ring-0 outline-none text-sm p-1 px-2"
							bind:value={searchQuery}
						/>
					</div>

					<!-- Scrollable country list -->
					<div class="overflow-y-auto max-h-40">
						{#each filteredCountries as country}
							<Select.Item value={country.name} class="p-2 hover:bg-gray-100 cursor-pointer">
								{country.name}
							</Select.Item>
						{/each}
						{#if filteredCountries.length === 0}
							<div class="p-2 text-gray-500 text-sm">No countries available</div>
						{/if}
					</div>
				</Select.Content>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="grid md:grid-cols-2 gap-5">
		<!-- GENDER  -->
		<div>
			<label for="gender" class="text-sm">Gender</label>
			<Select.Root type="single" name="gender" bind:value={formData.gender}>
				<Select.Trigger
					class="capitalize mt-2 border border-[#D0D5DD] h-10 rounded-xl bg-[#FFFFFF4D] text-white w-full data-placeholder:text-white data-placeholder:opacity-100 font-satoshi-regular text-[14px]"
				>
					{formData.gender ? formData.gender : 'Select Gender'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="male">Male</Select.Item>
					<Select.Item value="female">Female</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<div>
			<label for="ageGroup" class="text-sm">Age Group</label>
			<Select.Root type="single" name="ageGroup" bind:value={formData.ageGroup}>
				<Select.Trigger
					class="mt-2 border border-[#D0D5DD] h-10 rounded-xl bg-[#FFFFFF4D] text-white w-full data-placeholder:text-white data-placeholder:opacity-100 font-satoshi-regular text-[14px]"
				>
					{formData.ageGroup ? formData.ageGroup : 'Select Age Group'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="AGE_12_15">12-15 years</Select.Item>
					<Select.Item value="AGE_16_21">16-21 years</Select.Item>
					<Select.Item value="AGE_22_26">22-26 years</Select.Item>
					<Select.Item value="AGE_27_35">27-35 years</Select.Item>
					<Select.Item value="AGE_36_ABOVE">36 above</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<div>
		<label for="password" class="text-sm">Password</label>
		<div
			class="mt-2 border border-[#D0D5DD] h-10 rounded-xl bg-[#FFFFFF4D] flex gap-2 p-2 px-3 justify-between items-center"
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
			{#each requirementStatus as requirement}
				<div
					class="border rounded-lg px-2 py-1 text-[10px] transition-colors {requirement.met
						? 'border-green-500 text-green-500'
						: 'border-white text-white'}"
				>
					<p>{requirement.text}</p>
				</div>
			{/each}
		</div>
	</div>

	<div class="text-[12px] flex gap-2 items-center font-satoshi-regular">
		<Checkbox bind:checked={formData.agree} />
		<p>I have read and agree with RafikiX</p>
	</div>
	<Button class="bg-gradient w-full rounded-xl mt-5 border border-[#FFFFFF] h-[50px]" type="submit">
		{#if $isLoading}
			<Spinner />
		{:else}
			Sign up
		{/if}
	</Button>
</form>
