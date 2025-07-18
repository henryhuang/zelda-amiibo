<script lang="ts">
	import { P, Progressbar, Checkbox } from 'flowbite-svelte';
	import AmiiboCard from './AmiiboCard.svelte';
	import { fixTwoDecimals } from '$lib/utils/commonUtil';

	const { data } = $props();

	const { amiibos } = data;
	const totalSize = amiibos.length;
	const collected = amiibos.filter(a => a.collected);
	const collectedSize = collected.length;
	const priceTotal = collected.reduce((sum, a) => sum + (a.price || 0), 0);
	const progress = fixTwoDecimals(collectedSize / totalSize * 100);

	let searchCriteria: AmiiboSearchCriteria = $state({
		showCollectedOnly: false,
		newestFirst: true
	});
	let displayAmiibos = $derived.by(() => {
		let temp = amiibos
			.filter(a => !searchCriteria.showCollectedOnly || a.collected);
		if (searchCriteria.showCollectedOnly) {
			temp = temp.sort((a, b) => Date.parse(a.releaseDate) - Date.parse(b.releaseDate));
		}
		return temp;
	});
	let cardPros: { amiibo: Amiibo, showCollectedOnly: boolean }[] = $derived.by(() => {
		return displayAmiibos.map(amiibo => ({
			amiibo,
			showCollectedOnly: searchCriteria.showCollectedOnly
		}))
	})

</script>
<div class="mb-3">
	<Progressbar progress={progress} color="green" size="h-4" labelOutside={`收集进度 ${collectedSize}/${totalSize}`} />
</div>
<div class="mb-3">
	<div class="grid grid-cols-2">
		<P size="xl" weight="normal">已花费 {fixTwoDecimals(priceTotal)}</P>
		<div class="text-right">
			<Checkbox bind:checked={searchCriteria.showCollectedOnly}>只显示已收集</Checkbox>
		</div>
	</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
	{#each cardPros as C, index(index)}
		<AmiiboCard {...cardPros[index]}/>
	{/each}
</div>