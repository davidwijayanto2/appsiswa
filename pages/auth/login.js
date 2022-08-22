import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons"
import Joi from "joi";
import Redirect from 'react-router-dom';
import { useRouter } from 'next/router';
import { loginAPI } from '../../repos/http_requests';
import { validationField } from '../../utils/common_helper';
import { GetServerSidePropsContext } from 'next';
import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { cookieOpt } from '../../utils/common_data';

const stylesTextField = {
    '& label.Mui-focused': {
        color: '#AE2A26',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#AE2A26',
    },
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#AE2A26',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#AE2A26',
        },
    },
}

export function getServerSideProps({ req, res }) {
    const token = getCookie('token', { req, res });
    if (token) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            }
        }
    }
    return {
        props: {}
    }
    // const user = await userFromRequest(context.req);

    // if (user) {
    //     return {
    //         redirect: {
    //             destination: "/",
    //             permanent: false,
    //         },
    //     };
    // }

    // return {
    //     props: {},
    // };
}

export default function login() {
    const [open, setOpen] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [errors, setErrors] = useState([]);

    // const { register, handleSubmit, formState: { errors } } = useForm();

    const router = useRouter();
    // handle toggle 
    const toggle = () => {
        setOpen(!open)
    }

    const processLogin = async () => {
        // errors = schema.validate({ email: emailInput, password: passwordInput });        
        const payload = { email: emailInput, password: passwordInput };
        const schema = Joi.object({
            email: Joi.string().required().email({ tlds: { allow: false } }),
            password: Joi.string().required()
        })

        if (validationField(errors, setErrors, schema, payload)) {
            const response = await loginAPI(emailInput, passwordInput);

            if (response.status == 200) {
                const resJson = await response.json();
                // deleteCookie('access_token', cookieOpt);
                setCookie('token', 'bearer ' + resJson.token, cookieOpt);
                localStorage.setItem('user', JSON.stringify(resJson.data));
                router.push('/');
            } else if (response.status == 401) {
                const resJson = await response.json();
                setErrors({
                    password: resJson.message
                })
            } else {
                alert('Something wrong! try again later!')
            }
        }
    }
    function handleKeyDown(e) {
        e.which = e.which || e.keyCode;

        if (e.which == 13) {
            processLogin();
        }
    }

    return (
        <motion.div
            className="container"
            initial="initial"
            animate="animate"
            exit={{ opacity: 0 }}
        >
            <div className="h-auto w-1/2 rounded-md flex flex-col lg:flex-row mt-10 lg:mt-20 mx-auto shadow-md">
                <div className="flex flex-col w-full lg:w-full py-20 px-10 bg-cover-book bg-cover lg:bg-none shadow-md lg:shadow-none">
                    <div className="bg-white lg:bg-transparent py-10 lg:py-0">
                        <p className="text-4xl font-bold mx-4">Login</p>
                        <div className="mt-10 mx-4 mb-1 flex items-center">
                            <TextField
                                className="w-full"
                                sx={stylesTextField}
                                id="outlined-required"
                                label="Email"
                                placeholder='email@example.com'
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDownCapture={handleKeyDown}
                            />
                        </div>
                        <div className='mx-4 mb-5'>
                            <span style={{ color: "red" }}>
                                {errors.email}
                            </span>
                        </div>
                        <div className="mx-4 relative">
                            <TextField
                                className="w-full"
                                sx={stylesTextField}
                                id="outlined-required"
                                label="Password"
                                placeholder='*****'
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                type={(open === false) ? "password" : "text"}
                                onKeyDownCapture={handleKeyDown}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5">
                                {
                                    (open === false) ? <FontAwesomeIcon icon={faEye} onClick={toggle} /> :
                                        <FontAwesomeIcon icon={faEyeSlash} onClick={toggle} />
                                }
                            </div>
                        </div>
                        <div className='mx-4 mb-5'>
                            <span style={{ color: "red" }}>
                                {errors.password}
                            </span>
                        </div>
                        <div className="flex justify-end mt-3 mx-3">
                            <button
                                type="button"
                                className="border-1 border-transparent bg-primary text-white font-medium text-lg rounded-md px-6 py-2 hover:bg-transparent hover:border-primary hover:color-primary transition-all ease-in-out duration-300"
                                onClick={processLogin}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div >

    );
}