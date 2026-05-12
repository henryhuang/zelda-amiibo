import zeldaAmiibos from './zelda-amiibo.json';

const REMOTE_AMIIBO_DATA_URL = 'https://susu-img-wx.cnhalo.com/zelda-amiibo.json';
const REMOTE_AMIIBO_TIMEOUT_MS = 8000;

const sortAmiibos = (amiibos: Amiibo[]): Amiibo[] => {
	return [...amiibos].sort((a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate));
};

const isAmiibo = (value: unknown): value is Amiibo => {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const candidate = value as Partial<Amiibo>;
	return (
		typeof candidate.id === 'string' &&
		typeof candidate.name === 'string' &&
		typeof candidate.series === 'string' &&
		typeof candidate.releaseDate === 'string' &&
		typeof candidate.detail === 'string' &&
		typeof candidate.images?.toy === 'string' &&
		typeof candidate.images?.box === 'string'
	);
};

const isAmiiboList = (value: unknown): value is Amiibo[] => {
	return Array.isArray(value) && value.every(isAmiibo);
};

export const loadAmiibos = (): Amiibo[] => {
	const parsed = zeldaAmiibos as unknown;
	if (!isAmiiboList(parsed)) {
		throw new Error('Bundled amiibo data has an invalid shape');
	}
	return sortAmiibos(parsed);
};

export const loadAmiibosWithFallback = async (
	fetcher: typeof fetch = fetch
): Promise<Amiibo[]> => {
	try {
		return loadAmiibos();
	} catch {
		console.warn('Falling back to remote amiibo data.');
	}

	const abortController = new AbortController();
	const timeout = setTimeout(() => abortController.abort(), REMOTE_AMIIBO_TIMEOUT_MS);

	try {
		const response = await fetcher(REMOTE_AMIIBO_DATA_URL, {
			signal: abortController.signal
		});
		if (!response.ok) {
			throw new Error(`Remote amiibo data request failed: ${response.status}`);
		}

		const remoteAmiibos: unknown = await response.json();
		if (!isAmiiboList(remoteAmiibos)) {
			throw new Error('Remote amiibo data has an invalid shape');
		}

		return sortAmiibos(remoteAmiibos);
	} finally {
		clearTimeout(timeout);
	}
};
