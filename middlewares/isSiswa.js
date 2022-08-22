

export default function isSiswa(res, user, idSiswa) {
    if (user.idSiswa == null) {
        return res.status(403).end('Forbidden Request');
    } else if (user.idSiswa != idSiswa) {
        return res.status(403).end('Forbidden Request');
    }

}