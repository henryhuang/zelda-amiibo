<script lang="ts">
	import { onMount } from 'svelte';
	import { amiibos, collectedInfo, series } from '../../store';
	import { CONFIG } from '$lib/config';
	import { formatDate } from '$lib/utils/commonUtil';
	import HeroHeader from './HeroHeader.svelte';

	interface Props {
		initialStatus?: 'all' | 'collected' | 'missing';
		initialView?: 'grid' | 'list';
	}

	let { initialStatus = 'all', initialView = 'grid' }: Props = $props();

	type SortOption = 'release-desc' | 'collect-desc' | 'name' | 'series';

	const mobileMediaQuery = '(max-width: 900px)';
	const getTimestamp = (date?: string) => (date ? Date.parse(date.replaceAll('.', '-')) : 0);

	let activeFilter = $state<string>(initialStatus);
	let query = $state('');
	let sortBy = $state<SortOption>('release-desc');
	let viewMode = $state<'grid' | 'list'>(initialView);
	let flippedCards = $state(new Map<string, boolean>());

	const toggleFlip = (id: string) => {
		const current = flippedCards.get(id) ?? false;
		flippedCards.set(id, !current);
		flippedCards = new Map(flippedCards);
	};

	const isSage = (amiibo: Amiibo) =>
		['露珠', '希多', '丘栗', '阿沅', '米涅鲁魔像'].includes(amiibo.name);

	const { AMIIBO_IMG_ENDPOINT } = CONFIG;

	const collectedCount = $derived($collectedInfo.collectedNum);
	const totalCount = $derived($collectedInfo.totalNum);
	const missingCount = $derived(Math.max(totalCount - collectedCount, 0));
	const todayStr = $derived.by(() => {
		const d = new Date();
		return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
	});
	const pendingCount = $derived($amiibos.filter((amiibo) => amiibo.releaseDate > todayStr).length);
	const collectedAmiibos = $derived($amiibos.filter((amiibo) => amiibo.collectedInfo?.collected));
	const latestCollectedDate = $derived.by(() => {
		const dates = $amiibos
			.map((amiibo) => amiibo.collectedInfo?.collectDate)
			.filter((date): date is string => Boolean(date))
			.sort((a, b) => getTimestamp(b) - getTimestamp(a));
		return dates[0] ?? '';
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
				key: 'series:Tears of the Kingdom',
				label: '王国之泪',
				count: countBy((amiibo) => amiibo.series === 'Tears of the Kingdom')
			},
			{
				key: 'series:Breath of the Wild',
				label: '旷野之息',
				count: countBy((amiibo) => amiibo.series === 'Breath of the Wild')
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
			},
			{
				key: 'group:sages',
				label: '贤者',
				count: countBy(isSage)
			},
			{
				key: 'series:Super Smash Bros.',
				label: '大乱斗',
				count: countBy((amiibo) => amiibo.series === 'Super Smash Bros.')
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

				if (activeFilter === 'group:sages') {
					return isSage(amiibo);
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

				if (sortBy === 'collect-desc') {
					return (
						getTimestamp(b.collectedInfo?.collectDate) - getTimestamp(a.collectedInfo?.collectDate)
					);
				}

				return getTimestamp(b.releaseDate) - getTimestamp(a.releaseDate);
			});
	});

	const imgUrl = (amiibo: Amiibo) => `${AMIIBO_IMG_ENDPOINT}/${amiibo.images.toy}`;

	onMount(() => {
		if (initialView === 'grid' && window.matchMedia(mobileMediaQuery).matches) {
			viewMode = 'list';
		}
	});
</script>

<section class="museum-hero">
	<HeroHeader
		{totalCount}
		{collectedCount}
		{missingCount}
		{pendingCount}
		seriesCount={$series.length}
		{latestCollectedDate}
		progressRate={$collectedInfo.progressRate}
		{collectedAmiibos}
	/>
</section>

<section class="museum-panel" id="museum-panel" aria-label="Amiibo 收藏馆">
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
					<option value="collect-desc">收集时间</option>
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
			{#if viewMode === 'grid'}
				<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
				<article
					class:collected={amiibo.collectedInfo?.collected}
					class:flipped={flippedCards.get(amiibo.id)}
					class="museum-card"
					id={amiibo.id}
					onclick={() => toggleFlip(amiibo.id)}
					onkeydown={(e) => {
						if (e.key === 'Enter') toggleFlip(amiibo.id);
					}}
					role="button"
					tabindex="0"
				>
					<div class="museum-card-inner">
						<div class="museum-card-front">
							<span class="museum-card-mark">{amiibo.collectedInfo?.collected ? '✓' : '◇'}</span>
							<div class="museum-card-image">
								<img src={imgUrl(amiibo)} alt={amiibo.name} />
							</div>
							<div class="museum-card-body">
								<h2>{amiibo.name}</h2>
								{#if amiibo.nameEn}
									<span class="museum-card-nameen">（{amiibo.nameEn}）</span>
								{/if}
							</div>
						</div>
						<div class="museum-card-back">
							<p>{amiibo.description}</p>
							<p>{amiibo.series}</p>
							<span>发布日 {formatDate(amiibo.releaseDate)}</span>
							{#if amiibo.collectedInfo}
								<em
									>收集日 {formatDate(amiibo.collectedInfo.collectDate)} · ¥{amiibo.collectedInfo
										.price}</em
								>
							{/if}
							<a
								href={amiibo.detail}
								target="_blank"
								rel="noreferrer"
								class="museum-detail-link"
								onclick={(e) => e.stopPropagation()}>Amiibo 详情 ↗</a
							>
						</div>
					</div>
				</article>
			{:else}
				<article
					class:collected={amiibo.collectedInfo?.collected}
					class="museum-card"
					id={amiibo.id}
				>
					<div class="museum-card-inner">
						<div class="museum-card-front">
							<span class="museum-card-mark">{amiibo.collectedInfo?.collected ? '✓' : '◇'}</span>
							<div class="museum-card-image">
								<img src={imgUrl(amiibo)} alt={amiibo.name} />
							</div>
							<div class="museum-card-body">
								<h2>{amiibo.name}</h2>
								{#if amiibo.nameEn}
									<span class="museum-card-nameen">（{amiibo.nameEn}）</span>
								{/if}
								<p>{amiibo.description}</p>
								<p>{amiibo.series}</p>
								<span>发布日 {formatDate(amiibo.releaseDate)}</span>
								{#if amiibo.collectedInfo}
									<em
										>收集日 {formatDate(amiibo.collectedInfo.collectDate)} · ¥{amiibo.collectedInfo
											.price}</em
									>
								{/if}
								<a
									href={amiibo.detail}
									target="_blank"
									rel="noreferrer"
									class="museum-detail-link"
									onclick={(e) => e.stopPropagation()}>Amiibo 详情 ↗</a
								>
							</div>
						</div>
					</div>
				</article>
			{/if}
		{/each}
	</div>
</section>
