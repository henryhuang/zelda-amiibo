<script lang="ts">
	import { Gallery } from 'flowbite-svelte';

	const { data } = $props();

</script>

<Gallery items={data.toys} class="grid-cols-2 gap-4 md:grid-cols-3"></Gallery>