import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import "../config/prisma";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.NEXT_PUBLIC_JWT_SECRET;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    if (!jwt_payload)
        return done(null, false);
    const userType = jwt_payload.type;
    const authUser = await prisma.user.findFirst({
        where: userType == 'Guru' ? { idGuru: jwt_payload.id, email: jwt_payload.email } : { idSiswa: jwt_payload.id, email: jwt_payload.email }
    });
    if (authUser) {
        return done(null, authUser);
    } else {
        return done(null, false);
        // or you could create a new account
    }
}));
