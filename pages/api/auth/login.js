import prisma from "../../../config/prisma";
import { compareSync } from "bcrypt";
import Joi from "joi";
import { createRouter } from "next-connect";
import validate from "../../../middlewares/validation";
import jwt from "jsonwebtoken";

const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
});

const router = createRouter();

export default router
    .post(validate({ body: schema }), async (req, res) => {
        const { email, password } = req.body;
        const user = await prisma.user.findFirst({
            where: { email: email }
        });
        if (!user) {
            return res.status(401).json({ success: false, message: "Email / password invalid" }).end();
        }
        if (!compareSync(password, user.password)) {
            return res.status(401).json({ success: false, message: "Email / password invalid" }).end();
        }
        var id, nama, type, payload;

        if(user.idSiswa != null) {            
            type = 'Siswa';
            id = user.idSiswa;
            payload = {
                email: user.email,
                id: id,
                type: type,
            };
            const siswa = await prisma.siswa.findFirst({
                where: { idSiswa: user.idUser}
            });    
            nama = siswa.namaSiswa;                  
        } else {          
            type = 'Guru';
            id = user.idGuru;
            payload = {
                email: user.email,
                id: id,
                type: type,
            };
            const guru = await prisma.guru.findFirst({
                where: { idGuru: user.idGuru}
            });
            nama = guru.namaGuru;
        }   
        const token = jwt.sign(payload, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: "1d" })
        return res.status(200).send({
            success: true,
            message: "Logged in successfully!",
            data: {
                id: id,
                email: user.email,
                nama: nama,
                type: type
            },
            token: token
        });     
    }).handler({
        onError: (err, _, res, __) => {
            console.error(err.stack);
            res.status(500).end("Something wrong!");
        },
        onNoMatch: (_, res) => {
            res.status(404).end("Page is not found");
        },
    });