<script>
	import CareerGuideCard from '../../../components/CareerGuideCard.svelte';
	import Layout from '../../../components/Layout/Layout.svelte';
	import Image1 from '$lib/assets/icons/career1.svg';
	import Image2 from '$lib/assets/icons/career2.svg';
	import Image3 from '$lib/assets/icons/career3.svg';
	import Image4 from '$lib/assets/icons/career4.svg';
	import logo from '$lib/assets/icons/logo-gradient.png';
	import { goto } from '$app/navigation';

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
	<div class="w-full h-full flex flex-col items-center lg:justify-center mb-20 lg:mb-0">
		<img src={logo} alt="Rafki-X logo" width={38} height={38} />

		<div
			class="bg-gradient-to-b px-3 py-10 min-w-full lg:min-w-fit lg:p-10 rounded-[20px] from-[#928bb8] via-[#ebdef8] to-[#FFFFFF] text-center font-mulish text-white relative mt-5 lg:mt-10"
		>
			<button
				onclick={() => {
					goto('/');
				}}
				class="absolute top-7 right-5 cursor-pointer bg-white h-[35px] w-[35px] flex items-center justify-center text-[18px] rounded-full text-[#1E1E1E]"
			>
				X
			</button>
			<h2 class="font-bold text-[24px] text-white mb-5">Career Guide</h2>
			<div
				class="bg-white rounded-[20px] p-10 pb-15 lg:pb-30 shadow-md flex lg:grid grid-cols-4 gap-5 overflow-x-auto no-scrollbar max-w-[90vw] sm:max-w-[90vw] lg:max-w-full"
			>
				{#each lists as item, index}
					<CareerGuideCard title={item.title} image={item.image} />
				{/each}
			</div>
			<p class="text-[14px] font-normal text-[#686868] mt-10">
				By messaging RafikiX, you agree to our
				<span class="bg-gradient from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
					>Terms and Conditions</span
				>
			</p>
		</div>
	</div>
</Layout>
