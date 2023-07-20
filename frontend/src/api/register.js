import request from '@/network/request'
const qs = require('qs');

export function register(firstname, lastname, email,password) {
    const regData = qs.stringify({
        'firstName': firstname,
        'lastName': lastname,
        'email': email,
        'password': password
    });
    return request({
        url: '/api/auth/register',
        method: 'post',
        data: regData
    })
}

export function signOut() {
    return request({
        url: '/api/auth/sign-out',
        method: 'post',
    })
}

export function updateProfile(userid,email,firstName,lastName,password){
    const regData = qs.stringify({
        '_id': userid,
        'email': email,
        'firstName': firstName,
        'lastName': lastName,
        'password': password
    });
    return request({
        url: '/api/users/'+userid,
        method: 'put',
        data: regData,
        params: {'userID':userid}
    })
}

export function changePwd(email,oldPwd,newPwd) {
    const regData = qs.stringify({
        'email': email,
        'password': oldPwd,
        'newPassword': newPwd
    });
    return request({
        url: '/api/auth/change-password',
        method: 'post',
        data: regData
    })
}