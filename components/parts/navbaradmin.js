import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Avatar, Stack, Tooltip } from '@mui/material';
import { Icon } from '@iconify/react';
import { deleteLoginSession } from '../../utils/common_helper';
import localStorage from 'localStorage';


export default function navbaradmin({ isShow, setShow, subtitle }) {
    const [isProfile, setShowProfile] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, [])

    const setChangeMenuHamburger = (e) => {
        setMenuHamburger(e.target.checked);
    }

    const setChangeMenuProfile = (e) => {
        setShowProfile(e.target.checked);
    }
    const router = useRouter();

    const logout = () => {
        deleteLoginSession();
        router.push('/auth/login');
    }
    return (
        <header className="bg-white sticky top-0 flex flex-wrap items-center shadow-sm py-4 md:py-3 sm:py-4 px-4 z-40">
            <div className='container flex justify-between'>
                {/* Title */}
                <div className="hidden lg:flex items-center">
                    <p className="leading-4 text-2xl font-semibold text-slate-600 uppercase">{subtitle}</p>
                </div>
                {/* end Title */}
                <div className="flex flex-row lg:hidden">
                    {/* logo */}
                    <div className="hidden sm:flex justify-center items-center border-r-1 border-gray-400">
                        <div>
                            <img src="/assets/images/logo.png" alt="logo" className="w-8" />
                        </div>
                        <div className="flex flex-wrap w-1/2 mx-1">
                            <p className="text-base font-semibold uppercase leading-4">Data Siswa</p>
                        </div>
                    </div>
                    {/* end logo */}
                    {/* icon humbuger mode mobile */}
                    <div className="text-black mx-1 sm:mx-3 px-2 py-2 rounded-md border-black border-2 hover:border-primary hover:color-primary">
                        <Tooltip title="Menu">
                            <label htmlFor="menu-toggle" className='pointer-cursor'>
                                <Icon
                                    icon={
                                        (isShow) ?
                                            "eva:close-outline" :
                                            "heroicons-outline:menu-alt-4"
                                    }
                                    width="30"
                                    height="30"
                                    className={
                                        (isShow) ?
                                            "border-1 border-transparent transition-all duration-300 rotate-90" :
                                            "border-1 border-transparent transition-all duration-300 rotate-0"
                                    }
                                />
                            </label>
                        </Tooltip>
                        <input
                            className="hidden"
                            type="checkbox"
                            id="menu-toggle"
                            checked={isShow}
                            onChange={(e) => setShow(e.target.checked)}
                        />
                    </div>
                    {/* end icon humbuger mode mobile */}
                </div>


                {/* profile */}
                <div className='flex w-[10rem] md:w-[11rem] lg:w-[12rem] xl:w-[15rem] justify-end'>
                    <Tooltip title={user ? user.nama : ""}>
                        <div className="flex-col pr-1 border-r-1 border-slate-300">
                            <p className="font-semibold text-lg line-clamp-1 text-ellipsis">{user ? user.nama : ""}</p>
                            <p className="font-light text-sm italic text-slate-500">{user ? user.type : ""}</p>
                        </div>
                    </Tooltip>
                    <div className="flex sm:mx-1 mx-2">
                        <Tooltip title="Keluar">
                            <button onClick={logout} className="bg-transparent hover:color-primary">
                                <Icon icon="fluent:arrow-exit-20-regular" width="30" height="30" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
                {/* end profile */}

            </div>
        </header>
    )
}
