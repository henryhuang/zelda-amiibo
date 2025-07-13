<script lang="ts">

	import { Badge, Card, P } from 'flowbite-svelte';
	import { Image } from "@unpic/svelte";
	import {CONFIG} from "$lib/config";

	interface Props {
		amiibo: Amiibo;
	}

	const { amiibo = $bindable() }: Props = $props();
	const { AMIIBO_IMG_ENDPOINT } = CONFIG;

	let src: string = `${AMIIBO_IMG_ENDPOINT}/${amiibo.collected ? amiibo.images.box : amiibo.images.toy}`;

</script>

<Card class={amiibo.collected ? "border-green-500" : ""}
>
	<Image
		src={src}
		alt={amiibo.name}
		loading="lazy"
	/>
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