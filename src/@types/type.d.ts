interface Amiibo {
	id: string;
	name: string;
	series: string;
	releaseDate: string;
	images: {
		toy: string;
		box: string;
	},
	collectedInfo?: AmiiboCollectedInfo;
	detail: string;
}

interface AmiiboCollectedInfo {
	collected: boolean;
	collectDate: string;
	price: number;
}

interface AmiiboSearchCriteria {
	showCollectedOnly: boolean;
	newestFirst: boolean;
	series: string;
}

interface CollectedInfo {
	progressRate: number;
	collectedNum: number;
	totalNum: number;
	cost: number;
}

interface MenuSetting {
	backup: boolean,
	collecting: boolean,
	progress: boolean,
	gallery: boolean
}

interface Image {
	src: string,
	alt: string
}

interface Gallery {
	toys: Image[],
	boxes: Image[]
}