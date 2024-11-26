import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import BlogCards from '../Blog/blogCards';
const Home = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) {
                navigate('/login');
                return;
            }

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

                    // Set default user data in Firestore
                    const newUserData = {
                        fullName: currentUser.displayName || 'Anonymous User',
                        email: currentUser.email,
                        userId: currentUser.uid,
                        photoURL: currentUser.photoURL || '',
                        // createdAt: new Date(),
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
    }, [currentUser, navigate]);

    if (loading) {
        return <div className="text-xl font-medium pt-14">Loading...</div>;
    }

    if (!userData) {
        return <div className="text-xl font-medium pt-14">User data not found.</div>;
    }
// Sample blog data or use real data if available
const blogImage = "https://placehold.jp/300x300.png";  // Fallback image if no image available
const blogTitle = "Sample Blog Title";
const blogCreatedAt = "12-12-2024";
const author = "John Doe";
    return (
        <>
            <BlogCards key="blogId" blogTitle={blogTitle} blogImage={blogImage} blogCreatedAt={blogCreatedAt} blogCreatedBy={author} />
        </>
    );
};

export default Home;
