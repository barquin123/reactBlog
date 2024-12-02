import React, { useEffect, useReducer } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import BlogCards from '../Blog/blogCards';
import { BlogPostInitialState, BlogPostReducer, SET_BLOGS, SET_ERROR, SET_LOADING } from './blogPostReducer';

const Home = () => {
    const [state, dispatch] = useReducer(BlogPostReducer, BlogPostInitialState);

    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Access current user from auth context

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) {
                navigate('/login'); // Redirect to login if the user is not authenticated
                return;
            }

            try {
                dispatch({ type: SET_LOADING, payload: true });

                // Fetch user data
                const docRef = doc(db, 'Users', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // You can update user data here if needed
                } else {
                    // Set default user data if not found
                    const newUserData = {
                        fullName: currentUser.displayName || 'Anonymous User',
                        email: currentUser.email,
                        userId: currentUser.uid,
                        photoURL: currentUser.photoURL || '',
                        createdAt: new Date(),
                    };
                    await setDoc(docRef, newUserData);
                }

                // Fetch blog posts from Firestore
                const blogCollection = collection(db, 'blogs');
                const blogSnapshot = await getDocs(blogCollection);
                const blogList = blogSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Dispatch action to set blogs
                dispatch({ type: SET_BLOGS, payload: blogList });

            } catch (error) {
                dispatch({ type: SET_ERROR, payload: error.message });
            } finally {
                dispatch({ type: SET_LOADING, payload: false });
            }
        };

        fetchData();
    }, [currentUser, navigate]);

    const handleEdit = (blogId) => {
        // Navigate to the edit page or open a modal for editing
        navigate(`/edit-blog/${blogId}`);
    };

    const handleDelete = async (blogId) => {
        try {
            await deleteDoc(doc(db, 'blogs', blogId));
            dispatch({ type: SET_BLOGS, payload: state.blogs.filter(blog => blog.id !== blogId) });
            alert('Blog deleted successfully');
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Error deleting blog');
        }
    };

    const { blogs, isLoading, error } = state;

    if (isLoading) {
        return <div className="text-xl font-medium pt-14 max-w-3xl mx-auto">Loading...</div>;
    }

    if (error) {
        return <div className="text-xl font-medium pt-14 max-w-3xl mx-auto">Error: {error}</div>;
    }

    if (blogs.length === 0) {
        return <div className="text-xl font-medium pt-14 max-w-3xl mx-auto">No blog posts available.</div>;
    }

    return (
        <div className="home-container max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Blog Posts</h2>
            {/* Map through the blogs and render a BlogCard for each */}
            {blogs.map(blog => (
                <BlogCards
                    key={blog.id}
                    blogTitle={blog.title}
                    blogImage={blog.imageUrl || "https://placehold.jp/300x300.png"} // Use placeholder if no image is available
                    blogCreatedAt={new Date(blog.createdAt.seconds * 1000).toLocaleDateString()} // Convert timestamp to date string
                    blogCreatedBy={blog.author || "Anonymous"}
                    blogId={blog.id} // Pass the blog id to the BlogCard
                    onEdit={currentUser.uid === blog.authorId ? handleEdit : null} // Only pass onEdit if current user is the author
                    onDelete={currentUser.uid === blog.authorId ? handleDelete : null} // Only pass onDelete if current user is the author
                />
            ))}
        </div>
    );
};

export default Home;
