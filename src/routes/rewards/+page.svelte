<script lang="ts">
	import { tick } from 'svelte';
	import { amiibos } from '../../store';
	import { CONFIG } from '$lib/config';
	import {
		games,
		getAmiiboReward,
		rewardSources,
		type GameId,
		type GameInfo
	} from '$lib/data/amiibo-rewards';

	const { AMIIBO_IMG_ENDPOINT } = CONFIG;
	let selectedGame = $state<GameId | null>(null);
	let selectedId = $state<string | null>(null);
	let query = $state('');
	let detailPanel = $state<HTMLElement>();

	const currentGame = $derived(games.find((game) => game.id === selectedGame));
	const selectedAmiibo = $derived($amiibos.find((amiibo) => amiibo.id === selectedId));
	const selectedReward = $derived(
		selectedGame && selectedId ? getAmiiboReward(selectedGame, selectedId) : null
	);
	const filteredAmiibos = $derived(
		$amiibos.filter((amiibo) => {
			const needle = query.trim().toLowerCase();
			return !needle || `${amiibo.name} ${amiibo.nameEn ?? ''}`.toLowerCase().includes(needle);
		})
	);

	const imageUrl = (amiibo: Amiibo) => `${AMIIBO_IMG_ENDPOINT}/${amiibo.images.toy}`;
	const chooseGame = (game: GameInfo) => {
		selectedGame = game.id;
		selectedId = null;
		query = '';
	};
	const chooseAmiibo = async (id: string) => {
		selectedId = id;
		await tick();
		if (window.matchMedia('(max-width: 1050px)').matches)
			detailPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};
</script>

<svelte:head
	><meta
		name="description"
		content="查看每一款塞尔达 Amiibo 在《王国之泪》和《旷野之息》中可刷出的物品与限定奖励。"
	/></svelte:head
>

<section class="rewards-page" aria-labelledby="rewards-title">
	{#if !selectedGame}
		<header class="rewards-landing-copy">
			<p class="rewards-kicker">AMIIBO FIELD GUIDE · 游戏掉落图鉴</p>
			<h1 id="rewards-title">今天要在哪片海拉鲁<br />召唤 Amiibo？</h1>
			<p>先选择游戏，再查看每一款 Amiibo 能刷出的限定奖励、装备和常见素材。</p>
		</header>
		<div class="game-choice-grid" aria-label="选择游戏">
			{#each games as game}
				<button
					class:totk={game.id === 'totk'}
					class:botw={game.id === 'botw'}
					onclick={() => chooseGame(game)}
				>
					<span class="game-choice-year">{game.year}</span><span
						class="game-choice-mark"
						aria-hidden="true">{game.id === 'totk' ? '✦' : '△'}</span
					>
					<small>{game.nameEn}</small><strong>{game.name}</strong><em>{game.short}</em>
					<p>{game.description}</p>
					<span class="game-choice-action">进入图鉴 <b>→</b></span>
				</button>
			{/each}
		</div>
		<p class="rewards-scan-note">
			<span>i</span> 每一只 Amiibo 通常每天可扫描一次，稀有物品不保证首次出现。
		</p>
	{:else if currentGame}
		<header class="rewards-browser-header">
			<div>
				<button class="rewards-back" onclick={() => (selectedGame = null)}>← 重新选择游戏</button>
				<p class="rewards-kicker">{currentGame.nameEn} · {currentGame.year}</p>
				<h1 id="rewards-title">{currentGame.name}掉落图鉴</h1>
				<p>共 {$amiibos.length} 款 Amiibo。点击任意角色查看可刷出的物品。</p>
			</div>
			<div class="game-switcher" aria-label="切换游戏">
				{#each games as game}<button
						class:active={selectedGame === game.id}
						onclick={() => chooseGame(game)}>{game.name}</button
					>{/each}
			</div>
		</header>
		<div class="rewards-browser">
			<div class="rewards-catalog">
				<label class="rewards-search"
					><span aria-hidden="true">⌕</span><input
						bind:value={query}
						type="search"
						placeholder="搜索 Amiibo 名称"
						aria-label="搜索 Amiibo 名称"
					/><small>{filteredAmiibos.length} / {$amiibos.length}</small></label
				>
				<div class="rewards-card-grid">
					{#each filteredAmiibos as amiibo}
						{@const reward = getAmiiboReward(selectedGame, amiibo.id)}
						<button
							class="reward-amiibo-card"
							class:selected={selectedId === amiibo.id}
							onclick={() => chooseAmiibo(amiibo.id)}
							aria-pressed={selectedId === amiibo.id}
						>
							<span class="reward-amiibo-image"
								><img src={imageUrl(amiibo)} alt="" loading="lazy" /></span
							>
							<span class="reward-amiibo-copy"
								><strong>{amiibo.name}</strong><small>{amiibo.nameEn}</small
								>{#if reward.status === 'announced'}<em>尚未发售</em
									>{:else if reward.rare.length}<em>{reward.rare.length} 类稀有奖励</em>{:else}<em
										>通用掉落</em
									>{/if}</span
							>
							<span class="reward-card-arrow" aria-hidden="true">›</span>
						</button>
					{/each}
				</div>
			</div>
			<aside class="reward-detail" bind:this={detailPanel} aria-live="polite">
				{#if selectedAmiibo && selectedReward}
					<div class="reward-detail-visual">
						<span>{currentGame.name}</span><img
							src={imageUrl(selectedAmiibo)}
							alt={selectedAmiibo.name}
						/>
					</div>
					<div class="reward-detail-copy">
						<p>{selectedAmiibo.series}</p>
						<h2>{selectedAmiibo.name}</h2>
						<small>{selectedAmiibo.nameEn}</small>
						{#if selectedReward.status === 'announced'}<div class="reward-announced">
								预告资料 · 2026.09.17 发售
							</div>{/if}
						{#if selectedReward.rare.length}<section class="reward-group rare">
								<h3><span>✦</span> 稀有 / 特殊奖励</h3>
								<ul>
									{#each selectedReward.rare as item}<li>{item}</li>{/each}
								</ul>
							</section>{/if}
						{#if selectedReward.common.length}<section class="reward-group common">
								<h3><span>▦</span> 常见掉落</h3>
								<ul>
									{#each selectedReward.common as item}<li>{item}</li>{/each}
								</ul>
							</section>{/if}
						{#if selectedReward.note}<p class="reward-note">
								<b>提示</b>{selectedReward.note}
							</p>{/if}
						<p class="reward-randomness">
							实际内容会受游戏进度与随机掉落影响；稀有奖励可能需要连续多日扫描。
						</p>
					</div>
				{:else}<div class="reward-detail-empty">
						<span aria-hidden="true">⌁</span>
						<h2>选择一款 Amiibo</h2>
						<p>它能带回什么，会在这里一目了然。</p>
					</div>{/if}
			</aside>
		</div>
		<footer class="reward-sources">
			<strong>资料来源</strong>
			<p>奖励名称已整理为便于查询的中文概览；完整概率与版本差异请查阅：</p>
			<div>
				{#each rewardSources as source}<a href={source.href} target="_blank" rel="noreferrer"
						>{source.label} ↗</a
					>{/each}
			</div>
		</footer>
	{/if}
</section>
