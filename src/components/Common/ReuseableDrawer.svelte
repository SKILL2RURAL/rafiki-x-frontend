<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index';
	export let isOpen: boolean = false;
	export let onClose: (value: boolean) => {};
	// export let title: string = '';
	// export let description: string = '';
</script>

<Drawer.Root open={isOpen} onOpenChange={onClose} direction="right">
	<Drawer.Content class="data-[vaul-drawer-direction=right]:sm:max-w-[580px]">
		<!-- <Drawer.Header>
			<Drawer.Title>{title}</Drawer.Title>
			<Drawer.Description>{description}</Drawer.Description>
		</Drawer.Header> -->
		<slot />
		<!-- <Drawer.Footer>
			<button>Submit</button>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer> -->
	</Drawer.Content>
</Drawer.Root>
