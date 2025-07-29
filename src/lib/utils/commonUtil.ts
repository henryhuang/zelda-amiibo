import moment from 'moment';
import { loadAmiibos } from '$lib/data/loader';

export const fixTwoDecimals = (raw: number) => {
	return Math.round(raw * 100) / 100;
};

export const formatDate = (rawStr?: string) => {
	if (!rawStr) {
		return '';
	}
	const m = moment(rawStr, 'YYYY.MM.DD');
	return `${m.format('YYYY年M月D日')}`;
};

export const downloadBackup = (collectedInfo: CollectedInfo) => {
	const amiibos = loadAmiibos();
	const date = new Date();
	const text = JSON.stringify(
		{
			time: date,
			...collectedInfo,
			data: amiibos
		},
		null,
		2
	);

	const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = `backup_${moment().format('YYYY-MM-DD')}.json`;
	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

export const generateHash = (string: string) => {
	let hash = 0;
	for (const char of string) {
		hash = (hash << 5) - hash + char.charCodeAt(0);
		hash |= 0; // Constrain to 32bit integer
	}
	return hash;
};