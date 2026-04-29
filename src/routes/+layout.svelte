<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';
	import Header from './Header.svelte';
	import { fixTwoDecimals } from '$lib/utils/commonUtil';
	import { initStore } from '../store';
	import Footer from './Footer.svelte';

	const { data, children } = $props();

	const { amiibos, series, imgEndpoint } = data;
	const totalSize = amiibos.length;
	const collected = amiibos.filter((a) => Boolean(a.collectedInfo));
	const collectedSize = collected.length;
	const priceTotal = fixTwoDecimals(
		collected.reduce((sum, a) => sum + (a.collectedInfo?.price || 0), 0)
	);
	const progress = fixTwoDecimals((collectedSize / totalSize) * 100);

	const collectedInfo = {
		progressRate: progress,
		collectedNum: collectedSize,
		totalNum: totalSize,
		cost: priceTotal
	};

	initStore(collectedInfo, amiibos, series, imgEndpoint);

	const routeClass = $derived(`museum-page route-${page.url.pathname === '/' ? 'home' : 'inner'}`);
</script>

<div class={routeClass}>
	<Header title={page.data?.title} />

	<main class="museum-main">
		{@render children()}
	</main>

	<Footer />
</div>
