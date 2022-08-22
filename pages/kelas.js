import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Layout from '../components/layoutadmin';
import OpenDialog from '../components/parts/opendialog';
import SubtitleAdmin from '../components/common/subtitleadmin';
import { Tooltip, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TableSortLabel, Box, Paper, TableContainer } from '@mui/material';
import PropTypes from 'prop-types';
import { visuallyHidden } from '@mui/utils';
import { getCookie, deleteCookie } from 'cookies-next';
import { addKelasAPI, getAllKelasAPI, getKelasAPI, editKelasAPI, deleteKelasAPI } from '../repos/http_requests';
import { useRouter } from 'next/router';
import { deleteLoginSession, validationField } from '../utils/common_helper';
import Joi from 'joi';
import CurrencyFormat from 'react-currency-format';

const columns = [
    {
        id: 'index',
        numeric: false,
        disablePadding: false,
        label: 'Index',
    },
    {
        id: 'nama_kelas',
        numeric: false,
        disablePadding: false,
        label: 'Nama Kelas',
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

export default function kelas() {
    const [isOpenAdd, setOpenAdd] = useState(false); // for open dialog
    const [isOpenDelete, setOpenDelete] = useState(false);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('index');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [listKelas, setListKelas] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [namaKelasInput, setNamaKelasInput] = useState('');
    const [idKelas, setIdKelas] = useState('');
    const [namaKelas, setNamaKelas] = useState('');
    const router = useRouter();
    const [errors, setErrors] = useState([]);

    useEffect(async () => {
        fetchDataKelas();        
    }, []);

    const fetchDataKelas = async () => {
        setLoading(true);
        const response = await getAllKelasAPI();

        if (response.status == 200) {
            const data = await response.json();
            if (data.data.length > 0 && data.data.length <= ((page) * rowsPerPage)) {
                setPage(page - 1);
            }
            setListKelas(data.data);
            setLoading(false);
        } else if (response.status == 401) {
            setLoading(false);
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
    // end open dialog

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listKelas.length) : 1;

    const clearForm = () => {
        setNamaKelasInput('');
        setIdKelas('');
        setNamaKelas('');
        setEdit(false);
        setErrors([]);
    }

    const openEditForm = async (event, id_kelas) => {
        event.preventDefault();
        setEdit(true);
        const response = await getKelasAPI(id_kelas);
        console.log(response);
        if (response.status == 200) {
            const resJson = await response.json();
            const data = resJson.data;
            setNamaKelasInput(data.namaKelas);
            setIdKelas(id_kelas);
            handleOpenAdd();
        } else if (response.status == 401) {
            deleteLoginSession();
            router.push('/auth/login');
        } else {
            alert('Oops, sorry something wrong! Please try again!')
        }

    }

    const openDeleteForm = async (event, id_kelas, nama_kelas) => {
        event.preventDefault();
        setIdKelas(id_kelas);
        setNamaKelas(nama_kelas);
        handleOpenDelete();
    }

    async function submitKelas() {
        const schema = Joi.object({
            nama_kelas: Joi.string().required()            
        });
        const body = {
            'nama_kelas': namaKelasInput
        }
        if (validationField(errors, setErrors, schema, body)) {
            let response;
            if (!isEdit) {
                response = await addKelasAPI(body);
            } else {
                response = await editKelasAPI(idKelas, body);
            }
            if (response.status == 200) {
                fetchDataKelas();
                handleCloseAdd();
            } else if (response.status == 401) {
                deleteLoginSession();
                router.push('/auth/login');
            } else {
                alert('Oops, sorry something wrong! Please try again!')
            }
        }
    }

    async function deleteKelas() {
        const response = await deleteKelasAPI(idKelas);
        if (response.status == 200) {
            fetchDataKelas();
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
            submitKelas();
        }
    }

    return (
        <Layout title="Kelas" subtitle="Kelas">
            <div className="h-full container md:px-14">
                <SubtitleAdmin subtitle="Master Kelas" />
                <div className="flex justify-end w-full my-4 px-0 md:px-4 xl:px-2">
                    <button
                        onClick={handleOpenAdd}
                        className="py-2 px-4 rounded-md flex items-center bg-primary border-2 border-transparent hover:bg-transparent hover:border-primary hover:color-primary text-white transition-all duration-300 ease-in-out"
                    >
                        <Icon icon="fluent:add-12-filled" width="20" height="20" className="mx-2" />
                        <p className="capitalize font-semibold text-xl">Tambah Kelas</p>
                    </button>
                    <OpenDialog title={!isEdit ? "Tambah Kelas" : "Ubah Kelas"} handleClose={handleCloseAdd} isOpen={isOpenAdd} fullWidthStatus={true} maxValue="sm">
                        <div className="flex flex-col px-1 w-full">
                            <label htmlFor="ingredient_name" className="text-xl font-medium flex capitalize">Nama Kelas<p className="text-red-500 mx-1">*</p></label>
                            <input
                                type="text"
                                className="flex px-2 py-2 text-xl font-medium rounded-md mt-2 focus:outline-none hover:border-primary focus:border-primary border-2 border-slate-300 duration-300 ease-in-out transition-all capitalize"
                                placeholder="Nama Kelas"
                                id="ingredient_name"
                                value={namaKelasInput}
                                onChange={(e) => setNamaKelasInput(e.target.value)}
                                onKeyDownCapture={handleKeyDown}
                                autoFocus
                            />
                            <span style={{ color: "red" }}>
                                {errors.nama_kelas ? errors.nama_kelas.replaceAll("_"," ") : ""}
                            </span>
                        </div>                                                
                        <div className="flex justify-end mt-6">
                            <button
                                className="transition-all duration-300 ease-in-out px-4 py-2 rounded-md border-2 border-transparent text-white bg-primary hover:bg-transparent hover:border-primary hover:color-primary"
                                onClick={submitKelas}
                            >
                                <p className="text-xl font-medium">{!isEdit ? "Tambah" : "Ubah"}</p>
                            </button>
                        </div>
                    </OpenDialog>
                    <OpenDialog title="Hapus Kelas" handleClose={handleCloseDelete} isOpen={isOpenDelete} fullWidthStatus={true} maxValue="sm">
                        <div className='flex justify-center'>
                            <span className='text-xl text-center'>Apakah Anda yakin akan menghapus kelas "{namaKelas}"?</span>
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
                                onClick={deleteKelas}
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
                                        rowCount={listKelas ? listKelas.length : 0}
                                    />
                                    <TableBody>
                                        {                                                                                     
                                            stableSort(listKelas ? listKelas : [], getComparator(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    return (
                                                        <TableRow
                                                            hover
                                                            tabIndex={-1}
                                                            key={row.idKelas}
                                                        >
                                                            <TableCell component="th" scope="row" className="text-xl font-medium">{index + 1 + (rowsPerPage * page)}</TableCell>
                                                            <TableCell className="text-xl font-medium">{row.namaKelas}</TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-row justify-end">
                                                                    <button
                                                                        type="button"
                                                                        onClick={event => openEditForm(event, row.idKelas)}>
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
                                                                        onClick={event => openDeleteForm(event, row.idKelas, row.namaKelas)}>
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
                                count={listKelas ? listKelas.length : 0}
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