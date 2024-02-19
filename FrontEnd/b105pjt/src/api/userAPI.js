import { baseAxios } from '../utils/httpCommons';

const baseURL = baseAxios();

async function signup(param, token, success, fail) {
    const config = {
        headers: {
            Authorization: token,
        },
    };
    await baseURL.post('users', param, config).then(success).catch(fail);
}

async function signout(param, success, fail) {
    await baseURL.delete('users', param).then(success).catch(fail);
}

async function findID(param, success, fail) {
    await baseURL.get(`users/find-id?name=${param.name}`, param).then(success).catch(fail);
}

async function findPW(param, success, fail) {
    await baseURL.get(`users/find-password?id=${param.id}&email=${param.email}`).then(success).catch(fail);
}

async function changePW(param, token, success, fail) {
    const config = {
        headers: token,
    };
    return baseURL.patch('users/update-password', param, config).then(success).catch(fail);
}

async function sendEmail(param, success, fail) {
    await baseURL.get(`users/join-email?email=${param.email}`, param).then(success).catch(fail);
}

async function sendFindEmail(param, success, fail) {
    await baseURL.get(`users/find-email?email=${param.email}`, param).then(success).catch(fail);
}

async function login(param, success, fail) {
    await baseURL.post('users/login', param).then(success).catch(fail);
}

async function logout(headers, success, fail) {
    const config = {
        headers: headers,
    };
    await baseURL.get('users/logout', config).then(success).catch(fail);
}

async function userDetail(token, success, fail) {
    const config = {
        headers: {
            Authorization: token,
        },
    };

    await baseURL.get('users', config).then(success).catch(fail);
}

async function validPW(token, param, success, fail) {
    const config = {
        headers: {
            Authorization: token,
        },
    };

    await baseURL.post('users/valid-password', param, config).then(success).catch(fail);
}

async function wantUpgrade(token, success, fail) {
    const config = {
        headers: {
            Authorization: token,
        },
    };
    await baseURL.patch('users/upgrade', null, config).then(success).catch(fail);
}

export {
    wantUpgrade,
    signup,
    sendEmail,
    login,
    logout,
    signout,
    findID,
    findPW,
    sendFindEmail,
    changePW,
    userDetail,
    validPW,
};
