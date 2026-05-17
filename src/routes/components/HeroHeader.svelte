<script lang="ts">
	import { CONFIG } from '$lib/config';

	interface Props {
		totalCount: number;
		collectedCount: number;
		missingCount: number;
		pendingCount: number;
		seriesCount: number;
		latestCollectedDate: string;
		progressRate: number;
		collectedAmiibos: Amiibo[];
	}

	let {
		totalCount,
		collectedCount,
		missingCount,
		pendingCount,
		seriesCount,
		latestCollectedDate,
		progressRate,
		collectedAmiibos
	}: Props = $props();

	const { AMIIBO_IMG_ENDPOINT } = CONFIG;

	interface BackdropItem {
		amiibo: Amiibo;
		size: string;
		offsetX: string;
		offsetY: string;
		rotation: string;
		scale: number;
		opacity: number;
	}

	let backdropItems = $state<BackdropItem[]>([]);

	const backdropColumns = $derived(Math.max(1, Math.ceil(Math.sqrt(collectedAmiibos.length || 1))));
	const backdropRows = $derived(Math.max(1, Math.ceil((collectedAmiibos.length || 1) / backdropColumns)));

	const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

	const shuffle = <T,>(items: T[]): T[] => {
		const s = [...items];
		for (let i = s.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[s[i], s[j]] = [s[j], s[i]];
		}
		return s;
	};

	$effect(() => {
		backdropItems = shuffle(collectedAmiibos).map((amiibo) => ({
			amiibo,
			size: `${randomBetween(118, 172).toFixed(1)}px`,
			offsetX: `${randomBetween(-18, 18).toFixed(1)}%`,
			offsetY: `${randomBetween(-16, 16).toFixed(1)}%`,
			rotation: `${randomBetween(-10, 10).toFixed(1)}deg`,
			scale: Number(randomBetween(0.96, 1.24).toFixed(2)),
			opacity: Number(randomBetween(0.7, 1).toFixed(2))
		}));
	});
</script>

<div class="hero-content" aria-label="收藏进度" role="button" tabindex="0" onclick={() => document.getElementById('museum-panel')?.scrollIntoView({ behavior: 'smooth' })} onkeydown={(e) => { if (e.key === 'Enter') { document.getElementById('museum-panel')?.scrollIntoView({ behavior: 'smooth' }); } }}>
	<div
		class="museum-progress-backdrop"
		style={`--backdrop-columns: ${backdropColumns}; --backdrop-rows: ${backdropRows}`}
		aria-hidden="true"
	>
		{#each backdropItems as item (item.amiibo.id)}
			<img
				src={`${AMIIBO_IMG_ENDPOINT}/${item.amiibo.images.toy}`}
				alt=""
				style={`--backdrop-size: ${item.size}; --backdrop-x: ${item.offsetX}; --backdrop-y: ${item.offsetY}; --backdrop-rotation: ${item.rotation}; --backdrop-scale: ${item.scale}; --backdrop-opacity: ${item.opacity}`}
			/>
		{/each}
	</div>

	<div class="hero-content-inner">
		<!-- Stats row: 已收集 / 未收集 / 系列作品 / 最后收集 -->
		<div class="hero-stats">
			<div class="hero-stat-item">
				<span class="hero-stat-label">已收集</span>
				<strong class="hero-stat-value collected">{collectedCount}</strong>
			</div>
			<div class="hero-stat-item">
				<span class="hero-stat-label">未收集</span>
				<strong class="hero-stat-value">{missingCount}</strong>
			</div>
			<div class="hero-stat-item">
				<span class="hero-stat-label">待发布</span>
				<strong class="hero-stat-value">{pendingCount}</strong>
			</div>
			<div class="hero-stat-item">
				<span class="hero-stat-label">系列作品</span>
				<strong class="hero-stat-value">{seriesCount}</strong>
			</div>
			<div class="hero-stat-item">
				<span class="hero-stat-label">最后收集</span>
				<strong class="hero-stat-value date">{latestCollectedDate || '--'}</strong>
			</div>
		</div>

		<!-- Progress bar + percentage + count -->
		<div class="hero-progress-section">
			<div class="hero-progress-track">
				<div class="hero-progress-fill" style="width: {progressRate}%"></div>
			</div>
			<div class="hero-progress-meta">
				<span class="hero-progress-pct">{progressRate}%</span>
				<span class="hero-progress-count">{collectedCount} / {totalCount}</span>
			</div>
		</div>
	</div>
</div>
