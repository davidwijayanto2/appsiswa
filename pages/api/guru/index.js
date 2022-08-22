import prisma from "../../../config/prisma";
import Joi from "joi";
import { createRouter } from "next-connect";
import validate from "../../../middlewares/validation";
import isGuru from '../../../middlewares/isGuru';
import isAuth from "../../../middlewares/isAuth";
import { hashSync } from "bcrypt";
import {SMTPClient} from 'emailjs';

//validation for API parameter
const schema = Joi.object({
    nama_guru: Joi.string().required(),   
    alamat: Joi.string().required(),    
    jenis_kelamin: Joi.string().required(),   
    no_hp: Joi.string().required(),  
    email: Joi.string().required().email()
});

const router = createRouter();

export default router
    .get(async (_, res, __) => {
        isAuth(_, res, __, async function (req, res, user) {
            isGuru(res, user);
            const listGuru = await prisma.guru.findMany({
                where: {statusGuru: 1},
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
            return res.status(200).json({ data: listGuru });
        });
    })
    .post(validate({ body: schema }), async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);            
            const { nama_guru, email,alamat, jenis_kelamin, no_hp } = req.body;
            try {
                const password = (Math.random() * 10).toString(36).replace('.', '');
                const newGuru =await prisma.guru.create({
                    data: {
                        namaGuru: nama_guru,
                        alamat: alamat,
                        jenisKelamin: jenis_kelamin,
                        noHP: no_hp,                        
                    }
                });
                await prisma.user.create({
                    data: {
                        email: email,
                        password: hashSync(password, 10),
                        idGuru: newGuru.idGuru
                    }
                });
                
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
                return res.json({ message: 'success create new guru' });
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
