<script lang="ts">
	import { amiibos, collectedInfo, series } from '../../store';
	import { CONFIG } from '$lib/config';
	import { formatDate } from '$lib/utils/commonUtil';

	interface Props {
		initialStatus?: 'all' | 'collected' | 'missing';
		initialView?: 'grid' | 'list';
	}

	interface ProgressBackdropItem {
		amiibo: Amiibo;
		size: string;
		offsetX: string;
		offsetY: string;
		rotation: string;
		scale: number;
		opacity: number;
	}

	let { initialStatus = 'all', initialView = 'grid' }: Props = $props();

	let activeFilter = $state<string>(initialStatus);
	let query = $state('');
	let sortBy = $state('release-desc');
	let viewMode = $state(initialView);
	let progressBackdropItems = $state<ProgressBackdropItem[]>([]);
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
		return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
	});
	const pendingCount = $derived($amiibos.filter(amiibo => amiibo.releaseDate > todayStr).length);
	const collectedAmiibos = $derived($amiibos.filter((amiibo) => amiibo.collectedInfo?.collected));
	const backdropColumns = $derived(Math.max(1, Math.ceil(Math.sqrt(collectedAmiibos.length || 1))));
	const backdropRows = $derived(Math.max(1, Math.ceil((collectedAmiibos.length || 1) / backdropColumns)));
	const latestCollectedDate = $derived.by(() => {
		const dates = $amiibos
			.map((amiibo) => amiibo.collectedInfo?.collectDate)
			.filter((date): date is string => Boolean(date))
			.sort((a, b) => Date.parse(b.replaceAll('.', '-')) - Date.parse(a.replaceAll('.', '-')));
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

				return Date.parse(b.releaseDate) - Date.parse(a.releaseDate);
			});
	});

	const imgUrl = (amiibo: Amiibo) => `${AMIIBO_IMG_ENDPOINT}/${amiibo.images.toy}`;

	const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

	const shuffle = <T,>(items: T[]): T[] => {
		const shuffled = [...items];
		for (let index = shuffled.length - 1; index > 0; index -= 1) {
			const swapIndex = Math.floor(Math.random() * (index + 1));
			[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
		}
		return shuffled;
	};

	const randomizeProgressBackdrop = (items: Amiibo[]) => {
		progressBackdropItems = shuffle(items).map((amiibo) => ({
			amiibo,
			size: `${randomBetween(118, 172).toFixed(1)}px`,
			offsetX: `${randomBetween(-18, 18).toFixed(1)}%`,
			offsetY: `${randomBetween(-16, 16).toFixed(1)}%`,
			rotation: `${randomBetween(-10, 10).toFixed(1)}deg`,
			scale: Number(randomBetween(0.96, 1.24).toFixed(2)),
			opacity: Number(randomBetween(0.7, 1).toFixed(2))
		}));
	};

	$effect(() => {
		randomizeProgressBackdrop(collectedAmiibos);
	});
</script>

<section class="museum-hero">
	<div class="museum-hero-copy"></div>

	<div class="museum-progress-card" aria-label="收藏进度" role="button" tabindex="0" onclick={() => document.getElementById('museum-panel')?.scrollIntoView({ behavior: 'smooth' })} onkeydown={(e) => { if (e.key === 'Enter') { document.getElementById('museum-panel')?.scrollIntoView({ behavior: 'smooth' }); } }}>
		<div
			class="museum-progress-backdrop"
			style={`--backdrop-columns: ${backdropColumns}; --backdrop-rows: ${backdropRows}`}
			aria-hidden="true"
		>
			{#each progressBackdropItems as item (item.amiibo.id)}
				<img
					src={imgUrl(item.amiibo)}
					alt=""
					style={`--backdrop-size: ${item.size}; --backdrop-x: ${item.offsetX}; --backdrop-y: ${item.offsetY}; --backdrop-rotation: ${item.rotation}; --backdrop-scale: ${item.scale}; --backdrop-opacity: ${item.opacity}`}
				/>
			{/each}
		</div>
		<span>收藏进度</span>
		<strong><b>已收集</b> <i>{collectedCount}</i> <small>/ {totalCount}</small></strong>
		<div class="museum-progress-track" style={`--progress: ${$collectedInfo.progressRate}%`}>
			<div class="museum-progress-fill" style={`width: ${$collectedInfo.progressRate}%`}></div>
		</div>
		<em>{$collectedInfo.progressRate}%</em>
	</div>
</section>

<section class="museum-panel" id="museum-panel" aria-label="Amiibo 收藏馆">
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
			<span>待发布</span>
			<strong>{pendingCount}</strong>
		</div>
		<div>
			<img src="/images/stat-earliest.png" alt="" aria-hidden="true" />
			<span>最后收集</span>
			<strong>{latestCollectedDate}</strong>
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
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
				<article class:collected={amiibo.collectedInfo?.collected} class:flipped={flippedCards.get(amiibo.id)} class="museum-card" id={amiibo.id} onclick={() => toggleFlip(amiibo.id)} onkeydown={(e) => { if (e.key === 'Enter') toggleFlip(amiibo.id); }} role="button" tabindex="0">
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
								<em>收集日 {formatDate(amiibo.collectedInfo.collectDate)} · ¥{amiibo.collectedInfo.price}</em>
							{/if}
							<a href={amiibo.detail} target="_blank" rel="noreferrer" class="museum-detail-link" onclick={(e) => e.stopPropagation()}>Amiibo 详情 ↗</a>
						</div>
					</div>
				</article>
		{/each}
	</div>
</section>
