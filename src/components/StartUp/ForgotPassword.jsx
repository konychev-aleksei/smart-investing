import React, { useState, useRef } from 'react'
import StartUpCSS from './StartUp.module.css'

import { auth } from '../../firebase'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

const formSchema = Yup.object().shape({
    email: Yup.string().required('Необходимо заполнить поле «Email»‎').email('Необходимо ввести валидный email')
})


const ForgotPassword = () => {
    const [reseted, setReseted] = useState(false)
    const { loginpannel, signin, wrapper, videofill, inputStyle } = StartUpCSS

    const handleSubmit = async (values) => {
        try {
            await auth.sendPasswordResetEmail(values.email)
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
                <Formik
                    onSubmit={ handleSubmit }
                    initialValues={ { email: '' } }
                    validationSchema={ formSchema }
                >
                    {
                        ({ touched, errors, isSubmitting }) => (  
                            <Form>                  
                                <p>Email</p>
                                <Field 
                                    className={ inputStyle }
                                    validate={ formSchema }
                                    name="email"
                                    type="email" 
                                />    
                                { errors.email && touched.email && <b style={{ color: 'crimson', fontSize: '14px' }}>{ errors.email }</b> }
                                <div className={ loginpannel }>
                                    <button type="submit" disabled={ isSubmitting }>Reset</button>
                                </div>
                            </Form>
                        )
                    }                       
                </Formik>                           

                { reseted && <b style={{ color: '#0c7' }}>На данную электронную почту отправлена инструкция по восстановлению аккаунта</b> }                
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