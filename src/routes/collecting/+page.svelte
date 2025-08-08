<script lang="ts">
	import { Checkbox, Label, Progressbar, Select } from 'flowbite-svelte';
	import AmiiboCard from './AmiiboCard.svelte';
	import { amiibos, collectedInfo, series } from '../../store';
	import { DevidedBy } from '$lib/utils/AmiiboDisplayDividedBy';

	const seriesOptions = [{
		value: "ALL",
		name: "所有系列"
	}, ...$series.map(s => ({
		value: s,
		name: s
	}))];

	let searchCriteria: AmiiboSearchCriteria = $state({
		showCollectedOnly: false,
		newestFirst: true,
		series: "ALL"
	});

	let displayAmiibos = $derived.by(() => DevidedBy($amiibos, searchCriteria));

	let cardPros: { amiibo: Amiibo, showCollectedOnly: boolean }[] = $derived.by(() => {
		return displayAmiibos.map(amiibo => ({
			amiibo,
			showCollectedOnly: searchCriteria.showCollectedOnly
		}))
	})

</script>
<div class="mb-3">
	<Progressbar progress={$collectedInfo.progressRate} color="green" size="h-4" labelOutside={`收集进度 ${$collectedInfo.collectedNum}/${$collectedInfo.totalNum}，已花费 ${$collectedInfo.cost}`} />
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