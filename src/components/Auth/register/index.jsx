import React, { useEffect, useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { useAuth } from '../../../context/authContext'
import { auth, db } from '../../../firebase/firebase'
import { updateProfile } from 'firebase/auth'

const Register = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [fname, setFname] = useState('');

    const { userLoggedIn } = useAuth()

    useEffect(() => {
        if (userLoggedIn) {
            navigate('/home')
        }
    }, [userLoggedIn, navigate])

    const onSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!')
            return
        }
        
        if(!isRegistering) {
            setIsRegistering(true);
            try{
                await doCreateUserWithEmailAndPassword(email, password);
                const user = auth.currentUser; 
                if(user){
                    await setDoc(doc(db, "Users", user.uid),{
                        email: user.email,
                        fullName: fname,
                        userId: user.uid,
                        // photoURL: user.photoURL || '',
                    });
                    await updateProfile(user, { displayName: fname });
                }
                navigate("/home");
            }catch(error){
                if (error.code === 'auth/email-already-in-use') {
                    setErrorMessage('This email is already registered. Please use a different email.');
                } else {
                    console.log('error login', error);
                    setErrorMessage("Error registering user. Please try again.");
                }
            }finally{
                setIsRegistering(false);
            }
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <main className="w-full h-screen flex self-center place-content-center place-items-center">
                <div className="w-96 text-white-600 space-y-5 p-4 shadow-xl border rounded-xl">
                    <div className="text-center mb-6">
                        <div className="mt-2">
                            <h3 className="text-white-800 text-xl font-semibold sm:text-2xl">Create a New Account</h3>
                        </div>

                    </div>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label className="text-sm text-white-600 font-bold">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                onChange={(e) => { setFname(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-white-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>
                        
                        <div>
                            <label className="text-sm text-white-600 font-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email} onChange={(e) => { setEmail(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-white-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white-600 font-bold">
                                Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-white-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white-600 font-bold">
                                Confirm Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-white-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isRegistering ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <div className="text-sm text-center">
                            Already have an account? {'   '}
                            <Link to={'/login'} className="text-center text-sm hover:underline font-bold">Continue</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register