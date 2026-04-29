<script lang="ts">
	import { onDestroy } from 'svelte';
	import { collectedInfo } from '../store';
	import { downloadBackup } from '$lib/utils/commonUtil';

	interface Props {
		title?: string;
	}

	let { title }: Props = $props();
	let myCollectedInfo: CollectedInfo;
	const unsubscribe = collectedInfo.subscribe((value: CollectedInfo) => {
		myCollectedInfo = value;
	});

	onDestroy(unsubscribe);
</script>

<svelte:head>
	<title>{title ? `${title}` : '塞尔达 Amiibo 收藏馆'}</title>
</svelte:head>

<header class="museum-header">
	<a class="museum-brand" href="/">
		<img src="/images/totk-crest.png" alt="塞尔达 Amiibo 收藏馆" />
		<span>
			<strong>塞尔达 Amiibo 收藏馆</strong>
			<small>探索海拉鲁，收集每一份冒险的记忆</small>
		</span>
	</a>

	<nav class="museum-nav" aria-label="主导航">
		<button
			type="button"
			onclick={() => {
				if (myCollectedInfo) {
					downloadBackup(myCollectedInfo);
				}
			}}
		>
			<span>▥</span>
			备份
		</button>
	</nav>
</header>
