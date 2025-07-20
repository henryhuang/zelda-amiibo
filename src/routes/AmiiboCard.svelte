<script lang="ts">

	import { Card, P, A } from 'flowbite-svelte';
	import { CONFIG } from '$lib/config';
	import { formatDate } from '$lib/utils/commonUtil';

	interface Props {
		amiibo: Amiibo;
		showCollectedOnly: boolean;
	}

	const { amiibo = $bindable(), showCollectedOnly = $bindable() }: Props = $props();
	const { AMIIBO_IMG_ENDPOINT } = CONFIG;

	let imageUrl: string = $derived.by(() => {
		return `${AMIIBO_IMG_ENDPOINT}/${amiibo.collected ? amiibo.images.box : amiibo.images.toy}`;
	});

	const cardStyles = $derived("border-1 border-solid" + (amiibo.collected ? " border-green-500" : ""));

</script>

<Card class={cardStyles}
>
	<div
		class="w-full mt-5"
		style="
				width: 100%;
				aspect-ratio: 16/9;
				background-image: url({imageUrl});
				background-repeat: no-repeat;
				background-size: cover;
				border-radius: 8px
			"
	></div>
	<div class="m-6">
		<h5 class="mb-2 text-lg tracking-tight text-gray-900 dark:text-white">
			<A class="font-medium hover:underline"
				 href={amiibo.detail}
				 target="_blank"
			>
				{amiibo.name}
			</A>
		</h5>
		<P italic class="mb-1 font-normal text-gray-500" size="xs">
			{amiibo.series}
		</P>
		<P class="mb-1 font-normal text-gray-500" size="xs">
			发布日 {formatDate(amiibo.releaseDate)}
		</P>
		{#if amiibo.collected}
			<P class="font-normal text-green-700" size="xs">
				收集日 {formatDate(amiibo.collectDate)}, 花费 {amiibo.price}
			</P>
		{/if}
	</div>
</Card>