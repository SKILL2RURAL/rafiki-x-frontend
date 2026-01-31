<script lang="ts">
	import { goto } from '$app/navigation';
	import downloadIcon from '$lib/assets/icons/downloadIcon.png';
	import upload from '$lib/assets/icons/upload.png';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { chatStore, resumes } from '$lib/stores/chatStore';
	import type { Resume } from '$lib/types/chat';
	import { cn } from '$lib/utils';
	import { EllipsisVertical } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Drawer from '../../Common/ReuseableDrawer.svelte';
	import TextEditor from './TextEditor.svelte';
	import { auth } from '$lib/stores/authStore';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import { generateTextResumeTitle } from '$lib/resumeText';
	let {
		onRequireAuth,
		onUpload,
		openEditor
	}: { onRequireAuth?: () => void; onUpload?: (files: FileList) => void; openEditor?: boolean } =
		$props();

	// GET ALL RESUMES ON MOUNT
	onMount(async () => {
		if (!$auth.accessToken) return;
		await chatStore.getAllResumes();
	});

	// GET ALL RESUMES
	// LOCAL STATES
	let isUploading = $state<boolean>(false);
	let isDrawerOpen = $state<boolean>(false);
	let resumeFiles = $state<Resume[]>($resumes || []);
	let textContent = $state('');
	let isSavingText = $state(false);

	$effect(() => {
		if (openEditor) isDrawerOpen = true;
	});

	// UPDATE THE RESUMEFILES LOCAL STATE
	$effect(() => {
		resumeFiles = $resumes;
	});

	// HANDLE FILE SELECTION
	function handleFileChange(event: Event) {
		const files = (event.target as HTMLInputElement).files;
		if (files && files.length > 0) {
			if (!$auth.accessToken) {
				onRequireAuth?.();
				return;
			}
			onUpload?.(files);
			const newFile: Resume = {
				id: Date.now(),
				fileName: files[0].name,
				fileUrl: `${(files[0].size / 1024).toFixed(1)} KB`,
				fileSize: files[0].size,
				status: 'pending',
				uploadedAt: new Date().toISOString(),
				isDefault: false
			};

			resumeFiles = [newFile, ...resumeFiles];
			handleResumeUpload(files[0]);
		}
	}

	function downloadFile(file: Resume) {
		window.open(file.fileUrl, '_blank', 'noopener,noreferrer');
	}

	// FUNCTION TO UPLOAD RESUME
	async function handleResumeUpload(file: File): Promise<void> {
		// CHECK IF THERE ARE FILES TO UPLOAD
		if (!file) {
			toast.error('No files to upload, please select a file');
			return;
		}

		isUploading = true;

		try {
			toast.loading('Uploading resume...');
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
		if (!$auth.accessToken) {
			onRequireAuth?.();
			return;
		}
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

	// FUNCTION TO SET DEFAULT RESUME
	async function setDefaultResume(file: Resume) {
		if (!$auth.accessToken) {
			onRequireAuth?.();
			return;
		}
		try {
			await chatStore.setDefaultResume(file.id).then((res) => {
				if (res) {
					toast.success('Resume set as default successfully');
					// Refresh resumes to get updated default status
					chatStore.getAllResumes();
				}
			});
		} catch (error) {
			toast.error('Failed to set resume as default');
		}
	}

	// FUNCTION TO FORMAT DATE
	function formatDate(date: string) {
		return new Date(date).toLocaleString('en-GB');
	}

	async function handleSaveTextResume() {
		if (!$auth.accessToken) {
			onRequireAuth?.();
			return;
		}

		const content = textContent.trim();
		if (!content) {
			toast.error('Please enter your resume text');
			return;
		}

		if (isSavingText) return;
		isSavingText = true;

		try {
			const title = generateTextResumeTitle(content);
			const res = await chatStore.uploadTextResume(content, title);
			if (res) {
				toast.success('Text resume uploaded successfully');
				// Ensure list is in sync with server ordering/default flags
				await chatStore.getAllResumes();
				textContent = '';
				isDrawerOpen = false;
			}
		} catch (e) {
			toast.error('Failed to upload text resume');
		} finally {
			isSavingText = false;
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
				<input type="file" class="hidden" onchange={handleFileChange} accept=".pdf" />
			</label>
		</p>
		<p class="mt-2 text-[11.3px] text-[#676767] leading-4">Supported format: PDF</p>
	</div>

	<div class="flex items-center gap-1 mt-6">
		<span class="lg:w-[285.5px] border-[0.64px] bg-[#C8CCD0]"> </span>
		<p class="text-[14px]">OR</p>
		<span class="lg:w-[285.5px] border-[0.64px] bg-[#C8CCD0]"> </span>
	</div>

	<Button
		class="w-full h-12 rounded-xl border p-2.5 bg-[#F7FBFD] text-black mt-4 hover:bg-[#F7FBFD]"
		onclick={() => {
			if (!$auth.accessToken) {
				onRequireAuth?.();
				return;
			}
			isDrawerOpen = true;
		}}>Add text Content</Button
	>

	<!-- <Button
		class="md:w-[611px] h-[48px] rounded-[8px] border p-2.5 bg-[#F7FBFD] text-black mt-4"
		onclick={onAddText}>Add text Content</Button
	> -->

	<ul class="flex flex-col gap-4 mt-6 max-h-[200px] overflow-y-auto">
		{#each resumeFiles as file}
			<li>
				<div
					class={cn(
						`md:w-[611px] min-w-[300px] h-[60px] flex justify-between rounded-xl bg-[#F7FBFD] p-3 font-satoshi-regular`,
						file.status === 'pending' ? 'opacity-30' : ''
					)}
				>
					<div class="flex gap-2 items-center">
						<!-- <img src={file.icon} alt="File Icon" class="" width="32" height="32" /> -->
						<div>
							<p
								class={cn(
									`text-[12px] lg:text-[14px] leading-5 font-plus-jakarta-sans-semibold max-w-[170px] truncate md:max-w-[400px]`,
									file.isDefault && `max-w-[150px] md:max-w-[300px]  truncate`
								)}
							>
								{file.fileName}
							</p>
							<p
								class={cn(
									'text-[10px] lg:text-[12px] text-[#4D5154] leading-4',
									file.isDefault && `max-w-[150px] md:max-w-[300px] truncate`
								)}
							>
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
								{#if file.isDefault}
									<button
										onclick={() => setDefaultResume(file)}
										class={cn(
											'bg-linear-to-r from-[#51A3DA] to-[#60269E] text-white rounded-[100px]  font-satoshi-regular font-medium',
											file.isDefault && `text-[9px] lg:text-[12px] md:px-4 px-2`
										)}
									>
										<p>Default</p>
									</button>
								{/if}
								<!-- DOWNLOAD BUTTON  -->
								<button onclick={() => downloadFile(file)} class="size-5">
									<img src={downloadIcon} alt="download icon" width="24" height="24" />
								</button>
								<span class="w-px h-[25px] bg-[#D9D9D9]"></span>
								<!-- DROPDOWN MENU  -->
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<EllipsisVertical />
									</DropdownMenu.Trigger>
									<DropdownMenu.Content>
										<DropdownMenu.Group>
											{#if !file.isDefault}
												<DropdownMenu.Item>
													<button
														class="block w-full text-left px-2 py-1 hover:bg-gray-100"
														onclick={() => setDefaultResume(file)}
													>
														Make default
													</button>
												</DropdownMenu.Item>
											{/if}

											{#if file.fileUrl}
												<DropdownMenu.Item onclick={() => window.open(file.fileUrl, '_blank')}>
													<button class="block w-full text-left px-2 py-1 hover:bg-gray-100"
														>View</button
													>
												</DropdownMenu.Item>
											{/if}
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
		class="bg-gradient w-full rounded-xl mt-5 border border-[#FFFFFF] h-[50px] hover:opacity-80"
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
			<TextEditor bind:value={textContent} />
			<div class="border-t border-[#33333380] p-5 flex justify-end gap-5">
				<button
					onclick={() => (isDrawerOpen = false)}
					class="border bg-linear-to-r from-[#51A3DA] to-[#60269E] p-px rounded-xl"
				>
					<div
						class="bg-white h-10 w-[120px] md:h-[55px] md:w-[185px] flex items-center justify-center rounded-[9px]"
					>
						<p
							class="bg-linear-to-r from-[#51A3DA] to-[#60269E] bg-clip-text text-transparent font-mulish font-semibold"
						>
							Go Back
						</p>
					</div>
				</button>
				<Button
					class="bg-linear-to-t from-[#51A3DA] to-[#60269E] h-[42px] w-[120px] md:h-[55px] md:w-[185px] font-mulish font-semibold rounded-[8px]"
					disabled={isSavingText || !textContent.trim()}
					onclick={handleSaveTextResume}
				>
					{#if isSavingText}
						Saving...
					{:else}
						Save
					{/if}
				</Button>
			</div>
		</div>
	</Drawer>
</div>
