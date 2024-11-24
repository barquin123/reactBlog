import { auth } from "./firebase";

import { GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updatePassword, signInWithPopup} from "firebase/auth";
export const doCreateUserWithEmailAndPassword = async ( email, password ) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async ( email, password ) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // result.user
    return result;
};

export const doSignOut = () => {
    return auth.signOut();
};

// export const doPasswordReset = () => {
//     return sendPasswordResetEmail(auth, email);
// };

// export const doPasswordChange = () => {
//     return updatePassword(auth.currentUser, password);
// };

// export const doSendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: '${window.locatoin.origin}/home',
//     });
// };