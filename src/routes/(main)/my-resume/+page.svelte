<script>
	import Layout from '../../../components/Layout/Layout.svelte';
	import ResumeFileList from '../../../components/my-resume/ResumeFileList.svelte';
	import ResumeHistory from '../../../components/my-resume/ResumeHistory.svelte';
	import ResumeUploader from '../../../components/my-resume/ResumeUploader.svelte';
	import logo from '$lib/assets/icons/logo-gradient.png';

	let files = [];
	let history = []
	let showHistory = false;

	function handleUpload(uploadedFiles) {
		files = [...files, ...Array.from(uploadedFiles).map(f => ({
			name: f.name,
			size: (f.size / 1024).toFixed(1)
	}))];
	}
</script>

<Layout>
	<div class="flex flex-col items-center gap-5 ">
		<img src={logo} alt="Rafki-X-logo" width={38} height={38}/>
		<div class="md:w-[856px] md:h-[716px] space-y-10 pt-9 flex flex-col items-center rounded-[20px] bg-gradient-to-b from-[#A3A7D0] via-[#ebdef8] to-[#FFFFFF]">
			<h1 class="text-[24px] font-bold font-mulish text-white">My Resume</h1>
			{#if files.length === 0}
				<ResumeUploader onUpload={handleUpload} />
			{:else}
				<ResumeFileList {files} />
			{/if}
		</div>
	</div> 
</Layout>

<!-- Resume history sidebar -->
{#if showHistory}
	<ResumeHistory {history} />
{/if}
