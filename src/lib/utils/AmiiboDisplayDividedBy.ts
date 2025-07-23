export const DevidedBy = (amiibos: Amiibo[], searchCriteria: AmiiboSearchCriteria) => {
	let temp = amiibos
		.filter(a => !searchCriteria.showCollectedOnly || a.collected)
		.filter(a => searchCriteria.series === "ALL" || a.series === searchCriteria.series);
	if (searchCriteria.showCollectedOnly) {
		temp = temp.sort((a, b) =>  {
			if (a.collectDate && b.collectDate) {
				return Date.parse(b.collectDate) - Date.parse(a.collectDate)
			}
			return 0;
		});
	}
	return temp;
}