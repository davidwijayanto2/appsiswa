import prisma from "../../../config/prisma";
import Joi from "joi";
import { createRouter } from "next-connect";
import isGuru from "../../../middlewares/isGuru";
import isAuth from "../../../middlewares/isAuth";
import validate from "../../../middlewares/validation";
import {SMTPClient} from 'emailjs';

const schema = Joi.object({
    nama_guru: Joi.string().required(),  
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
            const idGuru = req.query.idGuru;
            const listGuru = await prisma.guru.findFirst({
                where: { idGuru: parseInt(idGuru), statusGuru: 1 },
                select: {
                    idGuru: true,
                    namaGuru: true,
                    alamat: true,
                    noHP: true,
                    jenisKelamin: true,
                    statusGuru: true,
                    user: {
                        select: {
                            email: true,
                        }
                    }
                }
            });
            res.status(200).json({ data: listGuru });
        })
    })
    .put(validate({ body: schema }), async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const idGuru = req.query.idGuru;
            const { nama_guru, email, alamat, jenis_kelamin, no_hp } = req.body;
            try {
                await prisma.guru.update({
                    where: { idGuru: parseInt(idGuru) },
                    data: {
                        namaGuru: nama_guru,
                        alamat: alamat,
                        jenisKelamin: jenis_kelamin,
                        noHP: no_hp,                        
                    }
                });

                const userEmail = await prisma.user.findFirst({
                    where: {
                        idGuru: parseInt(idGuru)
                    }
                });                
                await prisma.user.update({
                    where: { userId: parseInt(userEmail.userId) },
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
                return res.json({ message: `guru with id: ${idGuru} updated` })
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