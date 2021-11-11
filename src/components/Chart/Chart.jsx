import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { IgrFinancialChart } from 'igniteui-react-charts'
import { IgrFinancialChartModule } from 'igniteui-react-charts'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom, faStar, faChartBar } from '@fortawesome/free-solid-svg-icons'
import style from './Chart.module.css'

import Header from '../Header/Header'
import AppContext from '../../AppContext'

import { instruments } from '../../stocks'
import * as api from '../../api/index'

import { CircularProgressBar } from '@tomik23/react-circular-progress-bar'


IgrFinancialChartModule.register()  


const DEFAULT_OPTION = 'Разрешение'
const DEFAULT_APPROX = 'Метод прогнозирования'

const colors = ['#8bdc5c', '#8b5bb1', '#6db1ff', '#f8a15f']
const resolutions = ['1 час', '1 день', '1 неделя', '1 месяц']

const minuteDur = 1000 * 60
const hourDur = minuteDur * 60
const dayDur = hourDur * 24
const monthDur = dayDur * 31
const yearDur = dayDur * 365


const StockInfo = ({ stockInfo, includes, ticker, name, currency }) => {
    const { removeFromFavorites, addToFavorites } = useContext(AppContext)

    const handleAddition = async () => {
        includes ? await removeFromFavorites(ticker) : await addToFavorites({ ticker, name, currency })               
    }

    const converter = {
        USD: '$',
        EUR: '€',
        RUB: '₽'
    }

    let { change, price } = stockInfo
    const percentage = `${ (change / price).toFixed(2) }%`
    const __name = `${name}. Currency in ${currency}`
    const __change = `${change ?? ''}${converter[currency]}`

    price = `${price ?? ''}${converter[currency]}`
    return(
        <>
            <h3>{ ticker }</h3>
            <p>{ __name }</p> 
            <div className={ style.price }>
                <h1>{ price }</h1>
                &nbsp;
                &nbsp;
                &nbsp;
                <h3 style={ { color: change >= 0 ? 'green' : 'red' } }>{ __change } ({ percentage })</h3>
                <button onClick={ handleAddition }>
                    <FontAwesomeIcon 
                        style={ !includes && { color: '#CCF' } } 
                        icon={ faStar } 
                    />
                </button>
            </div>          
        </>
    )
}



const StockPale = ({ processChange, ticker, name, currency, view }) => {
    const params = useParams()
    const history = useHistory()
    const selected = params.ticker === ticker
    const disabled = view.length === 4 && !view.includes(ticker)
    const tickerColor = { color: view.includes(ticker) ? colors[view.indexOf(ticker)] : 'black' }

    const { removeFromFavorites } = useContext(AppContext)

    const getField = (value) => value.length > 22 ? `${value.substring(0, 22)}...` : value

    const handleRemoval = async () => {
        processChange(ticker, false)
        await removeFromFavorites(ticker) 
    }

    return(
        <div style={ selected ? { backgroundColor: '#e2edff' } : null } className={ style.stock }>
            <div onClick={ () => history.push(`/stock/${ ticker }`) }>
                <h1 style={ tickerColor }>{ ticker }</h1>
                <h3>{ getField(name) }</h3>
            </div>
            <img src={`${ process.env.PUBLIC_URL }/${ currency }.png`} alt="" />
            <button 
                onClick={ handleRemoval }
            >
                <FontAwesomeIcon icon={ faStar } />
            </button>
            <input 
                disabled={ disabled }
                onChange={ e => processChange(ticker, e.target.checked) } 
                type="checkbox" 
            />
        </div>
    )
}    


const Chart = ({ userProfitability }) => {
    const history = useHistory()
    const CANDLE = "Candle"
    const LINE = "Line"

    const { user, favorites } = useContext(AppContext)
    const [invalidForm, setInvalidForm] = useState(true)
    const [chartType, setChartType] = useState(CANDLE)
    const [stockInfo, setStockInfo] = useState({})

    const { setPromptVisible } = useContext(AppContext)
    const { ticker } = useParams()

    const creds = instruments.filter(item => item.ticker === ticker)
    const includes = favorites.filter(item => item.ticker === ticker)

    //@form-data
    const [view, setView] = useState([])
    const [startDate, setStartDate] = useState('')
    const [finalDate, setFinalDate] = useState('')
    const [resolution, setResolution] = useState('')    
    const [approximation, setApproximation] = useState(DEFAULT_APPROX)

    //@candles-data
    const [data, setData] = useState([])

    const toTimeStamp = (date) => {
        date = date.split('-')
        return (new Date( date[0], date[1] - 1, date[2])).getTime()
    }

    const processChange = (ticker, event) => {
        const newView = event ?
            [...view, ticker]   
        :
            view.filter(item => item !== ticker)

        setView(newView)
    }

    const checkField = (i) => {
        if (!finalDate || !startDate) {
            return false
        }

        const duration = toTimeStamp(finalDate) - toTimeStamp(startDate)
        switch(i) {
            case 0:
                return duration >= hourDur && duration <= 7 * dayDur
            case 1:
                return duration >= dayDur && duration <= yearDur
            case 2:
                return duration >= 7 * dayDur && duration <= 2 * yearDur
            case 3:
                return duration >= monthDur && duration <= 10 * yearDur                
            default: 
                return false
        }
    }
    
    const handleSubmit = async () => {
        const data = {
            startDate, finalDate, resolution, 
            approximation: (user ? approximation : null)
        }

        const requests = view.map(ticker => { return api.getCandles({...data, ticker })})

        let result = []
        Promise.all(requests)
            .then(res => result = [...result, ...res])
            .then(() => setData(result))
    }

    useEffect(() => {
        const checkViews = () => {
            const names = new Set()
    
            view.forEach(ticker => names.add(instruments.filter(item => item.ticker === ticker)[0].currency))
            return names.size !== 1
        }

        const check = 
            !view.length ||
            !startDate ||
            !finalDate ||
            resolution === DEFAULT_OPTION ||
            approximation === DEFAULT_APPROX ||
            checkViews() ||
            (user ? false : toTimeStamp(finalDate) > Date.now())


        setInvalidForm(check)

        if (check) {
            setResolution(DEFAULT_OPTION)
        }
    }, [view, startDate, finalDate, resolution, user, approximation])

    useEffect(() => {
        (
            async () => {
                if (!creds.length) {
                    history.push('/stock/welcome')
                    return
                }
                setStockInfo(await api.getStockInfoByTicker(ticker))
            }
        )()
    }, [history, ticker, creds.length])

    const props = {
        percent: Math.abs(Math.ceil(userProfitability)),
        colorSlice: userProfitability < 0 ? "red" : colors[0],
        colorCircle: "#efefef",
        fontColor: "black",
        fontSize: "1.2rem",
        fontWeight: 700,
        size: 70,
        speed: 100,
        cut: 0,
        rotation: -90,
        opacity: 10,
        fill: "white",
        unit: "%",
        textPosition: "0.35em",
        animationOff: false,
        inverse: userProfitability < 0 ? true : false,
        round: false,
        number: true,
    }

    return (
        <>       
            <Header />        
            <div onClick={ () => setPromptVisible(false) } className={style.wrapper}>
                <div className={style.leftList}>
                    <div className={style.profit}>
                        <p>Портфель</p>
                        <div className={style.profitText}>
                            Доходность портфеля за месяц на основании добавленных акций
                        </div>
                        <div className={style.progressbar}>
                            <CircularProgressBar {...props} clssName={style.progressbar} />
                        </div>
                    </div>
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
                                        processChange={ processChange }
                                        view={ view }
                                    />
                                )
                            }                        
                        </div>
                    </div>
                </div>
                <div className={ style.chart }>
                    <div className={ style.info }>
                        {
                            creds.length ?
                            <StockInfo 
                                stockInfo={ stockInfo }
                                includes={ includes.length }
                                ticker={ ticker }
                                name={ creds[0].name }
                                currency={ creds[0].currency }
                            />
                            :
                            <div style={{ height: '100px', color: 'grey' }}>
                                Нет информации о текущей акции
                            </div>
                        }

                        <div className={ style.form }>
                            <div className={ style.dates }>
                                <input 
                                    value={ startDate } 
                                    onChange={ e => setStartDate(e.target.value) } 
                                    type="date" 
                                />
                                <p>—</p>
                                <input 
                                    value={ finalDate }
                                    onChange={ e => setFinalDate(e.target.value) } 
                                    type="date" 
                                />
                            </div>
                            <div className={ style.submission }>
                                <select 
                                    style={ user ? null : { opacity: '.5' } } 
                                    disabled={ !user }
                                    value={ approximation }
                                    onChange={ e => setApproximation(e.target.value) }
                                >
                                    <option 
                                        disabled 
                                    >
                                        { DEFAULT_APPROX }
                                    </option>
                                    <option>Линейная регрессия</option>
                                    <option>Квадратичная регрессия</option>
                                    <option>Квадратичный сплайн</option>
                                </select>
                                <select 
                                    value={ resolution }
                                    onChange={ e => setResolution(e.target.value) }
                                >
                                    <option
                                        name={ 0 }
                                        disabled
                                        style={ { color: '#ddd' } }
                                    >
                                        { DEFAULT_OPTION }
                                    </option>
                                    {
                                        resolutions.map((resolution, i) => 
                                            <option
                                                key={ i }
                                                name={ i + 1 }
                                                disabled={ !checkField(i) }
                                                style={ checkField(i) ? null : { color: '#ddd' } }
                                            >
                                                { resolution }
                                            </option>
                                        )
                                    }
                                </select>
                                <button 
                                    disabled={ invalidForm } 
                                    style={ invalidForm ? { opacity: '.5' } : null } 
                                    onClick={ handleSubmit }>
                                    <FontAwesomeIcon icon={ faRandom } />
                                </button>                                
                            </div>
                        </div>                    
                    </div>
                    <div className={ style.chartArea }>
                        <button 
                            onClick={ () => setChartType(chartType === LINE ? CANDLE : LINE) } 
                            className={ style.viewer }
                            style={ data.length ? chartType === LINE ? { color: 'grey' } : null : { opacity: '.5' } }
                        >
                            <FontAwesomeIcon icon={ faChartBar } />
                        </button>
                        {
                            data.length ?
                                <IgrFinancialChart
                                    width="calc(100% - 20px)"
                                    height="100%"                      
                                    zoomSliderType="Line"
                                    isToolbarVisible={ false }
                                    chartType={ chartType }
                                    yAxisTitle="Financial Prices"
                                    xAxisTitle="Months"
                                    overlayBrushes="rgba(5, 138, 0, 0.17)"
                                    overlayOutlines="rgba(5, 138, 0, 0.4)"
                                    overlayThickness={ 2 }
                                    dataSource={ data }
                                />
                            :
                                <div style={{ color: 'grey' }}>
                                    Нет выбраных графиков
                                </div>
                        }
                    </div>                                 
                </div>            
            </div>            
        </>
    )
}

export default Chart