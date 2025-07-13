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

	let showCollectedOnly = $state(false);
	let displayAmiibos = $derived.by(() => {
		return amiibos
			.filter(a => !showCollectedOnly || a.collected)
	});
	let cardPros: { amiibo: Amiibo }[] = $derived.by(() => {
		return displayAmiibos.map(amiibo => ({
			amiibo
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
			<Checkbox bind:checked={showCollectedOnly}>只显示已收集</Checkbox>
		</div>
	</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
	{#each cardPros as C, index(index)}
		<AmiiboCard {...cardPros[index]}/>
	{/each}
</div>