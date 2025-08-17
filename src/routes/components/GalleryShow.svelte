<script>
import { Gallery } from 'flowbite-svelte';
import { gallery } from '../../store';
</script>

<Gallery items={$gallery.toys} class="grid-cols-3 md:grid-cols-8">
	{#snippet figure(item)}
		<div>
			<img src={item.src} alt={item.alt} class="h-auto max-w-full {item.collected? '' : 'opacity-20'}" />
		</div>
	{/snippet}
</Gallery>