import React, { useState, useRef } from 'react'
import StartUpCSS from './StartUp.module.css'

import { auth } from '../../firebase'


const ForgotPassword = () => {
    const inputRef = useRef(null)
    const [reseted, setReseted] = useState(false)
    const { loginpannel, signin, wrapper, videofill, inputStyle } = StartUpCSS

    const resetEmail = async () => {
        console.log(inputRef?.cuurent.value || '')
        try {
            await auth.sendPasswordResetEmail('konychevaleksei@yandex.ru')
        }
        catch (e) {
            console.error(e)
        }
        setReseted(true)
    }

    return(
        <div className={ wrapper }>
            <div className={signin}>
                <img draggable="false" src="./stock.png" alt="" />
                <h1>Reset your password</h1>
                <h2>To reset your password, enter your email below and submit. An email will be sent to you with instructions about how to complete the process.</h2>
                <hr />

                <p>Email</p>
                <input className={ inputStyle } ref={ inputRef } />

                <div className={ loginpannel }>
                    <button onClick={ resetEmail }>Reset</button>
                </div>
                {
                    reseted && <b>На данную электронную почту отправлена инструкция по восстановлению аккаунта</b>
                }                
            </div>
            <div className={ videofill }>
                <span></span>
                <div>
                    <h1>smart Investing</h1>
                    <p>Современная полнофукциональная, кроссплатформенная online система прогнозирования инвестиций с возможностью поиска и выбора максимально выгодных способов вложения капитала.</p>
                </div>
            </div>            
        </div>        
    )
}

export default ForgotPassword