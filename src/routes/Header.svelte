<script lang="ts">
	import { page } from '$app/state';
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
		<strong>塞尔达 Amiibo 收藏馆</strong>
	</a>

	<nav class="museum-nav" aria-label="主导航" hidden>
		<a
			class="museum-nav-rewards"
			class:active={page.url.pathname.startsWith('/rewards')}
			href="/rewards"
			aria-current={page.url.pathname.startsWith('/rewards') ? 'page' : undefined}
		>
			<span aria-hidden="true">◇</span>
			<span class="museum-nav-rewards-label">游戏掉落</span>
		</a>
		<a
			class="museum-nav-random"
			class:active={page.url.pathname === '/random'}
			href="/random"
			aria-current={page.url.pathname === '/random' ? 'page' : undefined}
		>
			<span aria-hidden="true">✦</span>
			<span class="museum-nav-random-label">随机下一个</span>
		</a>
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
