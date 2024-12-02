import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { doSignOut } from '../../firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const Header = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userLoggedIn, currentUser } = useAuth();
    // const [modalActive, setModalActive] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;

            try {
                const docRef = doc(db, 'Users', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userDoc = docSnap.data();
                    setUserData({
                        ...userDoc,
                        fullName: userDoc.fullName || currentUser.displayName, // Fallback to displayName
                    });
                } else {
                    console.log('No such document! Creating one...');

                    // Create new user document in Firestore
                    const newUserData = {
                        fullName: currentUser.displayName || 'Anonymous User',
                        email: currentUser.email,
                        photoURL: currentUser.photoURL || '',
                        createdAt: new Date(),
                        userId: currentUser.uid,
                    };

                    await setDoc(docRef, newUserData);
                    setUserData(newUserData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    // const modalActivate = () => {
    //     setModalActive(!modalActive); // This line toggles the modalActive state
    // };

    if (loading) {
        return null; // Optionally, display a loading spinner
    }

     // Check if we are on the edit-blog page
     const isEditPage = location.pathname.startsWith('/edit-blog'); // Check if on the Edit Blog page
     const isAddBlogPage = location.pathname === '/addblogpost'; // Check if on the Add Blog page
     const isBlogPage = location.pathname.startsWith('/blog'); // Check if on the Blog page
    return (
        <>
        <nav className="flex flex-row gap-x-2 w-full h-12 justify-end items-center bg-black px-9">
            {userLoggedIn ? (
                <>
                    {/* Home Link */}
                    {(isAddBlogPage || isEditPage || isBlogPage) ? (
                        <div
                            className="text-sm text-blue-600 font-bold text-white cursor-pointer"
                            onClick={() => navigate('/home')} // Navigate to Home page
                        >
                            Home
                        </div>
                    ) : (
                        <Link
                            className="text-sm text-blue-600 font-bold text-white"
                            to="/addblogpost" // Navigate to Add Blog page
                        >
                            Add Blog
                        </Link>
                    )}
                    
                    <img
                        className="rounded-full w-8"
                        src={currentUser.photoURL && currentUser.photoURL.trim() !== '' ? currentUser.photoURL : 'https://www.gravatar.com/avatar/?d=identicon'}
                        alt="User Avatar"
                    />
                    <div className="relative group">
                        <p className="text-sm text-blue-600 font-bold text-white cursor-pointer">
                            {userData?.fullName || currentUser.email}
                        </p>
                        <ul className="absolute hidden group-hover:block dropdown-menu bg-black p-3">
                            <li className="dropdown-menu-item hover:underline cursor-pointer">Profile</li>
                            <li className="dropdown-menu-item hover:underline cursor-pointer">Settings</li>
                            <li
                                onClick={() => {
                                    doSignOut().then(() => {
                                        navigate('/login');
                                    });
                                }}
                                className="dropdown-menu-item hover:underline cursor-pointer"
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                </>
            ) : (
                <>
                    <Link className="text-sm text-blue-600 font-bold text-white" to={'/login'}>
                        Login
                    </Link>
                    <Link className="text-sm text-blue-600 font-bold text-white" to={'/register'}>
                        Register New Account
                    </Link>
                </>
            )}
        </nav>
    </>
    );
};

export default Header;
