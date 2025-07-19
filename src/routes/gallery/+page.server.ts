import { loadAmiibos } from '$lib/data/loader';
import { CONFIG } from '$lib/config';

const { AMIIBO_IMG_ENDPOINT } = CONFIG;

export const load = () => {
	const amiibos = loadAmiibos();
	const toys = amiibos.map(amiibo => ({
		alt: amiibo.name,
		src: `${AMIIBO_IMG_ENDPOINT}/${amiibo.images.toy}`
	}));
	const boxes = amiibos.map(amiibo => ({
		alt: amiibo.name,
		src: `${AMIIBO_IMG_ENDPOINT}/${amiibo.images.box}`
	}));
	return {
		toys,
		boxes,
		title: "塞尔达Amiibo展示"
	}
}