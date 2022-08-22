import prisma from "../../../config/prisma";
import { compareSync, hashSync } from "bcrypt";
import Joi from "joi";
import { createRouter } from "next-connect";
import validate from "../../../middlewares/validation";
import isAuth from "../../../middlewares/isAuth";
import jwt from "jsonwebtoken";

const schema = Joi.object({
    password_lama: Joi.string().required(),
    password_baru: Joi.string().required(),
    ulangi_password: Joi.any().equal(Joi.ref('password_baru')).required().messages({ 'any.only': '{{#label}} does not match' })
});

const router = createRouter();

export default router
    .post(validate({ body: schema }), async (req, res, _) => {
        isAuth(req, res, _, async function (req, res, user) {
            const { password_lama, password_baru, ulangi_password } = req.body;            
            if (!compareSync(password_lama, user.password)) {
                return res.status(401).json({ success: false, message: "Password lama salah" }).end();
            }
            await prisma.user.update({
                where: { userId: parseInt(user.userId) },
                data: {
                    password: hashSync(password_baru, 10)
                }
            });
            return res.status(200).send({
                success: true,
                message: "Reset Password success!",                
            });    
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