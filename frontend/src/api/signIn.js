import request from '@/network/request'

const qs = require('qs');

export function signIn(email, password) {
    const signInData = qs.stringify({
        'email': email,
        'password': password
    });
    return request({
        url: '/api/auth/sign-in',
        method: 'post',
        data: signInData
    })
}

export function requestPasswordReset(email) {
    return request({
        url: `/api/auth/request-password-reset?email=${email}`,
        method: 'get'
    })
}

export function resetPassword(email, token, newPassword) {
    return request({
        url: `/api/auth/reset-password?email=${email}&token=${token}`,
        method: 'post',
        data: { newPassword: newPassword }
    })
}

export function resendEmail(email) {
    return request({
        url: `/api/auth/resend-email?email=${email}`,
        method: 'get'
    })
}

export function activateAccount(email, token) {
    return request({
        url: `/api/auth/activate-account?email=${email}&token=${token}`,
        method: 'get'
    })
}
