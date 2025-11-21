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
	import { goto } from '$app/navigation';
	import type { Resume } from '$lib/types/chat';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { EllipsisVertical } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	// GET ALL RESUMES ON MOUNT
	onMount(async () => {
		await chatStore.getAllResumes();
	});

	// GET ALL RESUMES
	// LOCAL STATES
	let isUploading = $state<boolean>(false);
	let isDrawerOpen = $state<boolean>(false);
	let resumeFiles = $state<Resume[]>($resumes || []);

	// UPDATE THE RESUMEFILES LOCAL STATE
	$effect(() => {
		resumeFiles = $resumes;
	});

	// HANDLE FILE SELECTION
	function handleFileChange(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files && files.length > 0) {
			const newFile: Resume = {
				id: Date.now(),
				fileName: files[0].name,
				fileUrl: `${(files[0].size / 1024).toFixed(1)} KB`,
				fileSize: files[0].size,
				status: 'pending',
				uploadedAt: new Date().toISOString()
			};

			resumeFiles = [newFile, ...resumeFiles];
			handleResumeUpload(files[0]);
		}
	}

	function downloadFile(file: { name: string }) {
		console.log('Download file:', file.name);
		// openMenuIndex = null;
	}

	// FUNCTION TO UPLOAD RESUME
	async function handleResumeUpload(file: File) {
		// CHECK IF THERE ARE FILES TO UPLOAD
		if (!file) {
			toast.error('No files to upload, please select a file');
			return;
		}

		isUploading = true;

		try {
			await chatStore.uploadResume(file).then((res) => {
				if (res) {
					// UPDATE LOCAL STATE TO REFLECT CHANGES
					toast.success('Resume uploaded successfully');
					resumeFiles[0] = res;
				}
			});
		} catch (error) {
			toast.error('Failed to upload resume');
		} finally {
			isUploading = false;
		}
	}

	// FUNCTION TO DELETE A SINGLE RESUME
	async function deleteSingleResume(file: Resume) {
		try {
			await chatStore.deleteResume(file.id).then((res) => {
				if (res) {
					// UPDATE LOCAL STATE TO REFLECT CHANGES
					toast.success('Resume deleted successfully');
					resumeFiles = resumeFiles.filter((f) => f.id !== file.id);
				}
			});
		} catch (error) {
			toast.error('Failed to delete resume');
		}
	}

	// FUNCTION TO FORMAT DATE
	function formatDate(date: string) {
		return new Date(date).toLocaleString('en-GB');
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
				<input type="file" class="hidden" onchange={handleFileChange} accept=".pdf,.doc,.docx" />
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

	<ul class="flex flex-col gap-4 mt-6 max-h-[100px] overflow-y-auto">
		{#each resumeFiles as file}
			<li>
				<div
					class={cn(
						`md:w-[611px] h-[60px] flex justify-between rounded-[8px] bg-[#F7FBFD] p-3 font-satoshi-regular`,
						file.status === 'pending' ? 'opacity-30' : ''
					)}
				>
					<div class="flex gap-2 items-center">
						<!-- <img src={file.icon} alt="File Icon" class="" width="32" height="32" /> -->
						<div>
							<p class="text-[12px] lg:text-[14px] leading-5 font-plus-jakarta-sans-semibold">
								{file.fileName}
							</p>
							<p class="text-[10px] lg:text-[12px] text-[#4D5154] leading-4">
								{formatDate(file.uploadedAt)}
							</p>
						</div>
					</div>
					<div class="flex gap-2.5 items-center">
						<!-- DEFAULT TAG  -->
						<!-- <div
							class="bg-gradient h-[17px] w-[66px] rounded-full text-white font-satoshi-regular font-medium text-[12px] text-center"
						>
							Default
						</div> -->

						<!-- ACTIONS  -->
						{#if file.status === 'COMPLETED'}
							<div class="flex gap-2.5 items-center">
								<!-- DOWNLOAD BUTTON  -->
								<button onclick={() => downloadFile} class="size-[20px]">
									<a href={file.fileUrl} download target="_blank" referrerpolicy="strict-origin">
										<img src={downloadIcon} alt="download icon" width="24" height="24" />
									</a>
								</button>
								<span class="w-[1px] h-[25px] bg-[#D9D9D9]"></span>
								<!-- DROPDOWN MENU  -->
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<EllipsisVertical />
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<DropdownMenu.Group>
											<DropdownMenu.Item>
												<button class="block w-full text-left px-2 py-1 hover:bg-gray-100"
													>Make default</button
												>
											</DropdownMenu.Item>
											<DropdownMenu.Item>
												<button class="block w-full text-left px-2 py-1 hover:bg-gray-100"
													><a href={file.fileUrl} target="_blank" referrerpolicy="strict-origin"
														>View</a
													>
												</button>
											</DropdownMenu.Item>
											<DropdownMenu.Item>
												<button
													class="block w-full text-left px-2 py-1 text-red-500 hover:bg-gray-100"
													onclick={() => deleteSingleResume(file)}>Delete resume</button
												>
											</DropdownMenu.Item>
										</DropdownMenu.Group>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						{/if}
					</div>
				</div>
			</li>
		{/each}
	</ul>
	<Button
		class="bg-gradient w-full rounded-[8px] mt-5 border border-[#FFFFFF] h-[50px] hover:opacity-80"
		onclick={() => goto('/')}
	>
		Go to chat
	</Button>

	<!-- Drawer  -->
	<Drawer bind:isOpen={isDrawerOpen} onClose={() => (isDrawerOpen = false)}>
		<div class="flex flex-col justify-between h-full">
			<div class="px-5 border-b border-[#A3AED0] h-[90px] flex flex-col justify-center relative">
				<h4 class="font-medium text-[#262424] text-[14px] lg:text-[20px]">Add text content</h4>
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
