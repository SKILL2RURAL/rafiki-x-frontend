<script lang="ts">
	import { goto } from '$app/navigation';

	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import X from '$lib/assets/icons/custom-x.svg';
	import logo from '$lib/assets/logo.svg';
	import { ChevronRight, EllipsisVertical } from 'lucide-svelte';
	import premium from '$lib/assets/icons/premium.png';
	import noProfile from '$lib/assets/icons/no-profile.png';
	import logout from '$lib/assets/icons/door-open.png';

	const { isOpen, onClose } = $props();
</script>

<Drawer.Root open={isOpen} onOpenChange={onClose} direction="left">
	<Drawer.Content class="data-[vaul-drawer-direction=left]:w-[100vw]">
		<aside class="p-5 py-10 flex flex-col justify-between h-screen">
			<div class="flex justify-between items-end">
				<div class="flex items-end gap-3 leading-none">
					<img src={logo} alt="Rafiki X" width="40" height="40" />
					<p
						class="text-[24px] font-semibold bg-gradient-to-r from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
					>
						RafikiX
					</p>
				</div>
				<button class="bg-[#1E1E1E33] p-2 rounded-[8px]" onclick={onClose}>
					<img src={X} alt="" width="20" height="20" />
				</button>
			</div>

			<!-- History  -->
			<div class="h-full mr-3 my-2 p-2 mt-5">
				<div class="space-y-3">
					<h1 class="text-[14px] font-[400] text-[#808990]">Today</h1>
					<div class="flex items-center justify-between">
						<p class="text-[16px] text-[#253B4B] font-[500]">Career story generation</p>
						<button>
							<EllipsisVertical />
						</button>
					</div>
				</div>
			</div>

			<!-- Settings  -->
			<div class="mr-3">
				<button
					class="w-full flex items-center justify-between border custom-border-gradient rounded-[10px] py-4 px-3 mb-5"
					onclick={() => goto('/learn-more')}
				>
					<p
						class="text-[16px] font-bold bg-gradient-to-r from-[#51A3DA] to-[#60269E] text-transparent bg-clip-text"
					>
						Learn more
					</p>
					<div class="rounded-full bg-gradient p-1">
						<ChevronRight color="white" size={15} />
					</div>
				</button>

				<h5 class="text-[#253B4B] text-[12px] mb-5 font-medium">Settings</h5>

				<div class="space-y-7 font-semibold text-[#80899A] text-sm">
					<button class="flex items-center gap-3">
						<img src={premium} alt="Rafiki X" width="20" height="20" />
						<p class="">Go premium today</p>
					</button>
					<button class="flex items-center gap-3" onclick={() => goto('/my-profile')}>
						<img src={noProfile} alt="Rafiki X" width="20" height="20" />
						<p>My profile</p>
					</button>
					<button
						class="flex items-center gap-3"
						onclick={() => {
							goto('/login');
						}}
					>
						<img src={logout} alt="Rafiki X" width="20" height="20" />
						<p>Logout</p>
					</button>
				</div>
			</div>
		</aside>
	</Drawer.Content>
</Drawer.Root>
