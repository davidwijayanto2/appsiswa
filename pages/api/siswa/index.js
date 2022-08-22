import prisma from "../../../config/prisma";
import Joi from "joi";
import { createRouter } from "next-connect";
import validate from "../../../middlewares/validation";
import isGuru from '../../../middlewares/isGuru';
import isAuth from "../../../middlewares/isAuth";
import {SMTPClient} from 'emailjs';
import { hashSync } from "bcrypt";
// import { sendEmail } from "../../../utils/common_helper";
// import { sendEmail } from "../../../utils/common_helper";

//validation for API parameter
const schema = Joi.object({
    nama_siswa: Joi.string().required(),    
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
            const listSiswa = await prisma.siswa.findMany({
                where: { statusSiswa: 1 },
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
                    }
                },                
            });            
            return res.status(200).json({ data: listSiswa });
        });
    })
    .post(validate({ body: schema }), async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            isGuru(res, user);
            const { nama_siswa, alamat, jenis_kelamin, email, photo_profile, no_hp } = req.body;
            try {
                const password = (Math.random() * 10).toString(36).replace('.', '');
                const newSiswa = await prisma.siswa.create({
                    data: {
                        namaSiswa: nama_siswa,
                        alamat: alamat,
                        jenisKelamin: jenis_kelamin,
                        photoProfile: photo_profile,                        
                        noHP: no_hp,                        
                    }
                });
                await prisma.user.create({
                    data: {
                        email: email,
                        password: hashSync(password, 10),
                        idSiswa: newSiswa.idSiswa
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
            
                // sendEmail(email, 'Personal Data' ,`Email: ${email}\nPassword: ${password}`);                
                return res.json({ message: 'success create new siswa' });
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

