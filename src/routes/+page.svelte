<script lang="ts">
	import { Progressradial, P } from 'flowbite-svelte';
	import { collectedInfo } from '../store';
	import { sineOut } from 'svelte/easing';
	import { goto } from '$app/navigation';

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