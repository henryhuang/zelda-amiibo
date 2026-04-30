<script lang="ts">
	import { amiibos, collectedInfo, series } from '../../store';
	import { CONFIG } from '$lib/config';
	import { formatDate } from '$lib/utils/commonUtil';

	interface Props {
		initialStatus?: 'all' | 'collected' | 'missing';
		initialView?: 'grid' | 'list';
	}

	let { initialStatus = 'all', initialView = 'grid' }: Props = $props();

	let activeFilter = $state<string>(initialStatus);
	let query = $state('');
	let sortBy = $state('release-desc');
	let viewMode = $state(initialView);

	const { AMIIBO_IMG_ENDPOINT } = CONFIG;

	const collectedCount = $derived($collectedInfo.collectedNum);
	const totalCount = $derived($collectedInfo.totalNum);
	const missingCount = $derived(Math.max(totalCount - collectedCount, 0));
	const seriesCount = $derived($series.length);
	const earliestYear = $derived.by(() => {
		const years = $amiibos.map((amiibo) => Number(amiibo.releaseDate.slice(0, 4))).filter(Boolean);
		return years.length ? Math.min(...years) : '';
	});

	const isChampion = (amiibo: Amiibo) =>
		['米法', '达尔克尔', '力巴尔', '乌尔波扎'].includes(amiibo.name);

	const quickFilters = $derived.by(() => {
		const countBy = (predicate: (amiibo: Amiibo) => boolean) => $amiibos.filter(predicate).length;

		return [
			{ key: 'all', label: '全部', count: totalCount },
			{ key: 'collected', label: '已收集', count: collectedCount },
			{ key: 'missing', label: '未收集', count: missingCount },
			{
				key: 'series:塞尔达传说：王国之泪',
				label: '王国之泪',
				count: countBy((amiibo) => amiibo.series === '塞尔达传说：王国之泪')
			},
			{
				key: 'series:塞尔达传说：旷野之息',
				label: '旷野之息',
				count: countBy((amiibo) => amiibo.series === '塞尔达传说：旷野之息')
			},
			{
				key: 'name:林克',
				label: '林克',
				count: countBy((amiibo) => amiibo.name.includes('林克'))
			},
			{
				key: 'name:塞尔达',
				label: '塞尔达',
				count: countBy((amiibo) => amiibo.name.includes('塞尔达'))
			},
			{
				key: 'group:champions',
				label: '英杰',
				count: countBy(isChampion)
			}
		];
	});

	const filteredAmiibos = $derived.by(() => {
		const normalizedQuery = query.trim().toLowerCase();

		return [...$amiibos]
			.filter((amiibo) => {
				if (activeFilter === 'collected') {
					return amiibo.collectedInfo?.collected;
				}

				if (activeFilter === 'missing') {
					return !amiibo.collectedInfo?.collected;
				}

				if (activeFilter.startsWith('series:')) {
					return amiibo.series === activeFilter.replace('series:', '');
				}

				if (activeFilter.startsWith('name:')) {
					return amiibo.name.includes(activeFilter.replace('name:', ''));
				}

				if (activeFilter === 'group:champions') {
					return isChampion(amiibo);
				}

				return activeFilter === 'all';
			})
			.filter((amiibo) => {
				if (!normalizedQuery) {
					return true;
				}

				return `${amiibo.name} ${amiibo.series}`.toLowerCase().includes(normalizedQuery);
			})
			.sort((a, b) => {
				if (sortBy === 'name') {
					return a.name.localeCompare(b.name, 'zh-Hans-CN');
				}

				if (sortBy === 'series') {
					return a.series.localeCompare(b.series, 'zh-Hans-CN');
				}

				return Date.parse(b.releaseDate) - Date.parse(a.releaseDate);
			});
	});

	const imgUrl = (amiibo: Amiibo) => `${AMIIBO_IMG_ENDPOINT}/${amiibo.images.toy}`;
</script>

<section class="museum-hero">
	<div class="museum-hero-copy">
		<p class="museum-eyebrow">Zelda Amiibo Collection</p>
		<div class="museum-wordmark-grid">
			<span class="wordmark-measure top">10X</span>
			<span class="wordmark-measure side">7X</span>
			<span class="wordmark-label baseline">BASE</span>
			<span class="wordmark-label capline">CAP</span>
			<span class="wordmark-circle circle-a"></span>
			<span class="wordmark-circle circle-b"></span>
			<h1>ZELDA AMIIBO COLLECTION</h1>
		</div>
		<div class="museum-hero-rule" aria-hidden="true"></div>
		<p class="museum-hero-text">
			从林克的冒险伙伴，到传说中的英雄与魔物，<br />
			收集所有塞尔达系列 Amiibo，点亮你的海拉鲁图鉴。
		</p>
	</div>

	<div class="museum-progress-card" aria-label="收藏进度">
		<span>收藏进度</span>
		<strong><b>已收集</b> <i>{collectedCount}</i> <small>/ {totalCount}</small></strong>
		<div class="museum-progress-track" style={`--progress: ${$collectedInfo.progressRate}%`}>
			<div class="museum-progress-fill" style={`width: ${$collectedInfo.progressRate}%`}></div>
		</div>
		<em>{$collectedInfo.progressRate}%</em>
	</div>
</section>

<section class="museum-panel" aria-label="Amiibo 收藏馆">
	<div class="museum-stats">
		<div>
			<img src="/images/stat-collected.png" alt="" aria-hidden="true" />
			<span>已收集</span>
			<strong>{collectedCount}</strong>
		</div>
		<div>
			<img src="/images/stat-missing.png" alt="" aria-hidden="true" />
			<span>未收集</span>
			<strong>{missingCount}</strong>
		</div>
		<div>
			<img src="/images/stat-series.png" alt="" aria-hidden="true" />
			<span>系列作品</span>
			<strong>{seriesCount}</strong>
		</div>
		<div>
			<img src="/images/stat-earliest.png" alt="" aria-hidden="true" />
			<span>最早发布</span>
			<strong>{earliestYear}</strong>
		</div>
	</div>

	<div class="museum-toolbar">
		<div class="museum-filter-row" aria-label="Amiibo 筛选">
			{#each quickFilters as item (item.key)}
				<button
					class:active={activeFilter === item.key}
					type="button"
					onclick={() => (activeFilter = item.key)}
				>
					{item.label} <small>{item.count}</small>
				</button>
			{/each}
		</div>

		<div class="museum-controls">
			<label class="museum-search">
				<span>搜索</span>
				<input bind:value={query} type="search" placeholder="搜索 Amiibo 名称..." />
			</label>

			<label>
				<span>排序</span>
				<select bind:value={sortBy}>
					<option value="release-desc">默认排序</option>
					<option value="name">名称</option>
					<option value="series">系列</option>
				</select>
			</label>

			<div class="museum-view-switch" aria-label="视图切换">
				<button
					class:active={viewMode === 'grid'}
					type="button"
					title="网格"
					onclick={() => (viewMode = 'grid')}
				>
					<img src="/images/ui/view-grid.png" alt="" aria-hidden="true" />
				</button>
				<button
					class:active={viewMode === 'list'}
					type="button"
					title="列表"
					onclick={() => (viewMode = 'list')}
				>
					☰
				</button>
			</div>
		</div>
	</div>

	<div class={viewMode === 'grid' ? 'museum-card-grid' : 'museum-card-list'}>
		{#each filteredAmiibos as amiibo (amiibo.id)}
			<article class:collected={amiibo.collectedInfo?.collected} class="museum-card" id={amiibo.id}>
				<a href={amiibo.detail} target="_blank" rel="noreferrer" aria-label={`${amiibo.name} 详情`}>
					<span class="museum-card-mark">{amiibo.collectedInfo?.collected ? '✓' : '◇'}</span>
					<div class="museum-card-image">
						<img src={imgUrl(amiibo)} alt={amiibo.name} />
					</div>
					<div class="museum-card-body">
						<h2>{amiibo.name}</h2>
						<p>{amiibo.series}</p>
						<span>发布日 {formatDate(amiibo.releaseDate)}</span>
						{#if amiibo.collectedInfo}
							<em
								>收集日 {formatDate(amiibo.collectedInfo.collectDate)} · ¥{amiibo.collectedInfo
									.price}</em
							>
						{/if}
					</div>
				</a>
			</article>
		{/each}
	</div>
</section>
