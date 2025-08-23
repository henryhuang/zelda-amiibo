<script lang="ts">
	import { goto } from '$app/navigation';
	import GalleryShow from './components/GalleryShow.svelte';

	const onClick = () => {
		goto('/collecting');
	};

</script>

<div
	class="mx-auto cursor-pointer"
	role="button"
	tabindex="0"
	onclick={onClick}
	onkeydown={e => {
		if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onClick();
			}
	}}
>
</div>
<GalleryShow />
