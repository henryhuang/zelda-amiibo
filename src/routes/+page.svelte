<script lang="ts">
	import { P, Progressbar, Checkbox, Select } from 'flowbite-svelte';
	import AmiiboCard from './AmiiboCard.svelte';
	import { fixTwoDecimals } from '$lib/utils/commonUtil';

	const { data } = $props();

	const { amiibos, series } = data;
	const totalSize = amiibos.length;
	const collected = amiibos.filter(a => a.collected);
	const collectedSize = collected.length;
	const priceTotal = collected.reduce((sum, a) => sum + (a.price || 0), 0);
	const progress = fixTwoDecimals(collectedSize / totalSize * 100);
	const seriesOptions = [{
		value: "ALL",
		name: "所有系列"
	}, ...series.map(s => ({
		value: s,
		name: s
	}))];

	let searchCriteria: AmiiboSearchCriteria = $state({
		showCollectedOnly: false,
		newestFirst: true,
		series: "ALL"
	});
	let displayAmiibos = $derived.by(() => {
		let temp = amiibos
			.filter(a => !searchCriteria.showCollectedOnly || a.collected)
			.filter(a => searchCriteria.series === "ALL" || a.series === searchCriteria.series);
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
	<Progressbar progress={progress} color="green" size="h-4" labelOutside={`收集进度 ${collectedSize}/${totalSize}，已花费 ${fixTwoDecimals(priceTotal)}`} />
</div>
<div class="mb-3">
	<div class="grid lg:grid-cols-2 grid-cols-1">
		<Checkbox class="mt-1" bind:checked={searchCriteria.showCollectedOnly}>
			只显示已收集
		</Checkbox>
		<div class="grid-col">
			<Select
				placeholder="选择系列"
				id="select-underline"
				size="sm"
				underline
				items={seriesOptions}
				bind:value={searchCriteria.series}
			/>
		</div>
	</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
	{#each cardPros as C, index(index)}
		<AmiiboCard {...cardPros[index]}/>
	{/each}
</div>