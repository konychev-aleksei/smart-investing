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



const App = () => {
  const history = useHistory()
  
  const [favorites, setFavorites] = useState([])
  const [user] = useAuthState(auth)
  const value = { 
    user,
    favorites,
    setFavorites    
  }

  console.log(favorites)

  useEffect(() => {
    console.log(user)
    
  }, [user])

  useEffect(() => console.table(favorites))

  return(
    <AppContext.Provider value={value}>
        <BrowserRouter>  
          <Switch>
            <Route exact path="/stock/:ticker">
             <Chart />
            </Route>            
            {
              sessionStorage.getItem('auth') || user ? 
                <Redirect to="/stock/welcome" />
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
                </>                
            }                 
            <Route path="*">
             <Redirect to="/product" />
            </Route>      
          </Switch>
        </BrowserRouter>
        <button onClick={ () => history.push('/product') }>Start</button>
    </AppContext.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
