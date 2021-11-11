import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import SignUpCSS from './SignUp.module.css'
import GoogleButton from 'react-google-button'

import {auth} from '../../firebase'
import firebase from 'firebase'

import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import * as api from '../../api/index'


const initialValues = {
    email: '',
    password: '',
    firstname: '',
    lastname: ''
}

const formSchema = Yup.object().shape({
    email: Yup.string().required('Необходимо заполнить поле «Email»‎').email('Необходимо ввести валидный email'),
    firstname: Yup.string().required('Необходимо заполнить поле «Firstname»‎').max(25, 'Длина поля превышает 25 символов'),
    lastname: Yup.string().required('Необходимо заполнить поле «Lastname»‎').max(25, 'Длина пароля превышает 25 символов'),
    password: Yup.string().required('Необходимо заполнить поле «Password»‎').min(6, 'Длина пароля меньше 6 символов').max(25, 'Длина пароля превышает 25 символов')
})


const SignUp = () => {
    const [exists, setExists] = useState(false)

    const history = useHistory() 
    const { wrapper, gradient, form, google, loginpannel, formik } = SignUpCSS

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

    const signUpEmail = async (values) => {
        try {
            auth.createUserWithEmailAndPassword(values.email, values.password)
                .then(async () => {
                    await api.createUserByEmailAndUsername(values.email, `${values.firstname} ${values.lastname}`)
                    history.push('/stock/welcome')
                })
        }
        catch (e) {
            setExists(true)
        }
    }


    return (
        <div className={ wrapper }>
            <div className={ gradient } />
            <div className={ form }>
                <img draggable="false" src="./stock.png" alt="" />
                <h1>Create your account</h1>
                <GoogleButton 
                    onClick={ signInGoogle }
                    className={ google } 
                />
                <hr />
                <Formik
                    onSubmit={ signUpEmail }
                    initialValues={ initialValues }
                    validationSchema={ formSchema }
                >
                       {
                            ({ touched, errors, isSubmitting }) => (
                                <Form style={ isSubmitting ? { opacity: '.5' } : null } className={ formik }>
                                    <p>Email</p>
                                    <Field 
                                        validate={ formSchema }
                                        name="email"
                                        type="email" 
                                    />
                                    <br />
                                    { errors.email && touched.email && <b>{ errors.email }</b> }
                                    <p>First name</p>
                                    <Field 
                                        validate={ formSchema }
                                        name="firstname"
                                        type="text"                                         
                                    />
                                    <br />
                                    { errors.firstname && touched.firstname && <b>{ errors.firstname }</b> }
                                    <p>Last name</p>
                                    <Field 
                                        validate={ formSchema }
                                        name="lastname"
                                        type="text"                                                                            
                                    />                
                                    <br />
                                    { errors.lastname && touched.lastname && <b>{ errors.lastname }</b> }                                    
                                    <p>Password</p>
                                    <Field 
                                        validate={ formSchema }
                                        name="password"                                    
                                        type="password" 
                                    />    
                                    <br />
                                    { errors.password && touched.password && <b>{ errors.password }</b> }                                    
                                    <div className={ loginpannel }>
                                        <button 
                                            disabled={ isSubmitting }
                                            type="submit" 
                                            onClick={ signUpEmail }
                                        >
                                                Sign Up
                                        </button>
                                        <p>Have an account?</p>
                                        <button 
                                            type="button" 
                                            onClick={ () => history.push('/product') }
                                        >
                                            Log in
                                        </button>
                                    </div>       
                                    <br /> 
                                    { exists && <b>Введенные данные некооректны</b> }                                      
                                </Form>
                            )    
                       }                       
                </Formik>          
            </div>
        </div>
    )
}

export default SignUp