<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input';
    import { api } from '$lib/api';
    import { toast } from 'svelte-sonner';
    import { profile, fetchProfile } from '$lib/stores/profile';
    import { get } from 'svelte/store';

	export let isOpen: boolean = false;
	export let onClose: () => void;

	let formData = {
		firstName: '',
		LastName: '',
	};

    let loading = false;

    //When modal opens prefill with existing data
    $: if (isOpen) {
        const data = get(profile).data;
        if (data) {
            formData.firstName = data.firstName || '';
            formData.LastName = data.lastName || '';
        }
    }

    async function handleSave() {
        try {
            loading = true;
            await api.put('/user/profile', {
                firstName: formData.firstName,
                lastName: formData.LastName
            });
            toast.success('Name updated successfully!');
            await fetchProfile();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update name. Please try again.');
        } finally {
            loading = false;
        }
    }

</script>

<Dialog.Root open={isOpen} onOpenChange={onClose}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-center text-[24px] text-[#253B4B] font-bold font-mulish"
				>Edit Full Name</Dialog.Title
			>
		</Dialog.Header>
		<div>
			<label for="firstName" class="text-sm">First Name</label>
			<Input
                id="firstName"
				type="text"
				bind:value={formData.firstName}
				placeholder="Enter your FirstName"
				class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
			/>
		</div>
		<div>
			<label for="lastName" class="text-sm">Last Name </label>
			<Input
                id="lastName"
				type="text"
				bind:value={formData.LastName}
				placeholder="Enter your LastName"
				class="mt-2 border border-[#D0D5DD] h-[40px] rounded-[8px] bg-[#FFFFFF4D] placeholder:text-white placeholder:font-satoshi-regular"
			/>
		</div>

		<Button
			onclick={handleSave}
			disabled={loading}
			class="bg-gradient w-full rounded-[8px] mt-5 border border-[#FFFFFF] h-[50px]"
		>
			{loading ? 'Saving...' : 'Save Changes'}
		</Button>
	</Dialog.Content>
</Dialog.Root>
