<script lang="ts">
	import { Footer, FooterCopyright } from 'flowbite-svelte';
	import { page } from '$app/state';
	import '../app.css';
	import Header from './Header.svelte';
	import { fixTwoDecimals } from '$lib/utils/commonUtil';
	import { initStore } from '../store';

	const { data, children } = $props();

	const { amiibos, series, imgEndpoint } = data;
	const totalSize = amiibos.length;
	const collected = amiibos.filter(a => Boolean(a.collectedInfo));
	const collectedSize = collected.length;
	const priceTotal = fixTwoDecimals(collected.reduce((sum, a) => sum + (a.collectedInfo?.price || 0), 0));
	const progress = fixTwoDecimals(collectedSize / totalSize * 100);

	const collectedInfo = {
		progressRate: progress,
		collectedNum: collectedSize,
		totalNum: totalSize,
		cost: priceTotal,
	}

	initStore(collectedInfo, amiibos, series, imgEndpoint);

</script>

<div class="flex flex-col h-screen justify-between">
	<Header title={page.data?.title} menus={page.data?.menus} />

	<main class="container mx-auto px-4">
		{@render children()}
	</main>

	<Footer>
		<FooterCopyright href="https://cnhalo.com" by="cnhalo.com™" year={new Date().getFullYear()} />
	</Footer>
</div>
