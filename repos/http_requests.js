import { getCookie } from "cookies-next";

let headerParams = {
    'Content-Type': 'application/json',
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function loginAPI(email, password) {
    return await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: headerParams
    });
}

export async function getAllKelasAPI() {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/kelas`, {
        method: 'GET',
        headers: params,
    })
}

export async function getKelasAPI(id_kelas) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/kelas/${id_kelas}`, {
        method: 'GET',
        headers: params,
    })
}

export async function addKelasAPI(body) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/kelas`, {
        method: 'POST',
        headers: params,
        body: JSON.stringify(body)
    })
}

export async function editKelasAPI(id_kelas, body) {
    const token = getCookie('token');
    console.log(id_kelas);
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/kelas/${id_kelas}`, {
        method: 'PUT',
        headers: params,
        body: JSON.stringify(body)
    });
}

export async function deleteKelasAPI(id_kelas) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/kelas/${id_kelas}`, {
        method: 'DELETE',
        headers: params
    });
}

export async function getAllMataPelajaranAPI() {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/mata-pelajaran`, {
        method: 'GET',
        headers: params,
    })
}

export async function getMataPelajaranAPI(id_mata_pelajaran) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/mata-pelajaran/${id_mata_pelajaran}`, {
        method: 'GET',
        headers: params,
    })
}

export async function addMataPelajaranAPI(body) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/mata-pelajaran`, {
        method: 'POST',
        headers: params,
        body: JSON.stringify(body)
    })
}

export async function editMataPelajaranAPI(id_mata_pelajaran, body) {
    const token = getCookie('token');
    console.log(id_mata_pelajaran);
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/mata-pelajaran/${id_mata_pelajaran}`, {
        method: 'PUT',
        headers: params,
        body: JSON.stringify(body)
    });
}

export async function deleteMataPelajaranAPI(id_mata_pelajaran) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/mata-pelajaran/${id_mata_pelajaran}`, {
        method: 'DELETE',
        headers: params
    });
}

export async function getAllGuruAPI() {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/guru`, {
        method: 'GET',
        headers: params,
    })
}

export async function getGuruAPI(id_guru) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/guru/${id_guru}`, {
        method: 'GET',
        headers: params,
    })
}

export async function addGuruAPI(body) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/guru`, {
        method: 'POST',
        headers: params,
        body: JSON.stringify(body)
    })
}

export async function editGuruAPI(id_guru, body) {
    const token = getCookie('token');
    console.log(id_guru);
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/guru/${id_guru}`, {
        method: 'PUT',
        headers: params,
        body: JSON.stringify(body)
    });
}

export async function deleteGuruAPI(id_guru) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/guru/${id_guru}`, {
        method: 'DELETE',
        headers: params
    });
}

export async function getAllSiswaAPI() {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/siswa`, {
        method: 'GET',
        headers: params,
    })
}

export async function getSiswaAPI(id_siswa) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/siswa/${id_siswa}`, {
        method: 'GET',
        headers: params,
    })
}

export async function addSiswaAPI(body) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/siswa`, {
        method: 'POST',
        headers: params,
        body: JSON.stringify(body)
    })
}

export async function editSiswaAPI(id_siswa, body) {
    const token = getCookie('token');
    console.log(id_siswa);
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/siswa/${id_siswa}`, {
        method: 'PUT',
        headers: params,
        body: JSON.stringify(body)
    });
}

export async function deleteSiswaAPI(id_siswa) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/siswa/${id_siswa}`, {
        method: 'DELETE',
        headers: params
    });
}

export async function getAllKelasActualAPI() {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/kelas-actual`, {
        method: 'GET',
        headers: params,
    })
}

export async function getKelasActualAPI(id_kelas_actual) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/kelas-actual/${id_kelas_actual}`, {
        method: 'GET',
        headers: params,
    })
}

export async function addKelasActualAPI(body) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/kelas-actual`, {
        method: 'POST',
        headers: params,
        body: JSON.stringify(body)
    })
}

export async function editKelasActualAPI(id_kelas_actual, body) {
    const token = getCookie('token');
    console.log(id_kelas_actual);
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/kelas-actual/${id_kelas_actual}`, {
        method: 'PUT',
        headers: params,
        body: JSON.stringify(body)
    });
}

export async function deleteKelasActualAPI(id_kelas_actual) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/kelas-actual/${id_kelas_actual}`, {
        method: 'DELETE',
        headers: params
    });
}

export async function getProfileAPI(id_siswa) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/profile/${id_siswa}`, {
        method: 'GET',
        headers: params,
    })
}

export async function resetPasswordAPI(password_lama, password_baru,ulangi_password) {
    const token = getCookie('token');
    let params = {
        ...headerParams,
        ...{ 'Authorization': token }
    };
    return await fetch(`${baseURL}/api/auth/resetpassword`, {
        method: 'POST',
        body: JSON.stringify({
            password_lama: password_lama,
            password_baru: password_baru,
            ulangi_password: ulangi_password
        }),
        headers: params
    });
}