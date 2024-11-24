import React, { useEffect } from 'react'
import { useAuth } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    useEffect(() => {
        if(!currentUser){
            navigate("/login");
        }
    },[currentUser, navigate]) ;

    if (!currentUser) {
        return null;
    }

    return (
        <div className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.</div>
    )
}

export default Home