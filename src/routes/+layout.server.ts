import { loadAmiibosWithFallback } from '$lib/data/loader';
import { CONFIG } from '$lib/config';

export const prerender = true;

const { AMIIBO_IMG_ENDPOINT } = CONFIG;

export const load = async ({ fetch }) => {
	const amiibos = await loadAmiibosWithFallback(fetch);
	const seriesInfoMap: { [name: string]: SeriesCollectingInfo } = {};
	amiibos.forEach((amiibo) => {
		const series = amiibo.series;
		let infoMap = seriesInfoMap[series];
		if (!infoMap) {
			infoMap = {
				name: series,
				total: 0,
				collected: 0
			};
			seriesInfoMap[series] = infoMap;
		}
		Object.assign(infoMap, {
			total: infoMap.total + 1,
			collected: infoMap.collected + (amiibo.status === 'collected' ? 1 : 0)
		});
	});
	return {
		amiibos,
		series: Object.values(seriesInfoMap),
		imgEndpoint: `${AMIIBO_IMG_ENDPOINT}`
	};
};
