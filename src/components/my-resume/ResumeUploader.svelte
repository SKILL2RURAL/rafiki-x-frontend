<script lang="ts">
	import downloadIcon from '$lib/assets/icons/downloadIcon.png';
	import threeDot from '$lib/assets/icons/threeDot.png';
	import upload from '$lib/assets/icons/upload.png';
	import Button from '$lib/components/ui/button/button.svelte';
	import { chatStore, resumes } from '$lib/stores/chatStore';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Drawer from '../Common/ReuseableDrawer.svelte';
	import TextEditor from './TextEditor.svelte';
	// import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';

	let {
		onUpload,
		files,
		openEditor
	}: {
		onUpload: (files: FileList) => void;
		files: Array<{ name: string; size: string; type: string; icon?: string }>;
		openEditor?: boolean;
	} = $props();

	// GET ALL RESUMES ON MOUNT
	onMount(async () => {
		await chatStore.getAllResumes();
	});

	// GET ALL RESUMES
	// LOCAL STATES
	let filesToUpload = $state<File[]>([]);
	let openMenuIndex = $state<number | null>(null);
	let isDrawerOpen = $state<boolean>(false);
	let isUploading = $state<boolean>(false);

	// HANDLE FILE SELECTION
	function handleFileChange(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files && files.length > 0) {
			onUpload(files);
			console.log(files);
			filesToUpload = [...filesToUpload, ...Array.from(files)];
		}
	}

	function toggleMenu(index: number) {
		openMenuIndex = openMenuIndex === index ? null : index;
	}

	function makeDefault(file: { name: string }) {
		console.log('Make default:', file.name);
		openMenuIndex = null;
	}

	function downloadFile(file: { name: string }) {
		console.log('Download file:', file.name);
		openMenuIndex = null;
	}

	function deleteFile(file: { name: string }) {
		console.log('Delete file:', file.name);
		openMenuIndex = null;
	}

	function viewFile(file: { name: string }) {
		console.log('View file:', file.name);
		openMenuIndex = null;
	}

	// FUNCTION TO UPLOAD RESUME
	async function handleResumeUpload() {
		// CHECK IF THERE ARE FILES TO UPLOAD
		if (!filesToUpload.length) {
			toast.error('No files to upload, please select a file');
			return;
		}

		isUploading = true;

		try {
			await chatStore.uploadResume(filesToUpload[0]);
		} catch (error) {
			toast.error('Failed to upload resume');
		} finally {
			isUploading = false;
		}
	}
</script>

<div
	class="w-full lg:w-[677px] rounded-[20px] p-6 bg-whte flex flex-col items-center bg-white shadow-[0_4px_8px_4px_rgba(112,144,176,0.1)]"
>
	<div
		class="w-full md:h-[190px] rounded-[6px] bg-[#F7FBFD] font-satoshi-regular space-y-6 pt-5 text-center p-5"
	>
		<img src={upload} alt="Upload Icon" class="mx-auto mb-4" width="59.05" height="51.15" />
		<p class="text-[13.73px] font-bold leading-5">
			Drag and drop files or
			<label class="text-[#60269E] underline cursor-pointer">
				Browse
				<input type="file" class="hidden" onchange={handleFileChange} />
			</label>
		</p>
		<p class="mt-2 text-[11.3px] text-[#676767] leading-4">Supported formats: PDF, TXT, PNG</p>
	</div>

	<div class="flex items-center gap-1 mt-6">
		<span class="lg:w-[285.5px] border-[0.64px] bg-[#C8CCD0]"> </span>
		<p class="text-[14px]">OR</p>
		<span class="lg:w-[285.5px] border-[0.64px] bg-[#C8CCD0]"> </span>
	</div>

	<Button
		class="w-full h-[48px] rounded-[8px] border p-2.5 bg-[#F7FBFD] text-black mt-4 hover:bg-[#F7FBFD]"
		onclick={() => {
			isDrawerOpen = true;
		}}>Add text Content</Button
	>

	<!-- <Button
		class="md:w-[611px] h-[48px] rounded-[8px] border p-2.5 bg-[#F7FBFD] text-black mt-4"
		onclick={onAddText}>Add text Content</Button
	> -->

	<ul class="flex flex-col gap-4 mt-6">
		{#each $resumes as file, index}
			<li class="relative">
				<div
					class="md:w-[611px] h-[60px] flex justify-between rounded-[8px] bg-[#F7FBFD] p-3 font-satoshi-regular"
				>
					<div class="flex gap-2 items-center">
						<!-- <img src={file.icon} alt="File Icon" class="" width="32" height="32" /> -->
						<div>
							<p class="text-[14px] font-medium leading-5">{file.fileName}</p>
							<p class="text-[12px] text-[#4D5154] leading-4">{file.fileSize}</p>
						</div>
					</div>
					<div class="flex gap-2.5 items-center">
						<div
							class="bg-gradient h-[17px] w-[66px] rounded-full text-white font-satoshi-regular font-medium text-[12px] text-center"
						>
							Default
						</div>
						<div class="flex gap-2.5 items-center">
							<button onclick={() => downloadFile}
								><img src={downloadIcon} alt="download icon" width="24" height="24" /></button
							>
							<span class="w-[1px] h-[25px] bg-[#D9D9D9]"></span>
							<button onclick={() => toggleMenu(index)}
								><img src={threeDot} alt="more icon" width="24" height="24" />
							</button>

							{#if openMenuIndex === index}
								<div class="absolute right-0 top-10 w-[150px] bg-white rounded-md z-50">
									<div
										class="w-[18.07px] h-[18.07px] rounded-[1px] rotate-45 absolute -top-2 right-3.5 bg-white shadow-md border"
									></div>
									<div
										class="absolute z-51 w-[150px] bg-white rounded-md shadow-md text-sm font-satoshi-regular"
									>
										<button class="block w-full text-left px-4 py-2 hover:bg-gray-100"
											>Make default</button
										>
										<button class="block w-full text-left px-4 py-2 hover:bg-gray-100">View</button>
										<button class="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
											>Delete resume</button
										>
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</li>
		{/each}
	</ul>
	<Button
		class="bg-gradient w-full rounded-[8px] mt-5 border border-[#FFFFFF] h-[50px] hover:opacity-80"
		disabled={!files.length || isUploading}
		onclick={handleResumeUpload}
	>
		Go to chat
	</Button>

	<!-- Drawer  -->
	<Drawer bind:isOpen={isDrawerOpen} onClose={() => (isDrawerOpen = false)}>
		<div class="flex flex-col justify-between h-full">
			<div class="px-5 border-b border-[#A3AED0] h-[90px] flex flex-col justify-center relative">
				<h4 class="font-medium text-[#262424] text-[20px]">Add text content</h4>
				<p class="text-[#A09D9D] text-[14px]">txt file</p>
				<button
					onclick={() => (isDrawerOpen = false)}
					class="bg-[#F9F9F9] text-[#5F5F5F] text-[14px] h-[35px] w-[35px] rounded-full flex justify-center items-center absolute top-5 right-5"
				>
					X
				</button>
			</div>
			<TextEditor />
			<div class="border-t border-[#33333380] p-5 flex justify-end gap-5">
				<button
					onclick={() => (isDrawerOpen = false)}
					class="border bg-gradient-to-r from-[#51A3DA] to-[#60269E] p-[1px] rounded-[8px]"
				>
					<div
						class="bg-white h-[40px] w-[120px] md:h-[55px] md:w-[185px] flex items-center justify-center rounded-[9px]"
					>
						<p
							class="bg-gradient-to-r from-[#51A3DA] to-[#60269E] bg-clip-text text-transparent font-mulish font-semibold"
						>
							Go Back
						</p>
					</div>
				</button>
				<Button
					class="bg-gradient-to-t from-[#51A3DA] to-[#60269E] h-[42px] w-[120px] md:h-[55px] md:w-[185px] font-mulish font-semibold rounded-[8px]"
					>Save</Button
				>
			</div>
		</div>
	</Drawer>
</div>
