import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import StartUpCSS from './StartUp.module.css'
import GoogleButton from 'react-google-button'

import { auth } from '../../firebase'
import firebase from 'firebase'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'


const initialValues = {
    email: '',
    password: ''
}

const formSchema = Yup.object().shape({
    email: Yup.string().required('Необходимо заполнить поле «Email»‎').email('Необходимо ввести валидный email'),
    password: Yup.string().required('Необходимо заполнить поле «Password»‎').min(6).max(25)
})


const StartUp = () => {
    const [exists, setExists] = useState(false)

    const history = useHistory()
    const { wrapper, signin, videofill, google, loginpannel, formik } = StartUpCSS


    const signInGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        
        try {
            await auth.signInWithPopup(provider)
            sessionStorage.setItem('auth', true)
            history.push('/stock/welcome')
        }
        catch (e) {
            console.error(e)
        }
    }

    const signInEmail = async (values) => {
        try {
            await auth.signInWithEmailAndPassword(values.email, values.password)        
            sessionStorage.setItem('auth', true)
            history.push('/stock/welcome')
        }
        catch (e) {
            setExists(true)
        }
    }


    return (
        <div className={ wrapper }>
            <div className={ signin }>
                <img draggable="false" src="./stock.png" alt="" />
                <h1>Log In To your Account</h1>
                <GoogleButton 
                    onClick={ signInGoogle }
                    className={ google } 
                />
                <hr />
                <Formik
                    onSubmit={ signInEmail }
                    initialValues={ initialValues }
                    validationSchema={ formSchema }
                >
                       {
                            ({ touched, errors, isSubmitting }) => (
                                <Form className={ formik }>
                                    <p>Email</p>
                                    <Field 
                                        validate={ formSchema }
                                        name="email"
                                        type="email" 
                                    />
                                    <br />
                                    { errors.email && touched.email && <b>{ errors.email }</b> }
                                    <p>Password</p>
                                    <Field 
                                        validate={ formSchema }
                                        name="password"                                    
                                        type="password" 
                                    />    
                                    <br />
                                    { errors.password && touched.password && <b>{ errors.password }</b> }                                    
                                    <button style={{ marginTop: '25px' }} type="button" onClick={ () => history.push('/reset') }>Forgot password?</button>

                                    <div className={ loginpannel }>
                                        <button type="submit" onClick={ signInEmail }>Login</button>
                                        <p>Don't have an account?</p>
                                        <button type="button" onClick={ () => history.push('/signup') }>Sign Up</button>
                                    </div>
                                    <br />
                                    { exists && <b>Неверный адрес почты или пароль</b> }                                    
                                </Form>
                            )    
                       }                       
                </Formik>   
            </div>
            <div className={ videofill }>
                <video 
                    src="" 
                    autoPlay 
                    muted 
                    loop 
                />
                <div>
                    <h1>smart Investing</h1>
                    <p>Современная полнофукциональная, кроссплатформенная online система прогнозирования инвестиций с возможностью поиска и выбора максимально выгодных способов вложения капитала.</p>
                </div>
            </div>            
        </div>
    )
}

export default StartUp