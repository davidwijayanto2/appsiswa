import React, { useEffect, useState } from 'react';
import Layout from '../components/layoutadmin';
import { Icon } from '@iconify/react';
import {getProfileAPI } from '../repos/http_requests';
import { useRouter } from 'next/router';
import { deleteLoginSession } from '../utils/common_helper';
import localStorage from 'localStorage';
import SubtitleAdmin from '../components/common/subtitleadmin';
import OpenDialog from '../components/parts/opendialog';
import { Tooltip, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TableSortLabel, Box, Paper, TableContainer } from '@mui/material';

export default function dataSiswa() {
    var user;
    const [isLoading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [isOpenSiswa, setOpenSiswa] = useState(false);
    const [isOpenMataPelajaran, setOpenMataPelajaran] = useState(false);
    const [isOpenGuru, setOpenGuru] = useState(false);    
    const [dKelasActual, setDKelasActual] = useState(null);
    const [nilaiMatPel, setNilaiMatPel] = useState(null);
    const [guru, setGuru] = useState(null);
    const router = useRouter();

    useEffect(async () => {
        user = JSON.parse(localStorage.getItem('user'));
        fetchDataProfile();
    }, []);

    const fetchDataProfile = async () => {
        setLoading(true);
        console.log(user);
        const response = await getProfileAPI(user.id);

        if (response.status == 200) {
            const data = await response.json();            
            setProfile(data.data);
            setLoading(false);
        } else if (response.status == 401) {
            setLoading(false);
            deleteLoginSession();
            router.push('/auth/login');
        }
    }       

    const handleOpenSiswa = () => { setOpenSiswa(true); }
    const handleCloseSiswa = () => { 
        setOpenSiswa(false); 
        setDKelasActual(null);
    }
    const handleOpenMataPelajaran = () => { setOpenMataPelajaran(true); }
    const handleCloseMataPelajaran = () => { 
        setOpenMataPelajaran(false); 
        setNilaiMatPel(null);
    }
    const handleOpenGuru = () => { setOpenGuru(true); }
    const handleCloseGuru = () => { 
        setOpenGuru(false); 
        setGuru(null);
    }
    
    const showSiswa = (event, dSiswa) => {        
        var dKelasData = [];        
        for(var i = 0; i< dSiswa.length;i++){
            dKelasData =  [...dKelasData, {'idSiswa': dSiswa[i].idSiswa,'namaSiswa': dSiswa[i].siswa.namaSiswa}];
        }            
        
        setDKelasActual(dKelasData);
        handleOpenSiswa();
    }

    const showMataPelajaran = (event, dMataPelajaran) => {
        var matPelData = [];
        console.log(dMataPelajaran);
        for(var i = 0; i< dMataPelajaran.length;i++){
            matPelData =  [...matPelData, {'idMataPelajaran': dMataPelajaran[i].idNilai,'namaMataPelajaran': dMataPelajaran[i].mataPelajaran.namaMataPelajaran}];
        }        
        setNilaiMatPel(matPelData); 
        handleOpenMataPelajaran(); 
    }

    const showGuru = (event, guru) => {        
        setGuru(guru); 
        handleOpenGuru(); 
    }

    return (
        <Layout title="Data Anda">
            <div className="h-full container md:px-14">
                <SubtitleAdmin subtitle="Data Anda" />
                <OpenDialog title="Data Siswa" handleClose={handleCloseSiswa} isOpen={isOpenSiswa} fullWidthStatus={true} maxValue="sm">                                            
                    <Table className='mt-2'>                            
                        <TableBody>
                        {                                
                            dKelasActual ? dKelasActual.map((dkelas, i) => (
                                <TableRow
                                    key={dkelas.idSiswa}
                                >
                                    <TableCell component="th" scope="row">{i+1}</TableCell>
                                    <TableCell>{dkelas.namaSiswa}</TableCell>                                        
                                </TableRow>
                            )):[]
                        }
                        </TableBody>
                        
                    </Table>                        
                </OpenDialog>
                <OpenDialog title="Data Mata Pelajaran" handleClose={handleCloseMataPelajaran} isOpen={isOpenMataPelajaran} fullWidthStatus={true} maxValue="sm">
                    <Table className='mt-2'>                            
                        <TableBody>
                        {                                
                            nilaiMatPel ? nilaiMatPel.map((matPel, i) => (
                                <TableRow
                                    key={matPel.idMataPelajaran}
                                >
                                    <TableCell component="th" scope="row">{i+1}</TableCell>
                                    <TableCell>{matPel.namaMataPelajaran}</TableCell>                                
                                </TableRow>
                            )):[]
                        }
                        </TableBody>
                        
                    </Table>                        
                </OpenDialog>
                <OpenDialog title="Profil Wali Kelas" handleClose={handleCloseGuru} isOpen={isOpenGuru} fullWidthStatus={true} maxValue="sm">
                    <div className="flex w-full mb-4 px-0 md:px-4 xl:px-2">
                        <p className="text-xl capitalize">Nama: {guru ? guru.namaGuru : ''}</p>
                    </div>
                    <div className="flex w-full my-4 px-0 md:px-4 xl:px-2">
                        <p className="text-xl">Email: {guru ? guru.user[0].email : ''}</p>
                    </div>
                    <div className="flex w-full my-4 px-0 md:px-4 xl:px-2">
                        <p className="text-xl">Alamat: {guru ? guru.alamat : ''}</p>
                    </div>
                    <div className="flex w-full my-4 px-0 md:px-4 xl:px-2">
                        <p className="text-xl">No HP: {guru ? guru.noHP : ''}</p>
                    </div>
                    <div className="flex w-full my-4 px-0 md:px-4 xl:px-2">
                        <p className="text-xl">Jenis Kelamin: {guru ? guru.jenisKelamin == 'L' ? "Laki-laki" : "Perempuan" : ''}</p>
                    </div>     
                </OpenDialog>
                <div className="flex w-full my-4 px-0 md:px-4 xl:px-2">
                    <p className="text-xl capitalize">Nama: {profile ? profile.namaSiswa : ''}</p>
                </div>
                <div className="flex w-full my-4 px-0 md:px-4 xl:px-2">
                    <p className="text-xl">Email: {profile ? profile.user[0].email : ''}</p>
                </div>
                <div className="flex w-full my-4 px-0 md:px-4 xl:px-2">
                    <p className="text-xl">Alamat: {profile ? profile.alamat : ''}</p>
                </div>
                <div className="flex w-full my-4 px-0 md:px-4 xl:px-2">
                    <p className="text-xl">No HP: {profile ? profile.noHP : ''}</p>
                </div>
                <div className="flex w-full my-4 px-0 md:px-4 xl:px-2">
                    <p className="text-xl">Jenis Kelamin: {profile ? profile.jenisKelamin == 'L' ? "Laki-laki" : "Perempuan" : ''}</p>
                </div>     
                <div className="flex w-full my-4 px-0 md:px-4 xl:px-2">
                    <p className="text-xl">Kelas Sekarang: {profile ? profile.dKelasActual[0].hKelasActual.kelas.namaKelas : ''}</p>
                </div>     
                <div className="flex w-full my-4 px-0 md:px-4 xl:px-2">
                    <p className="text-xl">Tahun Ajaran: {profile ? profile.dKelasActual[0].hKelasActual.tahunAjaran : ''}</p>
                </div>     
                <div className="flex w-full mt-4 px-0 md:px-4 xl:px-2">
                    <p className="text-xl font-bold">Riwayat Kelas</p>
                </div>
                <div className="flex w-full">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="text-xl font-medium">No</TableCell>
                                <TableCell className="text-xl font-medium">Kelas</TableCell>
                                <TableCell className="text-xl font-medium">Wali Kelas</TableCell>
                                <TableCell className="text-xl font-medium">Tahun Ajaran</TableCell>
                                <TableCell className="text-xl font-medium" padding='none'>Daftar Siswa</TableCell>
                                <TableCell className="text-xl font-medium" padding='none'>Mata Pelajaran</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                profile ? profile.dKelasActual.map((row, index)=>{
                                    return (
                                        <TableRow>                                            
                                            <TableCell component="th" scope="row" className="text-xl font-medium">{index + 1}</TableCell>
                                            <TableCell className="text-xl font-medium">{row.hKelasActual.kelas.namaKelas}</TableCell>
                                            <TableCell className="text-xl font-medium items-baseline capitalize" padding='none'>
                                                {row.hKelasActual.guru.jenisKelamin == "L" ? "Mr" :"Ms"} {row.hKelasActual.guru.namaGuru}<button
                                                        type="button"
                                                        onClick={event => showGuru(event, row.hKelasActual.guru)}>
                                                        <div className="group mx-2 px-1 py-1 border-1 border-black rounded-md text-black group-hover:border-secondary group-hover:bg-secondary">
                                                            <a className="group-hover:text-white">
                                                                <Tooltip title="Profil Guru">
                                                                    <Icon icon="bxs:detail" width="20" height="20" />
                                                                </Tooltip>
                                                            </a>
                                                        </div>
                                                    </button>                                                                    
                                            </TableCell>
                                            <TableCell className="text-xl font-medium">{row.hKelasActual.tahunAjaran}</TableCell>                                            
                                            <TableCell className="text-xl font-medium items-baseline" padding='none'>
                                                <div className="justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={event => showSiswa(event, row.hKelasActual.dKelasActual)}>
                                                        <div className="group mx-2 px-1 py-1 border-1 border-black rounded-md text-black group-hover:border-secondary group-hover:bg-secondary">
                                                            <a className="group-hover:text-white">
                                                                <Tooltip title="Detail Siswa">
                                                                    <Icon icon="bxs:detail" width="20" height="20" />
                                                                </Tooltip>
                                                            </a>
                                                        </div>
                                                    </button>                                                                    
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xl font-medium items-baseline" padding='none'>
                                                <div className="justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={event => showMataPelajaran(event, row.nilaiMatPel)}>
                                                        <div className="group mx-2 px-1 py-1 border-1 border-black rounded-md text-black group-hover:border-secondary group-hover:bg-secondary">
                                                            <a className="group-hover:text-white">
                                                                <Tooltip title="Detail Mata Pelajaran">
                                                                    <Icon icon="bxs:detail" width="20" height="20" />
                                                                </Tooltip>
                                                            </a>
                                                        </div>
                                                    </button>                                                                    
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                                : <div></div>
                            }
                        </TableBody>
                    </Table>
                </div>                

            </div>
        </Layout >
    );
}