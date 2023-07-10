import pokemon from 'pokemontcgsdk'

export const getPageResults = async (results, queryObject, setLoadingPage) => {
    const searchResults = []
    for(let i = 1; i < Math.ceil(results.totalCount / 250) + 1; i++){
        queryObject.page = i
        setLoadingPage(i)
        const pageResults = await pokemon.card.where(queryObject)
        pageResults.data.map((card) => {
            searchResults.push(card)
        })
    }
    return searchResults
}
