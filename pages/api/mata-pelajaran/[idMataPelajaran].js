import prisma from "../../../config/prisma";
import Joi from "joi";
import { createRouter } from "next-connect";
import isGuru from "../../../middlewares/isGuru";
import isAuth from "../../../middlewares/isAuth";
import validate from "../../../middlewares/validation";

const schema = Joi.object({
    nama_mata_pelajaran: Joi.string().required(),    
});

const router = createRouter();

export default router
    .get(async (req, res, __) => {
        isAuth(req, res, __, async function (req, res, user) {
            isGuru(res, user);
            const idMataPelajaran = req.query.idMataPelajaran;
            const listMataPelajaran = await prisma.mataPelajaran.findFirst({
                where: { 
                    idMataPelajaran: parseInt(idMataPelajaran),
                    statusMataPelajaran: 1
                }
            });
            res.status(200).json({ data: listMataPelajaran });
        })
    })
    .put(validate({ body: schema }), async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const idMataPelajaran = req.query.idMataPelajaran;
            const { nama_mata_pelajaran } = req.body;
            try {
                await prisma.mataPelajaran.update({
                    where: { idMataPelajaran: parseInt(idMataPelajaran) },
                    data: {
                        namaMataPelajaran: nama_mata_pelajaran
                    }
                })
                return res.json({ message: `mata pelajaran with id: ${idMataPelajaran} updated` })
            } catch (error) {
                console.error(error);
                return res.status(500).end("Something wrong!");
            }
        })
    })
    .delete(async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const idMataPelajaran = req.query.idMataPelajaran;
            try {
                await prisma.mataPelajaran.update({ 
                    where: { idMataPelajaran: parseInt(idMataPelajaran) },
                    data: {
                        statusMataPelajaran: 0
                    }
                });
                return res.json({ message: `mata pelajaran with id: ${idMataPelajaran} deleted` })
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