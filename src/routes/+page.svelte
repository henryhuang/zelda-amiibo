<script lang="ts">
	import { P, Progressbar, Checkbox } from 'flowbite-svelte';
	import AmiiboCard from './AmiiboCard.svelte';
	import zeldaAmiibos from '$lib/data/zelda-amiibo.json';
	import { fixTwoDecimals } from '$lib/utils/commonUtil';

	const rawAmiibos = zeldaAmiibos as Amiibo[];
	const totalSize = rawAmiibos.length;
	const collected = rawAmiibos.filter(a => Boolean(a.collectDate));
	const collectedSize = collected.length;
	const priceTotal = collected.reduce((sum, a) => sum + a.price, 0);
	const progress = fixTwoDecimals(collectedSize / totalSize * 100);

	let showCollectedOnly = $state(false);
	let displayAmiibos = $derived.by(() => {
		return rawAmiibos
			.filter(a => !showCollectedOnly || Boolean(a.collectDate))
			.sort((a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate));
	});

</script>
<div class="mb-3">
	<Progressbar progress={progress} color="green" size="h-4" labelOutside={`收集进度 ${collectedSize}/${totalSize}`} />
</div>
<div class="mb-3">
	<div class="grid grid-cols-2">
		<P size="1xl" weight="normal">已花费 {fixTwoDecimals(priceTotal)}</P>
		<div class="text-right">
			<Checkbox bind:checked={showCollectedOnly}>只显示已收集</Checkbox>
		</div>
	</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
	{#each displayAmiibos as amiibo, index(index)}
		<AmiiboCard amiibo={amiibo} />
	{/each}
</div>