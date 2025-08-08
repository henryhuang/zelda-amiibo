import { loadAmiibos } from '$lib/data/loader';
import { CONFIG } from '$lib/config';

const { AMIIBO_IMG_ENDPOINT } = CONFIG;

export const load = () => {
	const amiibos = loadAmiibos();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	const series: string[] = amiibos.reduce((acc, amiibo) => {
		const ss = acc as string[];
		if (!ss.includes(amiibo.series)) {
			ss.push(amiibo.series);
		}
		return ss;
	}, []);
	return {
		amiibos,
		series,
		imgEndpoint: `${AMIIBO_IMG_ENDPOINT}`
	}
}