import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Layout from '../components/layoutadmin';
import OpenDialog from '../components/parts/opendialog';
import SubtitleAdmin from '../components/common/subtitleadmin';
import { Tooltip, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TableSortLabel, Box, Paper, TableContainer } from '@mui/material';
import PropTypes from 'prop-types';
import { visuallyHidden } from '@mui/utils';
import { getCookie, deleteCookie } from 'cookies-next';
import { addKelasActualAPI, getAllKelasActualAPI, getKelasActualAPI, editKelasActualAPI, deleteKelasActualAPI, getAllGuruAPI, getAllKelasAPI, getAllMataPelajaranAPI, getAllSiswaAPI } from '../repos/http_requests';
import { useRouter } from 'next/router';
import { deleteLoginSession, validationField } from '../utils/common_helper';
import Joi from 'joi';
import CurrencyFormat from 'react-currency-format';
import mataPelajaran from './mataPelajaran';

const columns = [
    {
        id: 'index',
        numeric: false,
        disablePadding: false,
        label: 'Index',
    },
    {
        id: 'kelas',
        numeric: false,
        disablePadding: false,
        label: 'Kelas',
    },    
    {
        id: 'wali_kelas',
        numeric: false,
        disablePadding: false,
        label: 'Wali Kelas',
    },     
    {
        id: 'tahun_ajaran',
        numeric: false,
        disablePadding: false,
        label: 'Tahun Ajaran',
    },        
    {
        id: 'siswa',
        numeric: false,
        disablePadding: false,
        label: 'Daftar Siswa',
    },        
    {
        id: 'mata_pelajaran',
        numeric: false,
        disablePadding: false,
        label: 'Mata Pelajaran',
    },        
    {
        id: '',
        numeric: false,
        disablePadding: false,
        label: '',
    },
]

const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) { return -1; }
    if (b[orderBy] > a[orderBy]) { return 1; }
    return 0;
}

const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);

}

const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const EnhancedTableHead = (props) => {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                {columns.map((headCell) => (
                    <TableCell
                        className="text-xl font-medium"
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {
                                orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null
                            }
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};
// end table

export async function getServerSideProps({ req, res }) {
    const token = getCookie('token', { req, res });
    if (!token) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            }
        }
    }
    return {
        props: {}
    }
}

export default function dataKelas() {
    const [isOpenAdd, setOpenAdd] = useState(false); // for open dialog
    const [isOpenDelete, setOpenDelete] = useState(false);
    const [isOpenSiswa, setOpenSiswa] = useState(false);
    const [isOpenMataPelajaran, setOpenMataPelajaran] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('index');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [listKelasActual, setListKelasActual] = useState(null);
    const [listGuru, setListGuru] = useState(null);
    const [listKelas, setListKelas] = useState(null);
    const [listSiswa, setListSiswa] = useState(null);
    const [listMataPelajaran, setListMataPelajaran] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [kelasInput, setKelasInput] = useState('');
    const [guruInput, setGuruInput] = useState('');    
    const [tahunAjaranInput, setTahunAjaranInput] = useState('');    
    const [siswaInput, setSiswaInput] = useState('');        
    const [mataPelajaranInput, setMataPelajaranInput] = useState('');        
    const [dKelasActual, setDKelasActual] = useState(null);
    const [nilaiMatPel, setNilaiMatPel] = useState(null);
    const [idHKelasActual, setIdHKelasActual] = useState('');
    const router = useRouter();
    const [errors, setErrors] = useState([]);

    useEffect(async () => {
        fetchDataKelasActual();        
        fetchDataKelas();  
        fetchDataGuru();  
        fetchDataSiswa();  
        fetchDataMataPelajaran();  
    }, []);

    const fetchDataKelasActual = async () => {
        setLoading(true);
        const response = await getAllKelasActualAPI();

        if (response.status == 200) {
            const data = await response.json();
            if (data.data.length > 0 && data.data.length <= ((page) * rowsPerPage)) {
                setPage(page - 1);
            }
            setListKelasActual(data.data);
            setLoading(false);
        } else if (response.status == 401) {
            setLoading(false);
            deleteLoginSession();
            router.push('/auth/login');
        }
    }    

    const fetchDataSiswa = async () => {        
        const response = await getAllSiswaAPI();

        if (response.status == 200) {
            const data = await response.json();            
            setListSiswa(data.data);            
        } else if (response.status == 401) {            
            deleteLoginSession();
            router.push('/auth/login');
        }
    }    

    const fetchDataGuru = async () => {        
        const response = await getAllGuruAPI();

        if (response.status == 200) {
            const data = await response.json();            
            setListGuru(data.data);            
        } else if (response.status == 401) {            
            deleteLoginSession();
            router.push('/auth/login');
        }
    }    

    const fetchDataKelas = async () => {        
        const response = await getAllKelasAPI();

        if (response.status == 200) {
            const data = await response.json();            
            setListKelas(data.data);            
        } else if (response.status == 401) {            
            deleteLoginSession();
            router.push('/auth/login');
        }
    }    

    const fetchDataMataPelajaran = async () => {        
        const response = await getAllMataPelajaranAPI();

        if (response.status == 200) {
            const data = await response.json();            
            setListMataPelajaran(data.data);            
        } else if (response.status == 401) {            
            deleteLoginSession();
            router.push('/auth/login');
        }
    }    

    // pagination
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    // end pagination

    // open dialog
    const handleOpenAdd = () => { setOpenAdd(true); }
    const handleCloseAdd = () => {
        setOpenAdd(false);
        clearForm();
    }
    const handleOpenDelete = () => { setOpenDelete(true); }
    const handleCloseDelete = () => { setOpenDelete(false); }
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
    // end open dialog

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listKelasActual.length) : 1;

    const clearForm = () => {
        setKelasInput('');
        setGuruInput('');        
        setTahunAjaranInput('');
        setSiswaInput('');        
        setMataPelajaranInput('');        
        setDKelasActual(null);
        setNilaiMatPel(null);
        setIdHKelasActual('');
        setEdit(false);
        setErrors([]);
    }

    const openEditForm = async (event, id_kelas_actual) => {
        event.preventDefault();
        setEdit(true);
        const response = await getKelasActualAPI(id_kelas_actual);        
        if (response.status == 200) {
            const resJson = await response.json();
            const data = resJson.data;
            setKelasInput(data.idKelas);
            setGuruInput(data.idGuru);            
            setTahunAjaranInput(data.tahunAjaran);            
            var dKelasData= [],matPelData = [];
            for(var i = 0; i< data.dKelasActual.length;i++){
                dKelasData =  [...dKelasData, {'idSiswa': data.dKelasActual[i].idSiswa,'namaSiswa': data.dKelasActual[i].siswa.namaSiswa}];
            }            
            for(var i = 0; i< data.dKelasActual[0].nilaiMatPel.length;i++){
                matPelData =  [...matPelData, {'idMataPelajaran': data.dKelasActual[0].nilaiMatPel[i].idNilai,'namaMataPelajaran': data.dKelasActual[0].nilaiMatPel[i].mataPelajaran.namaMataPelajaran}];
            }
            
            setDKelasActual(dKelasData);                        
            setNilaiMatPel(matPelData);  
                      
            setIdHKelasActual(id_kelas_actual);
            handleOpenAdd();
        } else if (response.status == 401) {
            deleteLoginSession();
            router.push('/auth/login');
        } else {
            alert('Oops, sorry something wrong! Please try again!')
        }

    }

    const openDeleteForm = async (event, id_kelas_actual) => {
        event.preventDefault();
        setIdHKelasActual(id_kelas_actual);        
        handleOpenDelete();
    }

    async function submitKelasActual() {
        const schema = Joi.object({
            kelas: Joi.string().required(),
            guru: Joi.string().required(),
            tahun_ajaran: Joi.string().required(),            
            data_siswa: Joi.array().required(),
            data_mata_pelajaran: Joi.array().required()
        });
        const body = {
            'kelas': kelasInput.toString(),
            'guru': guruInput.toString(),
            'tahun_ajaran': tahunAjaranInput,            
            'data_siswa': dKelasActual,
            'data_mata_pelajaran': nilaiMatPel
        }
        if (validationField(errors, setErrors, schema, body)) {
            let response;
            if (!isEdit) {
                response = await addKelasActualAPI(body);
            } else {
                response = await editKelasActualAPI(idHKelasActual, body);
            }
            if (response.status == 200) {
                fetchDataKelasActual();
                handleCloseAdd();
            } else if (response.status == 401) {
                deleteLoginSession();
                router.push('/auth/login');
            } else {
                alert('Oops, sorry something wrong! Please try again!')
            }
        }
    }

    async function deleteKelasActual() {
        const response = await deleteKelasActualAPI(idHKelasActual);
        if (response.status == 200) {
            fetchDataKelasActual();
            handleCloseDelete();
            const data = await response.json();                        
            clearForm();
        } else if (response.status == 401) {
            deleteLoginSession();
            router.push('/auth/login');
        } else {
            alert('Oops, sorry something went wrong! Please try again!')
        }
    }

    function handleKeyDown(e) {
        e.which = e.which || e.keyCode;

        if (e.which == 13) {
            submitKelasActual();
        }
    }
    
    const  tambahSiswa = ()=> {
        if(siswaInput != ''){
            const idSiswa = siswaInput.split('|');
            const data = dKelasActual ? dKelasActual : [];
            const newData = [...data, {'idSiswa': idSiswa[0],'namaSiswa': idSiswa[1]}];                
            setDKelasActual(newData);
            setSiswaInput('');        
        }
        
    }

    const  tambahMataPelajaran = ()=> {
        if(mataPelajaranInput != ''){
            const idMataPelajaran = mataPelajaranInput.split('|');
            const data = nilaiMatPel ? nilaiMatPel : [];
            const newData = [...data, {'idMataPelajaran': idMataPelajaran[0],'namaMataPelajaran': idMataPelajaran[1]}];
            setNilaiMatPel(newData);
            setMataPelajaranInput('');
        }
        
    }

    const deleteSiswa = (event, index) => {
        const data = dKelasActual ? dKelasActual : [];
        setDKelasActual(data.filter((value, i) => i !== index));        
    }

    const deleteMataPelajaran = (event, index) => {
        const data = nilaiMatPel ? nilaiMatPel : [];
        setNilaiMatPel(data.filter((value, i) => i !== index));        
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
    
    return (
        <Layout title="Data Kelas" subtitle="Data Kelas">
            <div className="h-full container md:px-14">
                <SubtitleAdmin subtitle="Data Kelas" />
                <div className="flex justify-end w-full my-4 px-0 md:px-4 xl:px-2">
                    <button
                        onClick={handleOpenAdd}
                        className="py-2 px-4 rounded-md flex items-center bg-primary border-2 border-transparent hover:bg-transparent hover:border-primary hover:color-primary text-white transition-all duration-300 ease-in-out"
                    >
                        <Icon icon="fluent:add-12-filled" width="20" height="20" className="mx-2" />
                        <p className="capitalize font-semibold text-xl">Tambah Data Kelas</p>
                    </button>
                    <OpenDialog title={!isEdit ? "Tambah Data Kelas" : "Ubah Data Kelas"} handleClose={handleCloseAdd} isOpen={isOpenAdd} fullWidthStatus={true} maxValue="sm">
                        <div className="flex flex-col px-1 w-full mt-2">
                            <label htmlFor="kelas" className="text-xl font-medium flex capitalize">Kelas<p className="text-red-500 mx-1">*</p></label>
                            <select value={kelasInput} onChange={(e) => setKelasInput(e.target.value)} id="kelas" className="px-2 py-2 text-xl font-medium rounded-md mt-2 focus:outline-none hover:border-primary focus:border-primary border-2 border-slate-300 duration-300 ease-in-out transition-all capitalize bg-transparent">
                                <option key={0} value="" className="bg-white">Pilih kelas</option>
                                {
                                    listKelas ? listKelas.map((kelas, i) => (
                                        <option key={kelas.idKelas} value={kelas.idKelas} className="bg-white">{kelas.namaKelas}</option>
                                    )) : <option value="" className="bg-white"></option>
                                }
                            </select>
                            <span style={{ color: "red" }}>
                                {errors.kelas}
                            </span>
                        </div>
                        <div className="flex flex-col px-1 w-full mt-2">
                            <label htmlFor="guru" className="text-xl font-medium flex capitalize">Wali Kelas<p className="text-red-500 mx-1">*</p></label>
                            <select value={guruInput} onChange={(e) => setGuruInput(e.target.value)} id="guru" className="px-2 py-2 text-xl font-medium rounded-md mt-2 focus:outline-none hover:border-primary focus:border-primary border-2 border-slate-300 duration-300 ease-in-out transition-all capitalize bg-transparent">
                                <option key={0} value="" className="bg-white">Pilih wali kelas</option>
                                {
                                    listGuru ? listGuru.map((guru, i) => (
                                        <option key={guru.idGuru} value={guru.idGuru} className="bg-white">{guru.namaGuru}</option>
                                    )) : <option value="" className="bg-white"></option>
                                }
                            </select>
                            <span style={{ color: "red" }}>
                                {errors.guru}
                            </span>
                        </div>
                        <div className="flex flex-col px-1 w-full">
                            <label htmlFor="tahun_ajaran" className="text-xl font-medium flex capitalize">Tahun Ajaran<p className="text-red-500 mx-1">*</p></label>
                            <input
                                type="text"
                                className="flex px-2 py-2 text-xl font-medium rounded-md mt-2 focus:outline-none hover:border-primary focus:border-primary border-2 border-slate-300 duration-300 ease-in-out transition-all"
                                placeholder="Tahun ajaran"
                                id="tahun_ajaran"                                
                                value={tahunAjaranInput}
                                onChange={(e) => setTahunAjaranInput(e.target.value)}
                                maxLength = "10"
                                onKeyDownCapture={handleKeyDown}                                                                
                            />
                            <span style={{ color: "red" }}>
                                {errors.tahun_ajaran ? errors.tahun_ajaran.replaceAll("_"," ") : ""}
                            </span>
                        </div>                           
                        <div className="flex flex-col px-1 w-full mt-2">
                            <label htmlFor="siswa" className="text-xl font-medium flex capitalize">Siswa<p className="text-red-500 mx-1">*</p></label>
                            <div className='flex justify-between'>
                                <select value={siswaInput} onChange={(e)=> setSiswaInput(e.target.value)} id="siswa" className="w-full px-2 py-2 text-xl font-medium rounded-md mt-2 focus:outline-none hover:border-primary focus:border-primary border-2 border-slate-300 duration-300 ease-in-out transition-all capitalize bg-transparent">
                                    <option key={0} value="" className="bg-white">Pilih siswa</option>
                                    {
                                        listSiswa ? listSiswa.map((siswa, i) => (
                                            <option key={siswa.idSiswa} value={`${siswa.idSiswa}|${siswa.namaSiswa}`} className="bg-white">{siswa.namaSiswa}</option>
                                        )) : <option value="" className="bg-white"></option>
                                    }
                                </select>
                                <button 
                                    className='ml-4 transition-all duration-300 ease-in-out px-4 py-2 rounded-md border-2 border-transparent text-white bg-primary hover:bg-transparent hover:border-primary hover:color-primary'
                                    onClick={tambahSiswa}>
                                    Tambah Siswa</button>
                            </div>
                                                        
                        </div>                        
                        <Table className='mt-2'>                            
                            <TableBody>
                            {                                
                                dKelasActual ? dKelasActual.map((dkelas, i) => (
                                    <TableRow
                                        key={dkelas.idSiswa}
                                    >
                                        <TableCell component="th" scope="row">{i+1}</TableCell>
                                        <TableCell>{dkelas.namaSiswa}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-row justify-end">                                                
                                                <button
                                                    type="button"
                                                    onClick={event => deleteSiswa(event, i)}>
                                                    <div className="group mx-2 px-1 py-1 border-1 border-black rounded-md text-black group-hover:bg-primary group-hover:border-primary">
                                                        <a className="group-hover:text-white">
                                                            <Tooltip title="Hapus">
                                                                <Icon icon="fluent:delete-24-regular" width="15" height="15" />
                                                            </Tooltip>
                                                        </a>
                                                    </div>
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )):[]
                            }
                            </TableBody>
                            
                        </Table>
                        <span style={{ color: "red" }}>
                                {errors.data_siswa}
                            </span>
                        <div className="flex flex-col px-1 w-full mt-2">
                            <label htmlFor="mata_pelajaran" className="text-xl font-medium flex capitalize">Mata Pelajaran<p className="text-red-500 mx-1">*</p></label>
                            <div className='flex justify-between'>
                                <select value={mataPelajaranInput} onChange={(e)=> setMataPelajaranInput(e.target.value)} id="siswa" className="w-full px-2 py-2 text-xl font-medium rounded-md mt-2 focus:outline-none hover:border-primary focus:border-primary border-2 border-slate-300 duration-300 ease-in-out transition-all capitalize bg-transparent">
                                    <option key={0} value="" className="bg-white">Pilih mata pelajaran</option>
                                    {
                                        listMataPelajaran ? listMataPelajaran.map((mataPelajaran, i) => (
                                            <option key={mataPelajaran.idMataPelajaran} value={`${mataPelajaran.idMataPelajaran}|${mataPelajaran.namaMataPelajaran}`} className="bg-white">{mataPelajaran.namaMataPelajaran}</option>
                                        )) : <option value="" className="bg-white"></option>
                                    }
                                </select>
                                <button 
                                    className='ml-4 transition-all duration-300 ease-in-out px-4 py-2 rounded-md border-2 border-transparent text-white bg-primary hover:bg-transparent hover:border-primary hover:color-primary'
                                    onClick={tambahMataPelajaran}>
                                    Tambah MatPel</button>
                            </div>
                                                        
                        </div>                        
                        <Table className='mt-2'>                            
                            <TableBody>
                            {                                
                                nilaiMatPel ? nilaiMatPel.map((matPel, i) => (
                                    <TableRow
                                        key={matPel.idMataPelajaran}
                                    >
                                        <TableCell component="th" scope="row">{i+1}</TableCell>
                                        <TableCell>{matPel.namaMataPelajaran}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-row justify-end">                                                
                                                <button
                                                    type="button"
                                                    onClick={event => deleteMataPelajaran(event, i)}>
                                                    <div className="group mx-2 px-1 py-1 border-1 border-black rounded-md text-black group-hover:bg-primary group-hover:border-primary">
                                                        <a className="group-hover:text-white">
                                                            <Tooltip title="Hapus">
                                                                <Icon icon="fluent:delete-24-regular" width="15" height="15" />
                                                            </Tooltip>
                                                        </a>
                                                    </div>
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )):[]
                            }
                            </TableBody>
                            
                        </Table>
                        <span style={{ color: "red" }}>
                                {errors.data_mata_pelajaran}
                            </span>
                        <div className="flex justify-end mt-6">
                            <button
                                className="transition-all duration-300 ease-in-out px-4 py-2 rounded-md border-2 border-transparent text-white bg-primary hover:bg-transparent hover:border-primary hover:color-primary"
                                onClick={submitKelasActual}
                            >
                                <p className="text-xl font-medium">{!isEdit ? "Tambah" : "Ubah"}</p>
                            </button>
                        </div>
                    </OpenDialog>
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
                    <OpenDialog title="Hapus Data Kelas" handleClose={handleCloseDelete} isOpen={isOpenDelete} fullWidthStatus={true} maxValue="sm">
                        <div className='flex justify-center'>
                            <span className='text-xl text-center'>Apakah Anda yakin akan menghapus data kelas ini?</span>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                className="w-full mr-4 transition-all duration-300 ease-in-out px-4 py-2 rounded-md border-2 border-primary color-primary bg-transparent hover:bg-primary hover:border-transparent hover:text-white"
                                onClick={handleCloseDelete}
                            >
                                <p className="text-xl font-medium">Batal</p>
                            </button>
                            <button
                                className="w-full ml-4 transition-all duration-300 ease-in-out px-4 py-2 rounded-md border-2 border-transparent text-white bg-primary hover:bg-transparent hover:border-primary hover:color-primary"
                                onClick={deleteKelasActual}
                            >
                                <p className="text-xl font-medium">Hapus</p>
                            </button>
                        </div>
                    </OpenDialog>
                </div>
                <div className="w-full z-30">
                    {isLoading ? <div>Loading.....</div> :
                        <Paper sx={{ width: '100%', overflow: 'hidden' }} className="bg-transparent">
                            <TableContainer>
                                <Table>
                                    <EnhancedTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                        rowCount={listKelasActual ? listKelasActual.length : 0}
                                    />
                                    <TableBody>
                                        {                                                                                     
                                            stableSort(listKelasActual ? listKelasActual : [], getComparator(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    return (
                                                        <TableRow
                                                            hover
                                                            tabIndex={-1}
                                                            key={row.idHKelasActual}
                                                        >
                                                            <TableCell component="th" scope="row" className="text-xl font-medium">{index + 1 + (rowsPerPage * page)}</TableCell>
                                                            <TableCell className="text-xl font-medium">{row.kelas.namaKelas}</TableCell>
                                                            <TableCell className="text-xl font-medium">{row.guru.namaGuru}</TableCell>
                                                            <TableCell className="text-xl font-medium">{row.tahunAjaran}</TableCell>
                                                            {/* <TableCell className="text-xl font-medium">{row.avgNilaiInput}</TableCell>                                                             */}
                                                            <TableCell>
                                                                <div className="flex flex-row justify-end">
                                                                    <button
                                                                        type="button"
                                                                        onClick={event => showSiswa(event, row.dKelasActual)}>
                                                                        <div className="group mx-2 px-1 py-1 border-1 border-black rounded-md text-black group-hover:border-secondary group-hover:bg-secondary">
                                                                            <a className="group-hover:text-white">
                                                                                <Tooltip title="Detail Siswa">
                                                                                    <Icon icon="bxs:detail" width="30" height="30" />
                                                                                </Tooltip>
                                                                            </a>
                                                                        </div>
                                                                    </button>                                                                    
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-row justify-end">
                                                                    <button
                                                                        type="button"
                                                                        onClick={event => showMataPelajaran(event, row.dKelasActual[0].nilaiMatPel)}>
                                                                        <div className="group mx-2 px-1 py-1 border-1 border-black rounded-md text-black group-hover:border-secondary group-hover:bg-secondary">
                                                                            <a className="group-hover:text-white">
                                                                                <Tooltip title="Detail Mata Pelajaran">
                                                                                    <Icon icon="bxs:detail" width="30" height="30" />
                                                                                </Tooltip>
                                                                            </a>
                                                                        </div>
                                                                    </button>                                                                    
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-row justify-end">
                                                                    <button
                                                                        type="button"
                                                                        onClick={event => openEditForm(event, row.idHKelasActual)}>
                                                                        <div className="group mx-2 px-1 py-1 border-1 border-black rounded-md text-black group-hover:border-secondary group-hover:bg-secondary">
                                                                            <a className="group-hover:text-white">
                                                                                <Tooltip title="Ubah">
                                                                                    <Icon icon="bxs:edit" width="30" height="30" />
                                                                                </Tooltip>
                                                                            </a>
                                                                        </div>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={event => openDeleteForm(event, row.idHKelasActual)}>
                                                                        <div className="group mx-2 px-1 py-1 border-1 border-black rounded-md text-black group-hover:bg-primary group-hover:border-primary">
                                                                            <a className="group-hover:text-white">
                                                                                <Tooltip title="Hapus">
                                                                                    <Icon icon="fluent:delete-24-regular" width="30" height="30" />
                                                                                </Tooltip>
                                                                            </a>
                                                                        </div>
                                                                    </button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={3}>Data Tidak Ditemukan</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={listKelasActual ? listKelasActual.length : 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>}

                </div>
            </div >
        </Layout >
    );
}