<script lang="ts">
	import { Progressbar, Checkbox, Select, Label } from 'flowbite-svelte';
	import AmiiboCard from './AmiiboCard.svelte';
	import { fixTwoDecimals } from '$lib/utils/commonUtil';
	import { collectedInfo } from '../store';
	import { DevidedBy } from '$lib/utils/AmiiboDisplayDividedBy';

	const { data } = $props();

	const { amiibos, series } = data;
	const totalSize = amiibos.length;
	const collected = amiibos.filter(a => a.collected);
	const collectedSize = collected.length;
	const priceTotal = fixTwoDecimals(collected.reduce((sum, a) => sum + (a.price || 0), 0));
	const progress = fixTwoDecimals(collectedSize / totalSize * 100);

	$collectedInfo = {
		progressRate: progress,
		collectedNum: collectedSize,
		totalNum: totalSize,
		cost: priceTotal,
	}

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

	let displayAmiibos = $derived.by(() => DevidedBy(amiibos, searchCriteria));

	let cardPros: { amiibo: Amiibo, showCollectedOnly: boolean }[] = $derived.by(() => {
		return displayAmiibos.map(amiibo => ({
			amiibo,
			showCollectedOnly: searchCriteria.showCollectedOnly
		}))
	})

</script>
<div class="mb-3">
	<Progressbar progress={progress} color="green" size="h-4" labelOutside={`收集进度 ${collectedSize}/${totalSize}，已花费 ${priceTotal}`} />
</div>
<div class="mb-3">
	<div class="grid lg:grid-cols-2 grid-cols-1">
		<Label class="mt-4 flex items-center font-bold italic">
			<Checkbox divClass="me-1" bind:checked={searchCriteria.showCollectedOnly} />
			只显示已收集
		</Label>
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
		<AmiiboCard {...cardPros[index]} />
	{/each}
</div>