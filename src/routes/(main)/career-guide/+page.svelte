<script lang="ts">
	import { goto } from '$app/navigation';
	import Image1 from '$lib/assets/icons/career1.svg';
	import Image2 from '$lib/assets/icons/career2.svg';
	import Image3 from '$lib/assets/icons/career3.svg';
	import Image4 from '$lib/assets/icons/career4.svg';
	import logo from '$lib/assets/icons/logo-gradient.png';
	import { X } from 'lucide-svelte';
	import CareerGuideCard from '../../../components/CareerGuideCard.svelte';
	import Layout from '../../../components/main/Layout/Layout.svelte';
	import CreateAccountModal from '../../../components/main/Layout/CreateAccountModal.svelte';

	let isCreateAccountOpen = $state(false);

	const lists = [
		{
			title: `I'd like to improve my presentation skills.`,
			image: Image1
		},
		{
			title: 'Help me prepare for a job interview.',
			image: Image2
		},
		{
			title: 'Give me advice on how to find a mentor.',
			image: Image3
		},
		{
			title: 'Help me generate a compelling story',
			image: Image4
		}
	];
</script>

<Layout>
	<div
		class="w-full min-h-full flex flex-col items-center justify-center mb-0 px-4 sm:px-6 lg:px-10"
	>
		<img src={logo} alt="Rafki-X logo" width={38} height={38} />

		<div
			class="bg-gradient-background px-4 sm:px-6 lg:px-10 py-8 lg:py-10 w-full max-w-6xl rounded-[20px] text-center font-mulish text-white relative mt-5 lg:mt-10"
		>
			<button
				onclick={() => {
					goto('/');
				}}
				class="absolute top-3 right-3 md:top-7 md:right-5 cursor-pointer bg-white h-[35px] w-[35px] flex items-center justify-center text-[18px] rounded-full text-[#60269e]"
			>
				<X />
			</button>
			<h2
				class="text-[20px] md:text-[24px] text-white mb-5 tracking-wider"
				style="font-family: 'Impact', sans-serif;"
			>
				Career Guide
			</h2>
			<div
				class="bg-white rounded-[20px] p-5 sm:p-8 lg:p-10 shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
			>
				{#each lists as item}
					<CareerGuideCard
						title={item.title}
						image={item.image}
						onRequireAuth={() => (isCreateAccountOpen = true)}
					/>
				{/each}
			</div>
			<p class="text-[13px] sm:text-[14px] font-normal text-[#686868] mt-6 lg:mt-10">
				By messaging RafikiX, you agree to our
				<span class="bg-gradient from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
					>Terms and Conditions</span
				>
			</p>
		</div>
	</div>
	<CreateAccountModal isOpen={isCreateAccountOpen} onClose={() => (isCreateAccountOpen = false)} />
</Layout>
