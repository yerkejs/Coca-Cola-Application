import {auth} from './firebase'



export const login = (number, captchaVerifier) =>
    auth.signInWithPhoneNumber(number, captchaVerifier)
export const login2 = (number) =>
    auth.signInWithPhoneNumber("+7(747)-072-63-23")
export const signOut = () =>
    auth.signOut()
