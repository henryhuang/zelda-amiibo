import { loadAmiibos } from '$lib/data/loader';

export const load = () => {
	return {
		amiibos: loadAmiibos(),
		title: "塞尔达Amiibo收集"
	}
}