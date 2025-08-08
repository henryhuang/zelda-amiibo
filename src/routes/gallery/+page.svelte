<script lang="ts">
	import { Gallery } from 'flowbite-svelte';
	import { gallery } from '../../store';
</script>

<Gallery items={$gallery.toys} class="grid-cols-2 gap-4 md:grid-cols-3"></Gallery>