<script>
	import Layout from '../../../components/Layout/Layout.svelte';
	import ResumeUploader from '../../../components/my-resume/ResumeUploader.svelte';
	import logo from '$lib/assets/icons/logo-gradient.png';
	import { fileIcons } from '$lib';
	import RightSidebar from '../../../components/Layout/RightSidebar.svelte';
	import TextEditor from '../../../components/my-resume/TextEditor.svelte';

	// files + history store
	let files = $state([]);
	
	
		function handleUpload(uploadedFiles) {
			files = [...files, ...Array.from(uploadedFiles).map(f => ({
				name: f.name,
				size: `${(f.size / 1024).toFixed(1)} KB`,
				type: f.type,
				icon: fileIcons[f.type] || fileIcons.default
			}))];

		}
</script>

<Layout let:rightSidebar>
	<div class="flex flex-col items-center gap-2">
		<img src={logo} alt="Rafki-X-logo" width={38} height={38}/>
		<div class="md:w-[856px] md:h-[716px] space-y-10 pt-9 flex flex-col items-center rounded-[20px] bg-gradient-to-b from-[#928bb8] via-[#ebdef8] to-[#FFFFFF]">
			<h1 class="text-[24px] font-bold font-mulish text-white">My Resume</h1>
			<!-- {#if files.length === 0} -->
				<ResumeUploader onUpload={handleUpload} {files} onAddText={() => rightSidebar?.show(() => TextEditor, "Add Text Content")}/>
			<!-- {:else}
				<ResumeFileList {files} onUpload={handleUpload} {openEditor}/>
			{/if} -->
			<div class="text-[14px] font-mulish text-[#686868] leading-4">By messaging RafikiX, you agree to our <span class="text-[#60269E]">Terms and Conditions</span></div>
		</div>	
	</div> 
</Layout>

