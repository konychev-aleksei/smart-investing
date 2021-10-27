import React, { useState, useContext } from 'react'
import style from './Header.module.css'
import { useHistory } from 'react-router-dom'
import { auth } from '../../firebase'
import { instruments } from '../../stocks'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import AppContext from '../../AppContext'


const StockPale = ({ ticker, name, currency, setQuery }) => {
    const { favorites, setFavorites } = useContext(AppContext)
    const includes = favorites.filter(item => item.ticker === ticker).length

    const handleChoice = async (e) => {
        setQuery('')
        //setCurrentStock(await api.getStock(e.target.value))
    }

    return(
        <div className={ style.stock }>
            <div onClick={ () => handleChoice() }>
                <h1>{ ticker }</h1>
                <h3>{ name.length > 50 ? `${name.substr(0, 50)}...` : name }</h3>
            </div>   
            <button onClick={
                () => setFavorites(
                    includes ?
                        favorites.filter(item => item.ticker !== ticker)
                    :
                        [...favorites, { ticker, name, currency }]
                )
            }>
                <FontAwesomeIcon style={ !includes && { color: '#CCF' }} icon={ faStar } />
            </button>    
            <img src={`${process.env.PUBLIC_URL}/${currency}.png`} alt="" />
        </div>            
    )    
}


const Header = () => {
    const [query, setQuery] = useState('')
    const history = useHistory()

    const signOut = async () => {
        sessionStorage.removeItem('auth')
        await auth.signOut()
        history.push('/product')
    }

    const search = (stock) => {
        return stock.ticker.includes(query.toUpperCase()) 
        || stock.name.toLowerCase().includes(query.toLowerCase())
    }

    return (
        <>
            <div className={style.header}>
                <img 
                    draggable="false" 
                    src={ `${process.env.PUBLIC_URL}/stock.png` } 
                    alt="" 
                />
                <input 
                    onChange={ e => setQuery(e.target.value) }
                    placeholder="Search by tickers or a company name" 
                    type="search" 
                    value={ query }
                />
                <i>Aleksei Konychev</i>
                <button onClick={ signOut }>Logout</button>
            </div>       
            <div className={ style.guess }>
                {
                    query 
                    && 
                    instruments
                        .filter(stock => search(stock))
                        .slice(0, 5)
                        .map(({ ticker, name, currency }) => 
                            <StockPale 
                                key={ ticker }
                                ticker={ ticker }
                                name={ name } 
                                currency={ currency }
                                setQuery={ setQuery }
                            />
                        )
                }                       
            </div> 
        </>
    )
}

export default Header