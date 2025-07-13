<script lang="ts">

	import { Badge, Card, P } from 'flowbite-svelte';
	import {CONFIG} from "$lib/config";

	interface Props {
		amiibo: Amiibo;
	}

	const { amiibo = $bindable() }: Props = $props();
	const collected = $derived(Boolean(amiibo.collectDate));
	const { AMIIBO_IMG_ENDPOINT } = CONFIG;

</script>

<Card img={`${AMIIBO_IMG_ENDPOINT}/${collected ? amiibo.images.box : amiibo.images.toy}`}
			class={collected ? "border-green-500" : ""}
>
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
		{#if collected}
			<Badge color="green" large border>收集日 {amiibo.collectDate}, 花费 {amiibo.price}</Badge>
		{/if}
	</div>
</Card>