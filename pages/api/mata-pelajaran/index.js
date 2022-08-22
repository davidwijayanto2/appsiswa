import prisma from "../../../config/prisma";
import Joi from "joi";
import { createRouter } from "next-connect";
import validate from "../../../middlewares/validation";
import isGuru from '../../../middlewares/isGuru';
import isAuth from "../../../middlewares/isAuth";

//validation for API parameter
const schema = Joi.object({
    nama_mata_pelajaran: Joi.string().required(),    
});

const router = createRouter();

export default router
    .get(async (_, res, __) => {
        isAuth(_, res, __, async function (req, res, user) {
            isGuru(res, user);
            const listMataPelajaran = await prisma.mataPelajaran.findMany({
                where: { statusMataPelajaran: 1}
            });
            return res.status(200).json({ data: listMataPelajaran });
        });
    })
    .post(validate({ body: schema }), async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const { nama_mata_pelajaran } = req.body;
            try {
                await prisma.mataPelajaran.create({
                    data: {
                        namaMataPelajaran: nama_mata_pelajaran
                    }
                });
                return res.json({ message: 'success create new mata pelajaran' });
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
