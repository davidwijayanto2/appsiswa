import prisma from "../../../config/prisma";
import Joi from "joi";
import { createRouter } from "next-connect";
import isGuru from "../../../middlewares/isGuru";
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
            isGuru(res, user);
            const idSiswa = req.query.idSiswa;
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
                },                
            });            
            res.status(200).json({ data: listSiswa });
        })
    })
    .put(validate({ body: schema }), async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const idSiswa = req.query.idSiswa;
            const { nama_siswa, alamat, jenis_kelamin, no_hp, email } = req.body;
            try {
                const password = (Math.random() * 10).toString(36).replace('.', '');
                await prisma.siswa.update({
                    where: { idSiswa: parseInt(idSiswa) },
                    data: {
                        namaSiswa: nama_siswa,
                        alamat: alamat,
                        jenisKelamin: jenis_kelamin,
                        noHP: no_hp,                        
                    }
                });
                const userEmail = await prisma.user.findFirst({
                    where: {
                        idSiswa: parseInt(idSiswa)
                    }
                });                
                await prisma.user.update({
                    where: {userId: userEmail.userId},
                    data: {
                        email: email,                        
                    }
                });

                if(email != userEmail.email){
                    const client = new SMTPClient({
                        user: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
                        password: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
                        host: 'smtp.gmail.com',
                        tls:{
                            rejectUnauthorized: true,
                            minVersion: "TLSv1.2"
                        },
                        port: 587                 
                      });                                           
                    client.send({
                        text: `Email: ${email}\nPassword: ${password}`,
                        from: process.env.NEXT_PUBLIC_EMAIL_ADDRESS,
                        to: email,
                        subject: 'Personal Data',                    
                    },function (err, message){
                        console.log(err);
                        console.log(message);
                    });    
                }
                
                return res.json({ message: `siswa with id: ${idSiswa} updated` })
            } catch (error) {

                console.error(error);
                return res.status(500).end("Something wrong!");
            }
        })
    })
    .delete(async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const idSiswa = req.query.idSiswa;
            try {
                await prisma.siswa.update({ 
                    where: { idSiswa: parseInt(idSiswa) },
                    data: {
                        statusSiswa: 0
                    }                
                });
                return res.json({ message: `siswa with id: ${idSiswa} deleted` })
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