

export default function isGuru(res, user) {
    if (user.idGuru == null) {
        return res.status(403).end('Forbidden Request');
    }
}