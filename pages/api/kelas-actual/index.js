import prisma from "../../../config/prisma";
import Joi from "joi";
import { createRouter } from "next-connect";
import validate from "../../../middlewares/validation";
import isGuru from '../../../middlewares/isGuru';
import isAuth from "../../../middlewares/isAuth";

//validation for API parameter
const schema = Joi.object({
    kelas: Joi.string().required(),
    guru: Joi.string().required(),
    tahun_ajaran: Joi.string().required(),    
    data_siswa: Joi.array().required(),
    data_mata_pelajaran: Joi.array().required()
});

const router = createRouter();

export default router
    .get(async (_, res, __) => {
        isAuth(_, res, __, async function (req, res, user) {
            isGuru(res, user);
            const listHKelasActual = await prisma.hKelasActual.findMany({
                include: {
                    dKelasActual: {
                        include: {
                            nilaiMatPel: {
                                include: {
                                    mataPelajaran: true
                                }
                            },
                            siswa: true,
                        }
                    },
                    guru: true,  
                    kelas: true                                      
                },
            });
            return res.status(200).json({ data: listHKelasActual });
        });
    })
    .post(validate({ body: schema }), async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const { kelas, guru, tahun_ajaran, data_siswa, data_mata_pelajaran } = req.body;
            try {
                const newHKelasActual = await prisma.hKelasActual.create({
                    data: {
                        idKelas: parseInt(kelas),
                        idGuru: parseInt(guru),
                        tahunAjaran: tahun_ajaran                        
                    }
                });
                console.log(newHKelasActual)
                for(var i = 0;i<data_siswa.length;i++) {
                    const newDKelasActual = await prisma.dKelasActual.create({
                        data: {
                            idHKelasActual: newHKelasActual.idHKelasActual,
                            idSiswa: parseInt(data_siswa[i].idSiswa),                            
                        }
                    }); 
                    var arrMatPel = [];
                    for(var i = 0; i < data_mata_pelajaran.length; i++){
                        arrMatPel.push({
                            idDKelasActual: newDKelasActual.idDKelasActual,
                            idMataPelajaran: parseInt(data_mata_pelajaran[i].idMataPelajaran),                                
                        });
                    }
                    await prisma.nilaiMatPel.createMany({
                        data: arrMatPel
                    });             
                    
                }
                return res.json({ message: 'success create new kelas actual' });
            } catch (error) {
                console.error(error);
            }
        })
    }).handler({
        onError: (err, _, res, __) => {
            console.error(err.stack);
            return res.status(500).end("Something wrong!");
        },
        onNoMatch: (_, res) => {
            return res.status(404).end("Page is not found");
        },
    });
