<script>
	import { Gallery, Popover } from 'flowbite-svelte';
	import { gallery } from '../../store';
	import { goto } from '$app/navigation';

	const onClick = (id) => {
		goto('/collecting#' + id);
	};

	const images = $gallery.toys.map(image => ({
		alt: image.alt,
		src: image.src,
		id: image.id,
		collected: image.collected,
	}));

</script>

<Gallery items={images} class="grid-cols-3 md:grid-cols-8">
	{#snippet figure(item)}
		<div
			class="cursor-pointer"
			role="button"
			tabindex="0"
			onclick={() => onClick(item.id)}
			onkeydown={e => {
				if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						onClick(item.id);
					}
			}}
		>
			<div id={item.id}>
				<img src={item.src} alt={item.alt} class="h-auto max-w-full {item.collected? '' : 'opacity-20'}" />
			</div>
			<Popover triggeredBy="#{item.id}" class="w-96 text-sm font-light" defaultClass="p-0">
				<div class="text-center">
					<img src={item.src} class="h-full rounded-e-lg" alt={item.alt} />
				</div>
			</Popover>
		</div>
	{/snippet}
</Gallery>