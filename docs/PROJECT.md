# 项目说明

## 项目定位

`zelda-amiibo` 是一个塞尔达 Amiibo 收藏展示站点。它以本地 JSON 数据为事实来源，构建静态页面展示 Amiibo 图库、收藏状态、收藏进度和花费统计。

当前数据集中包含 33 个 Amiibo，其中 12 个带有收藏信息，累计花费为 879.49。

## 页面结构

| 路径          | 文件                                 | 作用                                                 |
| ------------- | ------------------------------------ | ---------------------------------------------------- |
| `/`           | `src/routes/+page.svelte`            | 首页，展示 Amiibo 图库，点击图片跳转到收集页对应卡片 |
| `/collecting` | `src/routes/collecting/+page.svelte` | 收集页，展示进度条、筛选器和 Amiibo 卡片             |
| `/gallery`    | `src/routes/gallery/+page.svelte`    | 图库页，目前复用 `GalleryShow` 组件                  |

每个页面的标题和导航菜单由对应的 `+page.ts` 返回，最终传给 `Header.svelte`。

## 数据流

项目的主数据来自 `src/lib/data/zelda-amiibo.json`。

1. `src/lib/data/loader.ts` 读取 JSON，并按发布时间倒序排序。
2. `src/routes/+layout.server.ts` 在服务端 load 阶段加载 Amiibo 数据，同时计算每个系列的总数和已收集数量。
3. `src/routes/+layout.svelte` 根据加载结果计算总收藏进度、已收集数量、总数量和累计花费。
4. `src/store.ts` 初始化全局 store，供页面组件读取。
5. 页面组件根据 store 渲染图库、进度条、筛选器和卡片。

## 核心 store

`src/store.ts` 定义了 4 个全局 store：

| Store           | 类型                     | 说明                                   |
| --------------- | ------------------------ | -------------------------------------- |
| `collectedInfo` | `CollectedInfo`          | 总进度、已收集数量、总数、累计花费     |
| `amiibos`       | `Amiibo[]`               | Amiibo 列表                            |
| `series`        | `SeriesCollectingInfo[]` | 每个系列的收集统计                     |
| `gallery`       | `Gallery`                | 图库用图片列表，分为 `toys` 和 `boxes` |

`initStore` 会根据 Amiibo 数据和图片 endpoint 生成图库图片地址。

## 主要组件

### `Header.svelte`

负责页面标题、导航和备份入口。导航项由页面 load 返回的 `menus` 控制：

- `progress`：显示“概览”
- `collecting`：显示“收集”
- `gallery`：预留图库入口，当前代码中导航被注释
- `backup`：显示“备份”

备份按钮会调用 `downloadBackup`，导出包含当前统计信息和完整 Amiibo 数据的 JSON 文件。

### `GalleryShow.svelte`

展示 Amiibo 玩具图片网格。未收集 Amiibo 会降低透明度。点击图片会跳转到 `/collecting#amiibo-id`，用于定位对应卡片。

组件中还使用 Flowbite Svelte 的 `Popover` 展示图片预览。

### `AmiiboCard.svelte`

展示单个 Amiibo 的卡片信息，包括：

- 图片
- 名称和详情链接
- 所属系列
- 发布日期
- 已收集时显示收集日期和花费

已收集卡片会增加绿色边框。未收集时使用 toy 图片，已收集时使用 box 图片。

### `collecting/+page.svelte`

收集页包含：

- 总收集进度条
- “只显示已收集”复选框
- 系列下拉筛选
- Amiibo 卡片网格

筛选逻辑由 `src/lib/utils/AmiiboDisplayDividedBy.ts` 提供。

## 工具函数

| 文件                                      | 函数             | 说明                                |
| ----------------------------------------- | ---------------- | ----------------------------------- |
| `src/lib/utils/commonUtil.ts`             | `fixTwoDecimals` | 数字保留两位小数                    |
| `src/lib/utils/commonUtil.ts`             | `formatDate`     | 将 `YYYY.MM.DD` 格式转为中文日期    |
| `src/lib/utils/commonUtil.ts`             | `downloadBackup` | 导出收藏备份 JSON                   |
| `src/lib/utils/commonUtil.ts`             | `generateHash`   | 生成 32 位 hash，目前未在页面中使用 |
| `src/lib/utils/AmiiboDisplayDividedBy.ts` | `DevidedBy`      | 根据筛选条件过滤和排序 Amiibo       |

## 构建与部署

项目使用 `@sveltejs/adapter-static`，构建结果输出到 `build` 目录。

```bash
npm run build
```

部署静态文件前需要配置：

```bash
VITE_AMIIBO_IMG_ENDPOINT=https://your-image-host.example.com
```

图片文件本身不在仓库内，页面会通过该 endpoint 拼接 `zelda-amiibo.json` 中的图片文件名。

## 代码注意事项

- 类型声明集中在 `src/@types/type.d.ts`。
- 日期字符串约定为 `YYYY.MM.DD`，格式化依赖 `moment`。
- `collectedInfo` 是可选字段；是否已收集主要通过该字段是否存在以及 `collectedInfo.collected` 判断。
- `status: "in_transit"` 是未收集 Amiibo 的附加状态，用于在途筛选、橙色卡片边框和 Hero 在途数量。
- 当前 `AmiiboSearchCriteria.newestFirst` 已定义但未在筛选函数中使用。
- `AmiiboDisplayDividedBy.ts` 中函数名为 `DevidedBy`，保持现状可避免影响已有引用。
