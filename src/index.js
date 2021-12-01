import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom'

import AppContext from './AppContext'

import StartUp from './components/StartUp/StartUp'
import SignUp from './components/SignUp/SignUp'
import Chart from './components/Chart/Chart'
import ForgotPassword from './components/StartUp/ForgotPassword'

import { auth } from './firebase'

import { useAuthState } from 'react-firebase-hooks/auth'
import * as api from './api/index'

import { instruments } from './stocks'


const App = () => {
  const history = useHistory()

  const [favorites, setFavorites] = useState([])
  const [userName, setUserName] = useState('Гость')
  const [promptVisible, setPromptVisible] = useState(false)
  const [userProfitability, setUserProfitability] = useState(0)
  const [range, setRange] = useState("day")
  const [user] = useAuthState(auth)

  const removeFromFavorites = async (ticker) => {
    if (instruments.filter(item => item.ticker !== ticker).length && user) {
      await api.removeStockFromFavorites(ticker, user.email)
      setFavorites(favorites.filter(item => item.ticker !== ticker))
    }
  }

  const addToFavorites = async ({ ticker, name, currency }) => {
    if (instruments.filter(item => item.ticker !== ticker).length && user) {
      await api.addStockToFavorites(ticker, user.email)
      setFavorites([...favorites, { ticker, name, currency }])
    }
  }


  const value = { 
    user,
    
    favorites,
    setFavorites,

    userName, 
    setUserName,

    promptVisible,
    setPromptVisible,

    removeFromFavorites,
    addToFavorites
  }

  useEffect(() =>
    (
      async () => {
        if (user) {
          user.getIdToken()
            .then(idToken => {
              window.sessionStorage.setItem("auth", idToken)
              history.push('/stock/welcome')
            })
            .catch(e => console.error(e))     

          try {
            await api.createUserByEmailAndUsername(user.email, user.displayName)
          }
          catch (e) {
            console.error(e)
          }

          try {
            const { username, stocks } = await api.getUserCredsByEmail(user.email)  
            setUserName(username ?? 'Ошибка')
            setFavorites(stocks ?? [])
          }
          catch (e) {
            console.error(e)
          }
        }
      }  
    )()  
  , [user, history])

  useEffect(() =>
    (
      async () => {
        if (user) {
          console.log(range)
          const { profitability } = await api.getUserProfitabilityByEmail(user.email, range)
          setUserProfitability(Math.ceil((profitability) * 100))
        }
      }
    )()
  , [user, favorites, range])

  return(
    <AppContext.Provider value={value}>
        <BrowserRouter>  
          <Switch>       
            {
              window.sessionStorage.getItem('auth') || user ? 
                <>
                  <Route exact path="/stock/:ticker">
                    <Chart setRange={ setRange } userProfitability={ userProfitability }  />
                  </Route>                     
                  <Route path="*">
                    <Redirect to="/stock/welcome" />           
                  </Route>   
                </>
              :
                <>
                  <Route exact path="/signup">
                    <SignUp />
                  </Route>
                  <Route exact path="/product">
                    <StartUp />
                  </Route>          
                  <Route exact path="/reset">
                    <ForgotPassword />
                  </Route>        
                  <Route path="*">
                    <Redirect to="/product" />           
                  </Route>       
                </>                
            }                                    
          </Switch>
        </BrowserRouter>
    </AppContext.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
