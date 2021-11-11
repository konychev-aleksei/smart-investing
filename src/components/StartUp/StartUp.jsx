import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import style from './StartUp.module.css'
import GoogleButton from 'react-google-button'

import { auth } from '../../firebase'
import firebase from 'firebase'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const VIDEO_LINK = 'https://firebasestorage.googleapis.com/v0/b/new-project-95ff8.appspot.com/o/video.mp4?alt=media&token=84dd82e2-96e7-4f10-878d-d326ace19100'


const initialValues = {
    email: '',
    password: ''
}

const formSchema = Yup.object().shape({
    email: Yup.string().required('Необходимо заполнить поле «Email»‎').email('Необходимо ввести валидный email'),
    password: Yup.string().required('Необходимо заполнить поле «Password»‎').min(6, 'Длина пароля меньше 6 символов').max(25, 'Длина пароля превышает 25 символов')
})


const StartUp = () => {
    const [invalid, setInvalid] = useState(false)
    const history = useHistory()

    const signInGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        
        try {
            await auth.signInWithPopup(provider)
            history.push('/stock/welcome')
        }
        catch (e) {
            console.error(e)
        }
    }

    const signInEmail = async (values) => {
        auth.signInWithEmailAndPassword(values.email, values.password)        
            .then(() => history.push('/stock/welcome'))
            .catch(() => setInvalid(true))
    }


    return (
        <div className={ style.wrapper }>
            <div className={ style.signin }>
                <img draggable="false" src="./stock.png" alt="" />
                <h1>Log In To your Account</h1>
                <GoogleButton 
                    onClick={ signInGoogle }
                    className={ style.google } 
                />
                <hr />
                <Formik
                    onSubmit={ signInEmail }
                    initialValues={ initialValues }
                    validationSchema={ formSchema }
                >
                    {
                        ({ touched, errors, isSubmitting }) => (
                            <Form className={ style.formik }>
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

                                <div className={ style.loginpannel }>
                                    <button 
                                        disabled={ isSubmitting }   
                                        type="submit" 
                                        onClick={ signInEmail }
                                    >
                                        Login
                                    </button>
                                    <p>Don't have an account?</p>
                                    <button type="button" onClick={ () => history.push('/signup') }>Sign Up</button>
                                </div>
                                <br />
                                { invalid && <b>Неверный адрес почты или пароль</b> }                                    
                            </Form>
                        )    
                    }                       
                </Formik>   
            </div>
            <div className={ style.videofill }>
                <video 
                    src={ VIDEO_LINK }
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