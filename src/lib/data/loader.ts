import zeldaAmiibos from './zelda-amiibo.json';

export const loadAmiibos = (): Amiibo[] => {
	return (zeldaAmiibos as Amiibo[]).sort(
		(a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate)
	);
};
