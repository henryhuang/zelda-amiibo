<script lang="ts">
	import { Popover } from 'flowbite-svelte';
	import { gallery } from '../../store';
	import { goto } from '$app/navigation';

	interface Props {
		home?: boolean;
	}

	let { home = false }: Props = $props();

	const onClick = (id: string) => {
		goto('/collecting#' + id);
	};

	const images = $derived(
		$gallery.toys.map((image) => ({
			alt: image.alt,
			src: image.src,
			id: image.id,
			collected: image.collected
		}))
	);
</script>

<div class={home ? 'home-amiibo-grid' : 'grid grid-cols-3 gap-4 md:grid-cols-8'}>
	{#each images as item (item.id)}
		<div
			class={home
				? `home-amiibo-item ${item.collected ? 'is-collected' : 'is-missing'}`
				: 'cursor-pointer'}
			role="button"
			tabindex="0"
			onclick={() => onClick(item.id)}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onClick(item.id);
				}
			}}
		>
			<div id={item.id}>
				<img
					src={item.src}
					alt={item.alt}
					class={home ? '' : `h-auto max-w-full ${item.collected ? '' : 'opacity-20'}`}
				/>
			</div>
			<Popover triggeredBy="#{item.id}" class="w-96 text-sm font-light" defaultClass="p-0">
				<div class="text-center">
					<img src={item.src} class="h-full rounded-e-lg" alt={item.alt} />
				</div>
			</Popover>
		</div>
	{/each}
</div>
