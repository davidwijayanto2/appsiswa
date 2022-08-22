import prisma from "../../../config/prisma";
import Joi from "joi";
import { createRouter } from "next-connect";
import isSiswa from "../../../middlewares/isSiswa";
import isAuth from "../../../middlewares/isAuth";
import validate from "../../../middlewares/validation";
import {SMTPClient} from 'emailjs';

const schema = Joi.object({
    nama_siswa: Joi.string().required(),    
    alamat: Joi.string().required(),    
    jenis_kelamin: Joi.string().required(),
    no_hp: Joi.string().required(),
    email: Joi.string().required().email()
});

const router = createRouter();

export default router
    .get(async (req, res, __) => {
        isAuth(req, res, __, async function (req, res, user) {
            const idSiswa = req.query.idSiswa;
            isSiswa(res, user, idSiswa);            
            const listSiswa = await prisma.siswa.findFirst({
                where: { idSiswa: parseInt(idSiswa), statusSiswa: 1 },
                select: {
                    idSiswa: true,
                    namaSiswa: true,
                    alamat: true,
                    noHP: true,
                    jenisKelamin: true,
                    photoProfile: true,
                    statusSiswa: true,
                    user: {
                        select: {
                            email: true
                        }
                    },
                    dKelasActual: {           
                        orderBy: {
                            idHKelasActual: 'desc'
                        },         
                        select: {
                            totalNilai: true,
                            nilaiMatPel: {
                                select: {
                                    nilai: true,
                                    mataPelajaran: true
                                }
                            },
                            hKelasActual: {                                   
                                select: {
                                    idHKelasActual: true,
                                    tahunAjaran: true,
                                    kelas: true,
                                    guru: {
                                        select: {
                                            idGuru: true,
                                            namaGuru: true,
                                            alamat: true,
                                            jenisKelamin: true,
                                            noHP: true,
                                            statusGuru: true,
                                            user: {
                                                select: {
                                                    email: true
                                                }
                                            },
                                        }
                                    },
                                    dKelasActual: {
                                        select: {
                                            idDKelasActual: true,                                            
                                            siswa: true,
                                            totalNilai:true
                                        }
                                    }
                                }                                
                            },
                        }
                    }
                },                
            });            
            res.status(200).json({ data: listSiswa });
        })
    })    
    .handler({
        onError: (err, _, res, __) => {
            console.error(err.stack);
            return res.status(500).end("Something wrong!");
        },
        onNoMatch: (_, res) => {
            return res.status(404).end("Page is not found");
        },
    });