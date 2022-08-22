import React, { useEffect, useState } from 'react';
import Layout from '../../components/layoutadmin';
import {  resetPasswordAPI } from '../../repos/http_requests';
import { useRouter } from 'next/router';
import SubtitleAdmin from '../../components/common/subtitleadmin';
import { validationField } from '../../utils/common_helper';
import { TextField, Tooltip, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TableSortLabel, Box, Paper, TableContainer } from '@mui/material';
import Joi from "joi";

export default function resetPassword() {
    var user;    
    const [open, setOpen] = useState(false);
    const [passwordLamaInput, setPasswordLamaInput] = useState('');
    const [passwordBaruInput, setPasswordBaruInput] = useState('');
    const [ulangiPasswordInput, setUlangiPasswordInput] = useState('');
    const [errors, setErrors] = useState([]);
    const router = useRouter();    

    const resetpassword = async () => {
        // errors = schema.validate({ email: emailInput, password: passwordInput });        
        const payload = { password_lama: passwordLamaInput, password_baru: passwordBaruInput, ulangi_password: ulangiPasswordInput };
        const schema = Joi.object({
            password_lama: Joi.string().required(),
            password_baru: Joi.string().required(),
            ulangi_password: Joi.any().equal(Joi.ref('password_baru')).required().messages({ 'any.only': '{{#label}} does not match' })
        })

        if (validationField(errors, setErrors, schema, payload)) {
            const response = await resetPasswordAPI(passwordLamaInput, passwordBaruInput, ulangiPasswordInput);

            if (response.status == 200) {                
                alert('Berhasil ubah password');
                router.push('/');
            } else if (response.status == 401) {
                const resJson = await response.json();
                alert(resJson.message)
            } else {
                alert('Something wrong! try again later!')
            }
        }
    }

    const toggle = () => {
        setOpen(!open)
    }

    return (
        <Layout title="Ubah Password">
            <div className="h-full container md:px-14">
                <SubtitleAdmin subtitle="Ubah Password" />                
                <div className="flex w-1/2 my-4 px-0 md:px-4 xl:px-2 mx-4 relative">          
                    <TextField
                        className="w-full"                        
                        id="outlined-required"
                        label="Password Lama"
                        placeholder='*****'
                        value={passwordLamaInput}
                        onChange={(e) => setPasswordLamaInput(e.target.value)}
                        type={(open === false) ? "password" : "text"}                        
                        autoFocus
                    />                   
                </div>                
                <div className='mx-4 mb-5'>
                    <span style={{ color: "red" }}>
                        {errors.password_lama ? errors.password_lama.replace("_"," "): ''}
                    </span>
                </div>
                <div className="flex w-1/2 my-4 px-0 md:px-4 xl:px-2 mx-4 relative">
                    <TextField
                        className="w-full"                        
                        id="outlined-required"
                        label="Password Baru"
                        placeholder='*****'
                        value={passwordBaruInput}
                        onChange={(e) => setPasswordBaruInput(e.target.value)}
                        type={(open === false) ? "password" : "text"}                        
                    />                    
                </div>                
                <div className='mx-4 mb-5'>
                    <span style={{ color: "red" }}>
                        {errors.password_baru ? errors.password_baru.replace("_"," "): ''}
                    </span>
                </div>                
                <div className="flex w-1/2 my-4 px-0 md:px-4 xl:px-2 mx-4 relative">
                    <TextField
                        className="w-full"                        
                        id="outlined-required"
                        label="Ulang Password"
                        placeholder='*****'
                        value={ulangiPasswordInput}
                        onChange={(e) => setUlangiPasswordInput(e.target.value)}
                        type={(open === false) ? "password" : "text"}                        
                    />                    
                </div>                
                <div className='mx-4 mb-5'>
                    <span style={{ color: "red" }}>
                        {errors.ulangi_password ? errors.ulangi_password.replace("_"," "): ''}
                    </span>
                </div>
                <div className='flex w-1/2 my-4 px-0 md:px-4 xl:px-2 mx-4 relative'>
                    <button onClick={toggle}>Tampilkan Password</button>
                </div>
                <div className="flex w-1/2 justify-end my-6">
                    <button
                        className="transition-all duration-300 ease-in-out px-4 py-2 rounded-md border-2 border-transparent text-white bg-primary hover:bg-transparent hover:border-primary hover:color-primary"
                        onClick={resetpassword}
                    >
                        <p className="text-xl font-medium">Ubah Password</p>
                    </button>
                </div>
            </div>
        </Layout >
    );
}