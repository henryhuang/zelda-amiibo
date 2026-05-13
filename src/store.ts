import { writable } from 'svelte/store';

export const collectedInfo = writable<CollectedInfo>({
	progressRate: 0,
	collectedNum: 0,
	totalNum: 0,
	cost: 0
});

export const amiibos = writable<Amiibo[]>([]);

export const series = writable<SeriesCollectingInfo[]>([]);

export const gallery = writable<Gallery>({
	toys: [],
	boxes: []
});

export const initStore = (
	collectedInfoInited: CollectedInfo,
	amiibosInited: Amiibo[],
	seriesInited: SeriesCollectingInfo[],
	imgEndpoint: string
) => {
	collectedInfo.set(collectedInfoInited);
	amiibos.set(amiibosInited);
	series.set(seriesInited);
	const toys = amiibosInited.map(amiibo => ({
		id: amiibo.id,
		alt: amiibo.name,
			nameEn: amiibo.nameEn,
		src: `${imgEndpoint}/${amiibo.images.toy}`,
		collected: amiibo?.collectedInfo?.collected
	}));
	const boxes = amiibosInited.map(amiibo => ({
		id: amiibo.id,
		alt: amiibo.name,
			nameEn: amiibo.nameEn,
		src: `${imgEndpoint}/${amiibo.images.box}`,
		collected: amiibo?.collectedInfo?.collected
	}));
	gallery.set({
		toys,
		boxes
	})
};
