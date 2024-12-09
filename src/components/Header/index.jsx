import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { doSignOut } from '../../firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Hamburger from 'hamburger-react'
import Loading from '../Modal/loading';
import { PropTypes } from 'prop-types';

const Header = ({onToggle}) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userLoggedIn, currentUser } = useAuth();
    const [isOpen, setOpen] = useState(false);
    // const [modalActive, setModalActive] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // if (!currentUser) return;

            try {
                if (currentUser){
                    const docRef = doc(db, 'Users', currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const userDoc = docSnap.data();
                        setUserData({
                            ...userDoc,
                            fullName: userDoc.fullName || currentUser.displayName, // Fallback to displayName
                        });
                    } else {

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
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    const handleHamburgerMenuClick = (toggled) => {
        const hamburgerMenu = document.querySelector('.hamburgerMenu');
        const hamburgerMobileNav = document.querySelector('.mobileNav');
    
        // Call onToggle with the new state (toggled) so it reflects the latest state
        onToggle(toggled);

        if (isOpen){
            setOpen(false);
            toggled = false;
        }
        
    
        if (toggled) {
            // Open the menu
            hamburgerMenu.classList.remove('translate-x-full');
            hamburgerMobileNav.classList.add('z-10');
            hamburgerMobileNav.classList.add('backdrop-blur-sm');
        } else {
            // Close the menu
            hamburgerMenu.classList.add('translate-x-full');
            hamburgerMobileNav.classList.remove('z-10');
            hamburgerMobileNav.classList.remove('backdrop-blur-sm');
        }
    };

    if (loading) {
        return <Loading/> 
    }

     // Check if we are on the edit-blog page
     const isEditPage = location.pathname.startsWith('/edit-blog'); // Check if on the Edit Blog page
     const isAddBlogPage = location.pathname === '/addblogpost'; // Check if on the Add Blog page
     const isProfilePage = location.pathname === '/profile'; // Check if on the Add Blog page
     const isBlogPage = location.pathname.startsWith('/blog'); // Check if on the Blog page
    return (
        <>
        <nav className="flex flex-row gap-x-2 w-full h-12 justify-between  items-center bg-black px-9">
            
            <div className="mainLogo text-2xl uppercase font-bold"><Link to={'/home'}>Blog</Link></div>
            <div className="navMenu hidden flex-row gap-x-2 w-full h-12 justify-end  items-center bg-black px-9 lg:flex">
            {currentUser && userLoggedIn ? (
                <>
                    {/* Home Link */}
                    {(isAddBlogPage || isEditPage || isBlogPage || isProfilePage) ? (
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
                        <ul className="absolute hidden group-hover:block dropdown-menu bg-black p-3 z-20">
                            <li className="dropdown-menu-item hover:underline cursor-pointer"><Link to={'/profile'}>Profile</Link></li>
                            <li className="dropdown-menu-item hover:underline cursor-pointer">Settings</li>
                            <li
                                onClick={() => {
                                    doSignOut().then(() => {
                                        navigate('/login');
                                    });
                                }}
                                className="dropdown-menu-item hover:underline cursor-pointer"
                            >
                                <Link to={'/login'}>Logout</Link>
                            </li>
                        </ul>
                    </div>
                </>
            ) : (
                <>
                    <Link className="text-sm text-blue-600 font-bold text-white" to={'/home'}>
                        Home
                    </Link>
                    <Link className="text-sm text-blue-600 font-bold text-white" to={'/login'}>
                        Login
                    </Link>
                    <Link className="text-sm text-blue-600 font-bold text-white" to={'/register'}>
                        Register New Account
                    </Link>
                </>
            )}
            </div>
            <div className="hamburgerIcon block lg:hidden">
                <Hamburger 
                    toggled={isOpen} 
                    toggle={(toggled) => {
                        setOpen(toggled); // Update the local state
                        handleHamburgerMenuClick(toggled); // Handle the toggle logic
                    }} 
                />
            </div>
        </nav>
        <nav className='mobileNav block lg:hidden w-full absolute h-screen overflow-hidden'>
            <div className="hamburgerMenu h-screen bg-black w-fit p-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-y-3 absolute right-0 z-10 translate-x-full transition-all ">
                { currentUser && userLoggedIn ? (
                    <div className="hamburgerMenuLinks">
                        <ul>
                            <li>
                            <img
                                className="rounded-full w-8 m-auto"
                                src={currentUser.photoURL && currentUser.photoURL.trim() !== '' ? currentUser.photoURL : 'https://www.gravatar.com/avatar/?d=identicon'}
                                alt="User Avatar"
                            />
                            <span className='text-sm text-blue-600 font-bold text-white cursor-pointer'>
                                {userData?.fullName || currentUser.email}
                            </span>
                            </li>
                            <li>
                                <Link to={'/home'} onClick={handleHamburgerMenuClick}>Home</Link>
                            </li>
                            <li>
                                <Link to={'/addblogpost'} onClick={handleHamburgerMenuClick}>Add Blog</Link>
                            </li>
                            <li>
                                <Link to={'/profile'} onClick={handleHamburgerMenuClick}>Profile</Link>
                            </li>
                            <li>
                                <Link to={'/login'} onClick={() => {
                                    doSignOut().then(() => {
                                        navigate('/login');
                                        handleHamburgerMenuClick();
                                    });
                                }}>Logout</Link>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="hamburgerMenuLinks">
                        <ul>
                            <li>
                                <Link to={'/home'} onClick={handleHamburgerMenuClick}>Home</Link>
                            </li>
                            <li>
                                <Link to={'/login'} onClick={handleHamburgerMenuClick}>Login</Link>
                            </li>
                            <li>
                                <Link to={'/register'} onClick={handleHamburgerMenuClick}>Register New Account</Link>
                            </li>
                        </ul>
                    </div>
                )
                    
                }
            </div>
        </nav>
    </>
    );
};

Header.propTypes = {
    onToggle: PropTypes.func,
}


export default Header;
