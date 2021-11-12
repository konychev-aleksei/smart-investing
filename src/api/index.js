import axios from 'axios'
import __data from '../mocks/StocksUtility'

const POST = 'POST', GET = 'GET', PUT = 'PUT',
      baseName = 'https://smart-investing-back.herokuapp.com/api'

const getToken = () => window.sessionStorage.getItem('auth')


export const createUserByEmailAndUsername = async (email, username) => {
  return await axios({
    url: `${baseName}/create-user/${email}/${username}/`,
    method: POST,
    headers: {
      Authorization: getToken()
    }
  })
}

export const getUserCredsByEmail = async (email) => {
  const response = await axios({
    url: `${baseName}/get-user-detail/${email}/`,
    method: GET,
    headers: {
      Authorization: getToken()
    }    
  })

  return response.data
}


export const getUserProfitabilityByEmail = async (email) => {
  const response = await axios({
    url: `${baseName}/get-user-profitability/${email}/`,
    method: GET,
    headers: {
      Authorization: getToken()
    }        
  })

  return response.data
}


export const getStockInfoByTicker = async (ticker) => {
  const response = await axios({
    url: `${baseName}/get-stock-changes/${ticker}/`,
    method: GET
  })

  return response.data
}


//bearer token required
export const addStockToFavorites = async (ticker, email) => {
  await axios({
    url: `${baseName}/add-stock-to-favorites/${ticker}/${email}/`,
    method: PUT,
    headers: {
      Authorization: getToken()
    }    
  })
}


//bearer token required
export const removeStockFromFavorites = async (ticker, email) => {
  await axios({
    url: `${baseName}/remove-stock-from-favorites/${ticker}/${email}/`,
    method: PUT,
    headers: {
      Authorization: getToken()
    }    
  })
}


//bearer token required to check when approximation method is set up nahaer ya eto tak napisal
export const getCandles = async (data) => {
  const { ticker, startDate, finalDate, resolution } = data

  const __startDate = startDate.split('.').reverse().join('-')
  const __finalDate = finalDate.split('.').reverse().join('-')

  const convert = {
    '1 час': 'hour',
    '1 день': 'day',
    '1 неделя': 'week',
    '1 месяц': 'month'
  }

  const staticCandlesResponse = await axios({
    url: `${baseName}/get-candles/?ticker=${ticker}&from=${__startDate}T00:00:00Z&to=${__finalDate}T00:00:00Z&resolution=${convert[resolution]}`,
    method: GET
  })

  const ____startDate = staticCandlesResponse.data[staticCandlesResponse.data.length - 1]?.date

  const predictedCandlesResponse = await axios({
    url: `${baseName}/get-predictions-data/?ticker=${ticker}&from=${____startDate}&to=${__finalDate}T00:00:00Z&resolution=${convert[resolution]}&approximation=0`,
    method: GET,
    headers: {
      Authorization: getToken()
    }        
  })

  const trimItem = (item) => {
    const dateFormat = item.date.substring(0, 10).split('-')
    return {...item, date: new Date(+dateFormat[0], +dateFormat[1], +dateFormat[2])}     
  }
  
  const __staticCandlesResponse = staticCandlesResponse.data.map(item => trimItem(item))
  const __predictedCandlesResponse = predictedCandlesResponse.data.map(item => trimItem(item))

  return [...__staticCandlesResponse, ...__predictedCandlesResponse]
}
