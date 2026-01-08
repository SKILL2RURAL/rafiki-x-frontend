<script lang="ts">
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/icons/logo-gradient.png';
	import { X } from 'lucide-svelte';
	import ResumeUploader from '../../../components/main/my-resume/ResumeUploader.svelte';
	import Layout from '../../../components/main/Layout/Layout.svelte';
	import CreateAccountModal from '../../../components/main/Layout/CreateAccountModal.svelte';

	let isCreateAccountOpen = $state(false);
</script>

<Layout>
	<div class="min-h-full flex flex-col items-center gap-2 justify-center px-4 sm:px-6 lg:px-10">
		<img src={logo} alt="Rafki-X logo" width={38} height={38} />

		<div
			class="w-full max-w-3xl space-y-8 md:space-y-10 pt-6 md:pt-9 flex flex-col items-center rounded-[20px] bg-gradient-background mt-8 md:mt-10 px-4 sm:px-6 md:px-8 relative"
		>
			<button
				onclick={() => {
					goto('/');
				}}
				class="absolute top-3 right-3 md:top-7 md:right-5 cursor-pointer bg-white h-[35px] w-[35px] flex items-center justify-center text-[18px] rounded-full text-[#60269e]"
			>
				<X />
			</button>
			<h1
				class="text-[20px] md:text-[24px] tracking-wider text-white"
				style="font-family: 'Impact', sans-serif;"
			>
				My Resume
			</h1>

			<!-- {#if files.length === 0} -->
			<ResumeUploader onRequireAuth={() => (isCreateAccountOpen = true)} />

			<div class="text-[13px] sm:text-[14px] font-mulish text-[#686868] leading-4 text-center px-2">
				By messaging RafikiX, you agree to our <span class="text-[#60269E]"
					>Terms and Conditions</span
				>
			</div>
		</div>
	</div>
</Layout>

<CreateAccountModal isOpen={isCreateAccountOpen} onClose={() => (isCreateAccountOpen = false)} />
