<script lang="ts">
	import { Progressradial } from 'flowbite-svelte';
	import { collectedInfo } from '../store';
	import { sineOut } from "svelte/easing";

</script>

<div class="mx-auto">
	<Progressradial
		size="w-50 h-50"
		progress={$collectedInfo.progressRate}
		animate
		labelOutside="收集进度"
		color="emerald"
		precision={2}
		easing={sineOut}
		tweenDuration={1500}
	/>
</div>