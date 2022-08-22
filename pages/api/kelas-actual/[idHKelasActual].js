import prisma from "../../../config/prisma";
import Joi from "joi";
import { createRouter } from "next-connect";
import isGuru from "../../../middlewares/isGuru";
import isAuth from "../../../middlewares/isAuth";
import validate from "../../../middlewares/validation";

const schema = Joi.object({
    kelas: Joi.string().required(),
    guru: Joi.string().required(),
    tahun_ajaran: Joi.string().required(),
    data_siswa: Joi.array().required(),
    data_mata_pelajaran: Joi.array().required()
});

const router = createRouter();

export default router
    .get(async (req, res, __) => {
        isAuth(req, res, __, async function (req, res, user) {
            isGuru(res, user);
            const idHKelasActual = req.query.idHKelasActual;
            const listHKelasActual = await prisma.hKelasActual.findFirst({
                where: { idHKelasActual: parseInt(idHKelasActual) },
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
            res.status(200).json({ data: listHKelasActual });
        })
    })
    .put(validate({ body: schema }), async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const idHKelasActual = req.query.idHKelasActual;
            const { kelas, guru, tahun_ajaran, data_siswa, data_mata_pelajaran } = req.body;
            try {
                const newHKelasActual = await prisma.hKelasActual.update({
                    where: { idHKelasActual: parseInt(idHKelasActual)},
                    data: {
                        idKelas: parseInt(kelas),
                        idGuru: parseInt(guru),
                        tahunAjaran: tahun_ajaran
                    }
                });
                const delKelasActual = await prisma.dKelasActual.findMany({
                    where: {
                        idHKelasActual: newHKelasActual.idHKelasActual
                    }
                });
                for(var i = 0;i<delKelasActual.length; i++){
                    await prisma.nilaiMatPel.deleteMany({
                        where: {
                            idDKelasActual: delKelasActual[i].idDKelasActual
                        }
                    }); 
                }
                await prisma.dKelasActual.deleteMany({
                    where: {
                        idHKelasActual: newHKelasActual.idHKelasActual
                    }
                });
                for(var i = 0;i<data_siswa.length;i++) {
                    const newDKelasActual =  await prisma.dKelasActual.create({
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
                return res.json({ message: `kelas actual with id: ${idHKelasActual} updated` })
            } catch (error) {
                console.error(error);
                return res.status(500).end("Something wrong!");
            }
        })
    })
    .delete(async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const idGuru = req.query.idGuru;
            try {
                await prisma.guru.update({ 
                    where: { idGuru: parseInt(idGuru) }, 
                    data: {
                        statusGuru: 0
                    }
                });
                return res.json({ message: `guru with id: ${idGuru} deleted` })
            } catch (error) {
                console.error(error);
                return res.status(500).end("Something wrong!");
            }
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