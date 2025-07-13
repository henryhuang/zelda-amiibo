<script lang="ts">
	import { Navbar, NavBrand, NavHamburger } from 'flowbite-svelte';

	interface Props {
		title?: string;
	}


	let { title }: Props = $props();

</script>

<Navbar>
	<NavBrand href="/">
		<img src="/images/logo_200.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
			{ title ? ` ${title}` : "CNHALO.com"}
		</span>
	</NavBrand>
	<NavHamburger />
</Navbar>