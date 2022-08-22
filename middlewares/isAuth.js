import passport from "passport";
import '../config/passport';

export default function isAuth(req, res, next, callback) {
    passport.initialize();
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (!user) {
            return res.status(401).end("Unauthorized");
        }        
        callback(req, res, user);
    })(req, res, next);
}