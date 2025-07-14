<script lang="ts">

	import { Badge, Card, P } from 'flowbite-svelte';
	import { CONFIG } from '$lib/config';

	interface Props {
		amiibo: Amiibo;
		showCollectedOnly: boolean;
	}

	const { amiibo = $bindable(), showCollectedOnly = $bindable() }: Props = $props();
	const { AMIIBO_IMG_ENDPOINT } = CONFIG;

	let imageUrl: string = $derived.by(() => {
		return `${AMIIBO_IMG_ENDPOINT}/${amiibo.collected ? amiibo.images.box : amiibo.images.toy}`;
	});

</script>

<Card class={amiibo.collected ? "border-green-500" : ""}
>
	{#if !showCollectedOnly || amiibo.collected}
		<div
			class="w-full"
			style="
			width: 100%;
			aspect-ratio: 16/9;
    	background-image: url({imageUrl});
    	background-repeat: no-repeat;
    	background-size: cover;"
		></div>
	{/if}
	<div class="m-6">
		<h5 class="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">
			{amiibo.name}
		</h5>
		<p class="mb-1 font-normal text-gray-500">
			{amiibo.series}
		</p>
		<P class="mb-5 font-normal text-gray-500" size="xs">
			发布日 {amiibo.releaseDate}
		</P>
		{#if amiibo.collected}
			<Badge color="green" large border>收集日 {amiibo.collectDate}, 花费 {amiibo.price}</Badge>
		{/if}
	</div>
</Card>