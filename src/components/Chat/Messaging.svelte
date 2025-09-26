<script lang="ts">
	import { chatStore } from '$lib/stores/chatStore';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import send from '$lib/assets/icons/send.svg';
	import search from '$lib/assets/icons/search.svg';
	import paperclip from '$lib/assets/icons/paperclip.png';
	import botLogo from '$lib/assets/icons/botLogo.png';
	import copyIcon from '$lib/assets/icons/copyIcon.png';
	import like from '$lib/assets/icons/likeIcon.png';
	import thumDown from '$lib/assets/icons/thumbDown.png';
	import megaphone from '$lib/assets/icons/megaphone.png';
	import mic from '$lib/assets/icons/mic.png';

	let newMessage = '';
	let selectedFile: File | null = null;
	let fileInput: HTMLInputElement;

	function handleSend() {
		if (!newMessage.trim() && !selectedFile) return;

		// Send text if available
		if (newMessage.trim()) {
			chatStore.sendMessage(newMessage);
		}

		// Send file available
		if (selectedFile) {
			chatStore.sendFile(selectedFile);
			selectedFile = null;
		}

		newMessage = '';

		//simulate Ai response
		setTimeout(() => {
			chatStore.receiveMessage("Got it! I'll help you with that 👍");
		}, 800);
	}

	function triggerFileUpload() {
		fileInput.click();
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			selectedFile = target.files[0];
		}
	}
</script>

<div class="flex flex-col justify-between gap-20 h-[86vh] font-mulish font-medium">
	<!--Chat area-->
	<div class="flex-1 overflow-y-auto lg:p-5 space-y-4 bg-white">
		{#each $chatStore as msg (msg.id)}
			<div class="flex {msg.sender === 'user' ? 'justify-end' : 'justify-start'}">
				<div class="px-4 py-2 max-w-[70%]">
					{#if msg.sender === 'bot'}
						<div class="flex gap-4">
							<img src={botLogo} width="16" height="16" class="object-contain" alt="bot logo" />
							<div class="space-y-2 mt-6">
								<p class="px-4 py-2 text-sm bg-gray-100 rounded-lg rounded-bl-none text-[#808990]">
									{msg.text}
								</p>
								<div class="flex gap-4 items-center">
									<img
										src={copyIcon}
										width="16"
										height="16"
										class="cursor-pointer"
										alt="copy Icon"
									/>
									<img src={like} width="16" height="16" class="cursor-pointer" alt="Like Icon" />
									<img
										src={thumDown}
										width="16"
										height="16"
										class="cursor-pointer"
										alt="thumb down"
									/>
									<img
										src={megaphone}
										width="16"
										height="16"
										class="cursor-pointer"
										alt="mega phone"
									/>
								</div>
							</div>
						</div>
					{:else}
						<div class="flex flex-col">
							<p class="px-4 py-2 text-sm rounded-lg bg-[#F7F6F5] rounded-br-none">{msg.text}</p>
							<img
								src={copyIcon}
								class="self-end mt-1 cursor-pointer"
								width="16"
								height="16"
								alt="copy Icon"
							/>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<!-- Input Area -->
	<div class="sticky bottom-0 bg-white flex flex-col gap-4">
		<div class="border border-[#E8E8E8] rounded-[20px] p-4 bg-white shadow-md">
			<div class="flex flex-col px-3 py-2 gap-4">
				<div class="flex">
					<img src={search} class="ml-2" width="16" height="16" alt="Search Icon" />
					<!-- Text Input -->
					<input
						type="text"
						placeholder="Ask Rafiki..."
						bind:value={newMessage}
						class="flex-1 px-2 text-sm bg-transparent outline-none"
						onkeydown={(e) => e.key === 'Enter' && handleSend()}
					/>
				</div>

				<div class="flex justify-between">
					<!-- File Upload Button -->
					<div class="flex gap-2 items-center">
						<button
							onclick={triggerFileUpload}
							class="p-2 h-[48px] w-[48px] border rounded-full hover:bg-gray-100"
						>
							<img src={paperclip} class="mx-auto" width="20" height="20" alt="file picker" />
						</button>
						<input
							type="file"
							class={selectedFile ? 'flex' : 'hidden'}
							bind:this={fileInput}
							onchange={handleFileChange}
						/>
					</div>
					{#if newMessage.length === 0}
						<!-- Mic Button -->
						<button
							class="p-2 h-[48px] w-[48px] border rounded-full hover:bg-gray-100"
							onclick={handleSend}
						>
							<img src={mic} class="mx-auto" width="20" height="20" alt="mic icon" />
						</button>
					{:else}
						<button
							class="p-2 h-[48px] w-[48px] border rounded-full hover:bg-gray-100"
							onclick={handleSend}
						>
							<img src={send} class="mx-auto" width="20" height="20" alt="send icon" />
						</button>
					{/if}
				</div>
			</div>
		</div>
		<p class="font-satoshi-regular font-light text-[14px] text-[#686868] self-center">
			By messaging RafikiX, you agree to our Terms and Conditions
		</p>
	</div>
</div>
