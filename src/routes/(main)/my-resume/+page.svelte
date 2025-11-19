<script lang="ts">
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/icons/logo-gradient.png';
	import Layout from '../../../components/Layout/Layout.svelte';
	import ResumeUploader from '../../../components/my-resume/ResumeUploader.svelte';
</script>

<Layout>
	<div class="flex flex-col items-center gap-2 h-full justify-center">
		<img src={logo} alt="Rafki-X logo" width={38} height={38} />

		<div
			class="lg:w-[856px] space-y-10 pt-9 flex flex-col items-center rounded-[20px] bg-gradient-background mt-10 px-5 w-full relative"
		>
			<button
				onclick={() => {
					goto('/');
				}}
				class="absolute top-7 right-5 cursor-pointer bg-white h-[35px] w-[35px] flex items-center justify-center text-[18px] rounded-full text-[#1E1E1E]"
			>
				X
			</button>
			<h1 class="text-[24px] font-bold font-mulish text-white">My Resume</h1>
			<!-- {#if files.length === 0} -->
			<ResumeUploader />

			<div class="text-[14px] font-mulish text-[#686868] leading-4">
				By messaging RafikiX, you agree to our <span class="text-[#60269E]"
					>Terms and Conditions</span
				>
			</div>
		</div>
	</div>
</Layout>
