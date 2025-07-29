export const DevidedBy = (amiibos: Amiibo[], searchCriteria: AmiiboSearchCriteria) => {
	let temp = amiibos
		.filter(a => !searchCriteria.showCollectedOnly || a.collectedInfo?.collected)
		.filter(a => searchCriteria.series === "ALL" || a.series === searchCriteria.series);
	if (searchCriteria.showCollectedOnly) {
		temp = temp.sort((a, b) =>  {
			if (a.collectedInfo?.collectDate && b.collectedInfo?.collectDate) {
				return Date.parse(b.collectedInfo?.collectDate) - Date.parse(a.collectedInfo?.collectDate)
			}
			return 0;
		});
	}
	return temp;
}