import React from 'react'
import { Icon } from '@iconify/react';

export default function footeradmin() {
    return (
        <div className="w-full bg-primary py-4">
            <div className="container mx-auto">
                <div className="flex flex-wrap justify-center md:justify-end">
                    <Icon icon="ph:copyright-fill" width="20" height="20" className="mt-1 text-white"/>
                    <p className="text-base font-normal ml-1 text-white">2022 Data Siswa</p>
                </div>
            </div>
        </div>
    )
}
