<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { amiibos, collectedInfo } from '../../store';
	import { CONFIG } from '$lib/config';
	import { formatDate } from '$lib/utils/commonUtil';

	const RECENT_KEY = 'zelda-amiibo-random-recent';
	const SELECTED_KEY = 'zelda-amiibo-random-selected';
	const MAX_RECENT = 5;
	const { AMIIBO_IMG_ENDPOINT } = CONFIG;

	let selected = $state<Amiibo | null>(null);
	let preview = $state<Amiibo | null>(null);
	let isDrawing = $state(false);
	let hasDrawn = $state(false);
	let recentIds = $state<string[]>([]);
	let reduceMotion = $state(false);
	let drawInterval: ReturnType<typeof setInterval> | undefined;
	let drawTimeout: ReturnType<typeof setTimeout> | undefined;

	const available = $derived($amiibos.filter((amiibo) => !amiibo.status));
	const inTransitCount = $derived(
		$amiibos.filter((amiibo) => amiibo.status === 'in_transit').length
	);
	const remainingAfterPick = $derived(Math.max(available.length - (selected ? 1 : 0), 0));
	const currentCard = $derived(preview ?? selected);

	const imageUrl = (amiibo: Amiibo) => `${AMIIBO_IMG_ENDPOINT}/${amiibo.images.toy}`;

	const pickOne = (pool: Amiibo[]) => pool[Math.floor(Math.random() * pool.length)];

	const chooseFinal = () => {
		const freshPool = available.filter(
			(amiibo) => !recentIds.includes(amiibo.id) && amiibo.id !== selected?.id
		);
		const pool = freshPool.length
			? freshPool
			: available.filter((amiibo) => amiibo.id !== selected?.id);
		return pickOne(pool.length ? pool : available);
	};

	const finishDraw = () => {
		const result = chooseFinal();
		if (!result) {
			isDrawing = false;
			return;
		}

		selected = result;
		preview = null;
		isDrawing = false;
		hasDrawn = true;
		recentIds = [result.id, ...recentIds.filter((id) => id !== result.id)].slice(0, MAX_RECENT);
		sessionStorage.setItem(RECENT_KEY, JSON.stringify(recentIds));
		localStorage.setItem(SELECTED_KEY, result.id);
	};

	const draw = () => {
		if (isDrawing || available.length === 0) return;

		isDrawing = true;
		hasDrawn = false;
		preview = pickOne(available) ?? null;

		if (reduceMotion) {
			finishDraw();
			return;
		}

		let ticks = 0;
		drawInterval = setInterval(() => {
			preview = pickOne(available) ?? null;
			ticks += 1;
			if (ticks >= 13 && drawInterval) {
				clearInterval(drawInterval);
				drawInterval = undefined;
				drawTimeout = setTimeout(finishDraw, 220);
			}
		}, 90);
	};

	onMount(() => {
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const savedId = localStorage.getItem(SELECTED_KEY);
		const savedAmiibo = available.find((amiibo) => amiibo.id === savedId);
		if (savedAmiibo) {
			selected = savedAmiibo;
			hasDrawn = true;
		} else if (savedId) {
			localStorage.removeItem(SELECTED_KEY);
		}

		try {
			const stored = JSON.parse(sessionStorage.getItem(RECENT_KEY) ?? '[]');
			recentIds = Array.isArray(stored) ? stored.filter((id) => typeof id === 'string') : [];
		} catch {
			recentIds = [];
		}
	});

	onDestroy(() => {
		if (drawInterval) clearInterval(drawInterval);
		if (drawTimeout) clearTimeout(drawTimeout);
	});
</script>

<svelte:head>
	<meta name="description" content="从尚未收集的塞尔达 Amiibo 中随机挑选你的下一个收藏目标。" />
</svelte:head>

<section class="random-page" aria-labelledby="random-title">
	<header class="random-intro">
		<p class="random-eyebrow">NEXT QUEST · 下一个收藏</p>
		<h1 id="random-title">随机选出下一个收藏</h1>
		<p>只从尚未拥有、也不在途的 Amiibo 中挑选。抽到谁，就想尽办法收藏它。</p>
		<div class="random-pool-summary" aria-label="随机池信息">
			<span><strong>{available.length}</strong> 位等待收藏</span>
			<span><strong>{inTransitCount}</strong> 位正在路上</span>
			<span><strong>{$collectedInfo.progressRate}%</strong> 当前进度</span>
		</div>
	</header>

	<div class="random-stage" class:drawing={isDrawing} class:revealed={hasDrawn}>
		<div class="random-rings" aria-hidden="true"><i></i><i></i><i></i></div>

		{#if currentCard}
			<article class="random-card" aria-live="polite" aria-busy={isDrawing}>
				<div class="random-card-topline">
					<span>{isDrawing ? '命运正在转动' : '你的下一个目标'}</span>
					<b
						>NO. {String($amiibos.findIndex((item) => item.id === currentCard?.id) + 1).padStart(
							2,
							'0'
						)}</b
					>
				</div>
				<div class="random-amiibo-image">
					<img src={imageUrl(currentCard)} alt={isDrawing ? '' : currentCard.name} />
				</div>
				<div class="random-card-copy">
					<p>{currentCard.series}</p>
					<h2>{isDrawing ? '正在寻找…' : currentCard.name}</h2>
					{#if !isDrawing}
						{#if currentCard.nameEn}<span>{currentCard.nameEn}</span>{/if}
						<small>发布于 {formatDate(currentCard.releaseDate)}</small>
					{/if}
				</div>
			</article>
		{:else}
			<div class="random-card random-card-back" aria-hidden="true">
				<img src="/images/totk-crest.png" alt="" />
				<span>THE LEGEND OF ZELDA</span>
				<strong>?</strong>
				<small>AMIIBO COLLECTION</small>
			</div>
		{/if}
	</div>

	<div class="random-actions">
		{#if available.length > 0}
			<button class="random-draw-button" type="button" onclick={draw} disabled={isDrawing}>
				<span aria-hidden="true">✦</span>
				{selected ? '再选一个' : '开始随机选卡'}
			</button>
		{:else}
			<p class="random-complete">全部收集完成，海拉鲁已没有遗落的伙伴了。</p>
		{/if}

		{#if selected && !isDrawing}
			<a class="random-detail-button" href={selected.detail} target="_blank" rel="noreferrer">
				查看 Amiibo 详情 ↗
			</a>
			<p class="random-quest-note">
				目标已保存在此设备 · 找到它之后，别忘了更新收藏数据。池中还剩 {remainingAfterPick}
				位候选。
			</p>
		{:else}
			<p class="random-quest-note">最近抽中过的 5 位会暂时避开，给每一位候选公平的机会。</p>
		{/if}
	</div>
</section>
