export type GameId = 'totk' | 'botw';

export interface AmiiboReward {
	rare: string[];
	common: string[];
	note?: string;
	status?: 'available' | 'announced';
}

export interface GameInfo {
	id: GameId;
	name: string;
	nameEn: string;
	year: string;
	short: string;
	description: string;
}

export const games: GameInfo[] = [
	{
		id: 'totk',
		name: '王国之泪',
		nameEn: 'TEARS OF THE KINGDOM',
		year: '2023',
		short: '天空 · 地表 · 地底',
		description: '重点查看限定滑翔帆布料、经典服装、武器与日常素材。'
	},
	{
		id: 'botw',
		name: '旷野之息',
		nameEn: 'BREATH OF THE WILD',
		year: '2017',
		short: '海拉鲁旷野',
		description: '重点查看 Amiibo 专属装备、特殊伙伴与可反复获取的素材。'
	}
];

const botwGeneric: AmiiboReward = {
	rare: [],
	common: ['随机食材', '基础素材'],
	note: '在《旷野之息》中按通用 Amiibo 处理，没有这款手办专属的装备。'
};

const rewards: Record<GameId, Record<string, AmiiboReward>> = {
	totk: {
		bokoblin: { rare: ['波克布林布料'], common: ['波克布林武器与盾', '波克布林的肝脏', '兽肉'] },
		daruk: { rare: ['鼓隆英杰布料', '神兽兵装·鲁达尼亚'], common: ['碎岩巨剑', '矿石'] },
		ganondorf: {
			rare: ['魔王布料', '黄昏之大剑'],
			common: ['格鲁德双手剑', '怪物素材', '兽肉', '矿石']
		},
		'ganondorf-tears-of-the-kingdom': {
			rare: ['格鲁德王布料'],
			common: ['瘴气之剑', '王族之剑', '兽肉']
		},
		guardian: { rare: ['古代希卡布料', '古代之刃'], common: ['生锈武器', '装有随机物品的铁箱'] },
		link: {
			rare: ['黄昏之镜布料', '伊波娜', '黄昏勇者套装'],
			common: ['骑士之剑', '士兵盾', '箭', '水果与植物']
		},
		'link-links-awakening': {
			rare: ['蛋纹布料', '织梦勇者套装'],
			common: ['士兵之剑', '箭', '装有随机物品的木桶']
		},
		'link-majoras-mask': {
			rare: ['姆吉拉的假面布料', '鬼神套装', '鬼神大剑'],
			common: ['骑士之剑', '蘑菇']
		},
		'link-ocarina-of-time': {
			rare: ['隆隆牧场布料', '时之勇者套装', '大鼓隆之剑'],
			common: ['士兵双手剑', '箭', '兽肉']
		},
		'link-skyward-sword': {
			rare: ['剑之精灵布料', '天空勇者套装', '白色女神剑'],
			common: ['骑士武器与盾', '随机木箱']
		},
		'link-tears-of-the-kingdom': { rare: ['英杰服布料'], common: ['骑士之剑', '蘑菇', '箭'] },
		'link-the-legend-of-zelda': {
			rare: ['像素布料', '初始勇者套装', '勇者之剑'],
			common: ['骑士武器与盾', '装有随机物品的木桶']
		},
		'link-twilight-princess': {
			rare: ['黄昏之镜布料', '伊波娜', '黄昏勇者套装'],
			common: ['骑士之剑', '士兵盾', '箭', '水果与植物']
		},
		'link-archer': { rare: ['回忆服布料', '古代之刃'], common: ['弓', '鱼', '兽肉', '箭'] },
		'link-rider': { rare: ['海利亚兜帽布料'], common: ['士兵之剑', '蘑菇'] },
		mipha: { rare: ['卓拉英杰布料', '神兽兵装·露塔'], common: ['卓拉之枪', '鱼'] },
		revali: { rare: ['利特英杰布料', '神兽兵装·梅德'], common: ['飞燕弓或游隼弓', '箭', '水果'] },
		riju: { rare: ['雷之贤者布料'], common: ['格鲁德匕首或盾', '兽肉'] },
		sheik: {
			rare: ['希克布料', '希克面罩'],
			common: ['戒心长刀', '心眼之盾', '一心之弓', '箭', '蘑菇']
		},
		sidon: { rare: ['水之贤者布料'], common: ['卓拉之枪', '鱼'] },
		'toon-link': {
			rare: ['赤狮子王布料', '风之勇者套装', '海风回旋镖'],
			common: ['海风盾', '回旋镖', '箭', '鱼']
		},
		'toon-link-the-wind-waker': {
			rare: ['赤狮子王布料', '风之勇者套装', '海风回旋镖'],
			common: ['海风盾', '回旋镖', '箭', '鱼']
		},
		tulin: { rare: ['风之贤者布料'], common: ['弓', '箭', '水果', '坚果'] },
		urbosa: {
			rare: ['格鲁德英杰布料', '神兽兵装·娜波力斯'],
			common: ['格鲁德武器与盾', '兽肉', '矿石']
		},
		'wolf-link': {
			rare: ['黄昏之镜布料'],
			common: ['兽肉'],
			note: '《王国之泪》中不会召唤狼林克伙伴。'
		},
		'young-link': {
			rare: ['隆隆牧场布料', '时之勇者套装', '大鼓隆之剑'],
			common: ['士兵双手剑', '箭', '兽肉']
		},
		yunobo: { rare: ['火之贤者布料'], common: ['劈石剑', '岩盐', '打火石', '琥珀或宝石'] },
		zelda: { rare: ['黄昏公主布料', '黄昏之弓'], common: ['士兵弓或骑士弓', '矿石', '草药'] },
		'zelda-breath-of-the-wild': {
			rare: ['海拉鲁公主布料'],
			common: ['骑士盾或士兵盾', '矿石', '草药']
		},
		'zelda-tears-of-the-kingdom': {
			rare: ['塞尔达公主布料'],
			common: ['士兵之剑', '蛋白石', '草药与蔬菜']
		},
		'zelda-the-wind-waker': {
			rare: ['昔日王室布料', '海风盾'],
			common: ['士兵盾或骑士盾', '植物与草药']
		},
		'zelda-and-loftwing': { rare: ['女神布料'], common: ['士兵弓或骑士弓', '草药', '蔬菜与植物'] },
		'minerus-construct': {
			rare: ['可在黑暗中部分发光的特殊滑翔帆布料'],
			common: ['有助冒险的随机物品（详细掉落尚未公布）'],
			note: '预计 2026 年 9 月 17 日发售；目前仅公布特殊布料与随机物品。',
			status: 'announced'
		}
	},
	botw: {
		bokoblin: { rare: [], common: ['波克布林武器与盾', '怪物素材', '兽肉'] },
		daruk: { rare: ['神兽兵装·鲁达尼亚'], common: ['碎岩巨剑', '鼓隆武器', '矿石'] },
		ganondorf: {
			rare: ['六贤者之剑'],
			common: ['骑士或王族双手剑', '格鲁德双手剑', '矿石', '怪物素材']
		},
		'ganondorf-tears-of-the-kingdom': {
			rare: ['六贤者之剑'],
			common: ['木桶与炸药桶', '骑士或王族双手剑', '矿石', '怪物素材']
		},
		guardian: {
			rare: ['古代箭', '古代核心', '巨大古代核心'],
			common: ['守护者武器与盾', '古代零件', '金属箱']
		},
		link: { rare: ['伊波娜', '黄昏勇者套装'], common: ['箭', '剑与盾', '水果'] },
		'link-links-awakening': { ...botwGeneric, common: ['鱼', '箭', '旅行者或士兵武器'] },
		'link-majoras-mask': { rare: ['鬼神套装', '鬼神大剑'], common: ['蘑菇', '箭', '剑'] },
		'link-ocarina-of-time': { rare: ['时之勇者套装', '大鼓隆之剑'], common: ['兽肉', '箭', '剑'] },
		'link-skyward-sword': {
			rare: ['天空勇者套装', '女神之白刃剑'],
			common: ['木箱', '箭', '武器与盾']
		},
		'link-tears-of-the-kingdom': {
			rare: [],
			common: ['鱼', '元素箭', '旅行者至王族武器'],
			note: '按通用林克掉落表处理，没有专属装备。'
		},
		'link-the-legend-of-zelda': {
			rare: ['初始勇者套装', '勇者之剑'],
			common: ['木桶', '卢比', '武器与盾']
		},
		'link-twilight-princess': {
			rare: ['伊波娜', '黄昏勇者套装'],
			common: ['箭', '剑与盾', '水果']
		},
		'link-archer': { rare: ['游隼弓'], common: ['鱼与兽肉', '元素箭', '弓'] },
		'link-rider': { rare: ['王族之剑'], common: ['蘑菇', '元素箭', '剑'] },
		mipha: { rare: ['神兽兵装·露塔'], common: ['卓拉之枪', '鱼'] },
		revali: { rare: ['神兽兵装·梅德'], common: ['飞燕弓或游隼弓', '箭', '水果'] },
		riju: botwGeneric,
		sheik: { rare: ['希克面罩'], common: ['戒心长刀', '心眼之盾', '元素箭', '蘑菇'] },
		sidon: botwGeneric,
		'toon-link': { rare: ['风之勇者套装', '海风回旋镖'], common: ['鱼', '回旋镖', '箭'] },
		'toon-link-the-wind-waker': {
			rare: ['风之勇者套装', '海风回旋镖'],
			common: ['鱼', '回旋镖', '箭']
		},
		tulin: botwGeneric,
		urbosa: { rare: ['神兽兵装·娜波力斯'], common: ['格鲁德武器与盾', '兽肉', '矿石'] },
		'wolf-link': {
			rare: ['召唤狼林克伙伴'],
			common: [],
			note: '狼林克会协助战斗与寻找物品；心数可继承自《黄昏公主 HD》。'
		},
		'young-link': {
			rare: [],
			common: ['鱼', '元素箭', '旅行者至王族武器'],
			note: '按通用林克掉落表处理，没有专属装备。'
		},
		yunobo: botwGeneric,
		zelda: { rare: ['黄昏之弓'], common: ['弓与盾', '矿石', '草药'] },
		'zelda-breath-of-the-wild': {
			rare: ['星星碎片', '钻石'],
			common: ['盾', '矿石', '草药与蔬菜']
		},
		'zelda-tears-of-the-kingdom': {
			rare: ['星星碎片', '钻石'],
			common: ['弓与盾', '矿石', '草药与蔬菜'],
			note: '按塞尔达掉落表处理，没有这款手办专属装备。'
		},
		'zelda-the-wind-waker': { rare: ['勇者盾'], common: ['盾', '矿石', '植物与草药'] },
		'zelda-and-loftwing': {
			rare: [],
			common: ['草药与植物', '兽肉'],
			note: '没有专属装备，宝箱主要为兽肉。'
		},
		'minerus-construct': {
			...botwGeneric,
			note: '预计 2026 年 9 月 17 日发售；任天堂仅确认可获得随机物品。',
			status: 'announced'
		}
	}
};

export const getAmiiboReward = (game: GameId, amiiboId: string): AmiiboReward =>
	rewards[game][amiiboId] ?? botwGeneric;

export const rewardSources = [
	{
		label: '任天堂：Amiibo 使用说明',
		href: 'https://en-americas-support.nintendo.com/app/answers/detail/a_id/61937/p/897/c/950'
	},
	{
		label: 'Zelda Wiki：《旷野之息》完整掉落表',
		href: 'https://zeldawiki.wiki/wiki/Amiibo_in_Breath_of_the_Wild'
	},
	{
		label: 'Thonky：《王国之泪》奖励清单',
		href: 'https://www.thonky.com/zelda-tears-of-the-kingdom/amiibo-rewards-and-unlocks'
	},
	{
		label: 'Nintendo Life：贤者与最新 Amiibo 奖励',
		href: 'https://www.nintendolife.com/guides/zelda-tears-of-the-kingdom-all-amiibo-unlocks'
	}
];
