import { writable } from 'svelte/store';

export const collectedInfo = writable<CollectedInfo>({
	progressRate: 0,
	collectedNum: 0,
	totalNum: 0,
	cost: 0
});