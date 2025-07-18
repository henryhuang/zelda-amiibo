import { loadAmiibos } from '$lib/data/loader';

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
		title: "塞尔达Amiibo收集"
	}
}