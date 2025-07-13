<script lang="ts">
	import { Footer, FooterCopyright } from 'flowbite-svelte';
	import { page } from "$app/state";
	import '../app.css';
	import Header from './Header.svelte';

	let { children } = $props();
</script>

<div>
	<Header title={page.data?.title} />

	<main class="container mx-auto px-4 min-h-screen">
		{@render children()}
	</main>

	<Footer>
		<FooterCopyright href="https://cnhalo.com" by="cnhalo.com™" year={new Date().getFullYear()} />
	</Footer>
</div>
