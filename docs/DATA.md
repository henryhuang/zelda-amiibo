# 数据维护指南

## 数据文件

Amiibo 数据维护在：

```text
src/lib/data/zelda-amiibo.json
```

这是项目的核心数据源。页面中的图库、收集卡片、系列筛选、进度统计和备份数据都基于该文件生成。

## Amiibo 字段

每个 Amiibo 对象结构如下：

```json
{
	"id": "bokoblin",
	"name": "波克布林",
	"series": "塞尔达传说：旷野之息",
	"releaseDate": "2017.03.07",
	"images": {
		"toy": "bokoblin-1.jpeg",
		"box": "bokoblin-2.jpeg"
	},
	"status": "in_transit",
	"detail": "https://www.nintendo.com/us/amiibo/detail/bokoblin-amiibo-the-legend-of-zelda-series/"
}
```

| 字段            | 必填 | 说明                                                       |
| --------------- | ---- | ---------------------------------------------------------- |
| `id`            | 是   | 页面锚点和跳转定位使用，建议使用稳定的小写英文短横线或单词 |
| `name`          | 是   | 页面展示名称                                               |
| `series`        | 是   | 系列名称，会用于系列筛选和统计                             |
| `releaseDate`   | 是   | 发布日期，格式为 `YYYY.MM.DD`                              |
| `images.toy`    | 是   | Amiibo 本体图片文件名                                      |
| `images.box`    | 是   | Amiibo 盒装图片文件名                                      |
| `detail`        | 是   | 外部详情链接                                               |
| `status`        | 否   | 附加状态，目前支持 `in_transit`，表示在途                  |
| `collectedInfo` | 否   | 收藏信息，存在时表示有收藏记录                             |

`status: "in_transit"` 表示 Amiibo 已经在途，但它仍然属于未收集；只有存在 `collectedInfo.collected: true` 时才计入已收集。

## 收藏信息字段

已收集 Amiibo 可增加 `collectedInfo`：

```json
{
	"collectedInfo": {
		"collected": true,
		"collectDate": "2026.04.29",
		"price": 99.9
	}
}
```

| 字段          | 说明                                           |
| ------------- | ---------------------------------------------- |
| `collected`   | 是否已收集，当前代码按 `true` 统计系列已收集数 |
| `collectDate` | 收集日期，格式为 `YYYY.MM.DD`                  |
| `price`       | 入手价格，用于累计花费统计                     |

## 图片地址规则

页面不会直接从仓库读取 Amiibo 图片，而是使用环境变量拼接图片地址：

```text
${VITE_AMIIBO_IMG_ENDPOINT}/${images.toy}
${VITE_AMIIBO_IMG_ENDPOINT}/${images.box}
```

例如：

```bash
VITE_AMIIBO_IMG_ENDPOINT=https://static.example.com/amiibo
```

当 `images.toy` 为 `bokoblin-1.jpeg` 时，最终地址为：

```text
https://static.example.com/amiibo/bokoblin-1.jpeg
```

## 新增 Amiibo 流程

1. 将图片上传到 `VITE_AMIIBO_IMG_ENDPOINT` 对应的图片存储位置。
2. 在 `src/lib/data/zelda-amiibo.json` 添加一个 Amiibo 对象。
3. 确认 `id` 唯一。
4. 使用 `YYYY.MM.DD` 格式填写 `releaseDate`。
5. 如已收藏，补充 `collectedInfo`。
6. 运行检查命令：

```bash
npm run check
npm run build
```

## 修改收藏状态

### 标记为已收集

给对应 Amiibo 添加：

```json
"collectedInfo": {
  "collected": true,
  "collectDate": "2026.04.29",
  "price": 99.9
}
```

### 标记为未收集

删除对应 Amiibo 的 `collectedInfo` 字段。

### 标记为在途

在未收集 Amiibo 上增加：

```json
"status": "in_transit"
```

在途 Amiibo 不应同时添加 `collectedInfo`。

## 当前系列统计

当前数据包含 33 个 Amiibo，按系列分布如下：

| 系列                  | 数量 |
| --------------------- | ---: |
| Breath of the Wild    |    9 |
| Super Smash Bros.     |    6 |
| Tears of the Kingdom  |    8 |
| The Legend of Zelda   |    6 |
| 30th Anniversary      |    4 |

## 数据约定

- `releaseDate` 和 `collectDate` 保持 `YYYY.MM.DD`。
- `price` 使用数字，不要写成字符串。
- 同一系列名称必须完全一致，否则会被统计为不同系列。
- `id` 会用于 DOM `id` 和 URL hash，修改已有 `id` 会影响历史链接。
- 外部详情链接建议使用 Nintendo 官方 Amiibo 页面。
