import pokemon from 'pokemontcgsdk'
import { useEffect, useState } from 'react'
import legalCards from '../../Data/legalCards.js'
import './PokemonSearch.css'

pokemon.configure({apiKey: process.env.REACT_APP_POKEMON_API_KEY})

function PokemonSearch(){

    const setLegalCardsArr = () => {
        const legalCardsArr = []
        let i = 1;
        while(localStorage.getItem(`paldeaCards${i}`)){
            if(!localStorage.getItem(`paldeaCards${i}`)) return undefined
            const cards = JSON.parse(localStorage.getItem(`paldeaCards${i}`))
            console.log(typeof cards)
            console.log(cards)
            cards.map((card) => {
                console.log(card)
                legalCardsArr.push(card)
            })
            i++
            if(i > 100){
                throw new Error('reached upper bound of local storage pagination')
            }
        }
        return legalCardsArr
    }

    const [legalCards, setLegalCards] = useState([])
    const [pageCards, setPageCards] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [cardResults, setCardResults] = useState([])

    // const handleSearch = (setName) => {
    //     pokemon.set.where({ q: `series:${setName}` })
    //     .then(result => {
    //         console.log(result.data[0].name) // "Base"
    //     })
    // }

    const increasePage = (page) => setPageNumber(page + 1)
    const decreasePage = (page) => setPageNumber(page - 1)

    // useEffect(() => {
    //     if(!legalCards.length) getAllStandardLegalCards()
    //     else setCardResults(setLegalCardsArr())
    // }, [legalCards])

    useEffect(() => {
        fetchCardsByPage()
    }, [cardResults])

    useEffect(() => {
        if(cardResults.length) fetchCardsByPage()
    }, [pageNumber])

    useEffect(() => {
        if(localStorage.getItem('paldeaCards1' && localStorage.getItem('paldeaCards2'))){
            setCardResults(setLegalCardsArr())
        }
        else getAllStandardLegalCards()
    }, [])

    const getAllStandardLegalCards = async () => {
        console.log('fetching data...')
        const results = await pokemon.card.where({ q: `set.id:sv2` })
        const resultCount = results.totalCount
        console.log(resultCount)
        for(let i = 1; i < Math.ceil((resultCount / 250) + 1); i++){
            if(!localStorage.getItem(`paldeaCards${i}`)){
                const data = await pokemon.card.where({ q: `set.id:sv2`, page: i, select: 'id,name,images' })
                console.log(data)
                localStorage.setItem(`paldeaCards${i}`, JSON.stringify(data.data))
                console.log('fetched page:' + i)
            }
        }

        console.log('fetched all cards')
        setCardResults(setLegalCardsArr())
    }

    const fetchCardsByPage = () => {
        const cardsArr = []
        for(let i = pageNumber * 20; i < (pageNumber * 20) + 20; i++){
            console.log(cardResults[i])
            cardsArr.push(cardResults[i])
        }
        setPageCards(cardsArr)
    }


    return (
        <>
            <div className='pokemon-set-wrapper'>
                <input type='text'/>
            </div>
            <div className='cards-wrapper'>
                {pageCards && pageCards.length && pageCards.map((card) =>(
                    <div className='single-card-image-wrapper'>
                        <img className='single-card-image' src={card?.images?.large}></img>
                    </div>
                ))}
            </div>
            <div className='page-number-wrapper'>
                <div>
                {pageNumber > 1 && <button onClick={() => decreasePage(pageNumber)}> Previous Page </button>}
                </div>
                <div>
                    {'Page ' + pageNumber + ' of ' + Math.ceil(cardResults.length / 20)}
                </div>
                <div>
                    <button onClick={() => increasePage(pageNumber)}> Next Page </button>
                </div>
            </div>
        </>
    )
}

export default PokemonSearch
