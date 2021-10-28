import React, { useState, useEffect, useContext } from 'react'
import {useParams} from 'react-router-dom'
import {IgrFinancialChart} from 'igniteui-react-charts'
import {IgrFinancialChartModule} from 'igniteui-react-charts'
import data from '../../mocks/StocksUtility'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom, faStar } from '@fortawesome/free-solid-svg-icons'
import style from './Chart.module.css'

import Header from '../Header/Header'
import AppContext from '../../AppContext'


IgrFinancialChartModule.register()  


const StockPale = ({ ticker, name, currency}) => {
    return(
        <div className={style.stock}>        
            <div>
                <h1>{ ticker }</h1>
                <h3>{ name }</h3>
            </div>   
            <img src={`${process.env.PUBLIC_URL}/${currency}.png`} alt="" />
            <input type="checkbox" />
        </div>  
    )
}    


const Chart = () => {
    const { favorites, setFavorites } = useContext(AppContext)
    const { ticker } = useParams()
    const includes = favorites.filter(item => item.ticker === ticker).length

    useEffect(() => {
        (
            async () => {
                //await api.getStock()
            }
        )()
    }, [])

    return (
        <>       
            <Header />        
            <div className={style.wrapper}>
                <div className={style.list}>
                    <p>Избранные акции</p>
                    <div>
                        {
                            favorites.map(({ ticker, name, currency }) => 
                                <StockPale 
                                    key={ ticker }
                                    ticker={ ticker }
                                    name={ name }
                                    currency={ currency }
                                />
                            )
                        }                        
                    </div>
                </div>
                <div className={style.chart}>
                    <div className={style.info}>
                        <h3>AAPL</h3>
                        <p>Apple Inc. Currency in USD</p> 

                        <div className={style.price}>
                            <h1>24.06$</h1>
                            &nbsp;&nbsp;&nbsp;
                            <h3>-1.06$ (-4.52%)</h3>
                            <button onClick={
                                () => setFavorites(
                                    includes ?
                                        favorites.filter(item => item.ticker !== ticker)
                                    :
                                        [...favorites, { ticker, name: 'Apple', currency: 'USD' }]
                                )                                
                            }>
                                <FontAwesomeIcon style={ !includes && { color: '#CCF' } } icon={faStar} />
                            </button>                            
                        </div>  

                        <div className={style.form}>
                            <div className={style.dates}>
                                <input type="date" />
                                <p>—</p>
                                <input type="date" />
                            </div>
                            <div className={style.submission}>
                                <select>
                                    <option>Линейная регрессия</option>
                                    <option>Квадратичная регрессия</option>
                                    <option>Квадратичный сплайн</option>
                                </select>
                                <select>
                                    <option>1 минута</option>
                                    <option>2 минуты</option>
                                    <option>3 минуты</option>
                                    <option>5 минут</option>
                                    <option>10 минут</option>
                                    <option>15 минут</option>
                                    <option>30 минут</option>
                                    <option>1 час</option>
                                    <option>1 день</option>
                                    <option>1 месяц</option>
                                </select>
                                <button>
                                    <FontAwesomeIcon icon={faRandom} />
                                </button>                                
                            </div>
                        </div>                    
                    </div>
                    <div className={style.chartArea}>
                        <IgrFinancialChart
                            width="100%"
                            height="100%"
                            chartTitle="Google vs Microsoft Changes"
                            subtitle="Between 2013 and 2017"
                            titleLeftMargin="25"
                            titleTopMargin="5"                            
                            subtitleLeftMargin="25"
                            subtitleTopMargin="5"     
                            subtitleBottomMargin="10"    
                            titleAlignment="Left"                   
                            subtitleAlignment="Left"
                            zoomSliderType="Line"
                            isToolbarVisible={ false }
                            chartType="Candle"
                            yAxisTitle="Financial Prices"
                            xAxisTitle="Months"
                            overlayBrushes="rgba(5, 138, 0, 0.17)"
                            overlayOutlines="rgba(5, 138, 0, 0.4)"
                            overlayThickness={ 2 }
                            dataSource={ data }
                        />   
                    </div>                                 
                </div>            
            </div>            
        </>
    )
}

export default Chart
