import prisma from "../../../config/prisma";
import Joi from "joi";
import { createRouter } from "next-connect";
import isGuru from "../../../middlewares/isGuru";
import isAuth from "../../../middlewares/isAuth";
import validate from "../../../middlewares/validation";

const schema = Joi.object({
    nama_kelas: Joi.string().required(),    
});

const router = createRouter();

export default router
    .get(async (req, res, __) => {
        isAuth(req, res, __, async function (req, res, user) {
            isGuru(res, user);
            const idKelas = req.query.idKelas;
            const listKelas = await prisma.kelas.findFirst({
                where: { idKelas: parseInt(idKelas), statusKelas: 1 }

            });
            res.status(200).json({ data: listKelas });
        })
    })
    .put(validate({ body: schema }), async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const idKelas = req.query.idKelas;
            const { nama_kelas } = req.body;
            try {
                await prisma.kelas.update({
                    where: { idKelas: parseInt(idKelas) },
                    data: {
                        namaKelas: nama_kelas
                    }
                })
                return res.json({ message: `kelas with id: ${idKelas} updated` })
            } catch (error) {
                console.error(error);
                return res.status(500).end("Something wrong!");
            }
        })
    })
    .delete(async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const idKelas = req.query.idKelas;
            try {
                await prisma.kelas.update({ 
                    where: { idKelas: parseInt(idKelas) },
                    data: {
                        statusKelas: 0,
                    }
                })
                return res.json({ message: `kelas with id: ${idKelas} deleted` })
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