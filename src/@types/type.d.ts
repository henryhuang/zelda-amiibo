interface Account {
	id: string;
	type: string;
	title: string;
	billDate: number;
	repaymentDate:	RepaymentDate;
	method:	string;
	notes?: string;
	avatar: string;
}

interface RepaymentDate {
	type: "IMMUTABLE" | "CALCULATED";
}

interface SwipingCard {
	id: string;
	account: Account;
	amount: number;
	checked: boolean;
}

interface SwipingPageData {
	id: number;
	baseAmount: number;
	rate: number;
	swipings: SwipingCard[];
}

interface SwipingDetails {
	fee: number;
	expectedArriveAmount: number;
	swipedAmount: number;
	swipingCardNum: number;
	swipedCardNum: number;
}

interface Amiibo {
	id: string;
	name: string;
	series: string;
	releaseDate: string;
	images: {
		toy: string;
		box: string;
	},
	collected?: boolean;
	collectDate?: string;
	price?: number;
}

interface AmiiboSearchCriteria {
	showCollectedOnly: boolean;
	newestFirst: boolean;
}