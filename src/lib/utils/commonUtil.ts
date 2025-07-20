import moment from 'moment';

export const buildSwipingCards = (baseAmount: number, accounts: Account[]) => {
	const swipingCards: SwipingCard[] = [];
	let index = 1;
	accounts.forEach((account) => {
		const amount = baseAmount + index * 0.01;
		swipingCards.push({
			id: account.id,
			amount,
			account,
			checked: false
		});
		index++;
	});
	return swipingCards;
};

export const fixTwoDecimals = (raw: number) => {
	return Math.round(raw * 100) / 100;
}

export const formatDate = (rawStr?: string) => {
	if(!rawStr) {
		return "";
	}
	const m = moment(rawStr, "YYYY.MM.DD");
	return `${m.format("YYYY年M月D日")}`;
}