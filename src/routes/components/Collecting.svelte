<script lang="ts">
	import { collectedInfo } from '../../store';
	import { sineOut } from 'svelte/easing';
	import { P, Progressradial } from 'flowbite-svelte';
</script>

<div>
	<P size="base" align="center" weight="bold">
		收集进度
	</P>
	<Progressradial
		size="w-50 h-50"
		progress={$collectedInfo.progressRate}
		animate
		labelInside
		color="emerald"
		precision={2}
		easing={sineOut}
		tweenDuration={1500}
		onclick={() => console.log(123)}
	/>
</div>