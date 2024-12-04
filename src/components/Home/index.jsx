import React, { useEffect, useReducer } from 'react';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import BlogCards from '../Blog/blogCards';
import { BlogPostInitialState, BlogPostReducer, DELETE_BLOG, SET_BLOGS, SET_ERROR, SET_LOADING } from './blogPostReducer';

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

        // Fetch blog posts from Firestore
        const blogCollection = collection(db, 'blogs');
        const blogSnapshot = await getDocs(blogCollection);
        const blogList = blogSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds); // Sort by createdAt timestamp

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
    navigate(`/edit-blog/${blogId}`); // Navigate to the EditBlog component
  };

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const docRef = doc(db, 'blogs', blogId);
        await deleteDoc(docRef); // Delete the blog from Firestore
        dispatch({ type: DELETE_BLOG, payload: blogId }); // Update the state to reflect the deleted blog
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
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
      <h2 className="text-2xl font-bold mb-6 text-center uppercase">Blogs</h2>

      {/* First 3 blog posts as block elements */}
      <div className="block-items">
        {blogs.slice(0, 3).map(blog => (
          <BlogCards
            key={blog.id}
            blogTitle={blog.title}
            blogImage={blog.imageUrl || "https://placehold.jp/640x427.png"} // Use placeholder if no image is available
            blogShortDesc={blog.shortDesc}
            blogCreatedAt={new Date(blog.createdAt.seconds * 1000).toLocaleDateString()} // Convert timestamp to date string
            blogCreatedBy={blog.author || "Anonymous"}
            blogId={blog.id}
            onEdit={currentUser.uid === blog.authorId ? () => handleEdit(blog.id) : null} // Only show edit button for the author
            onDelete={currentUser.uid === blog.authorId ? () => handleDelete(blog.id) : null} // Only show delete button for the author
            hrefLink={`/blog/${blog.id}`} // Link to the blog post
            style={{
              display: 'block', // Block display for the first 3 items
              backgroundColor: 'lightblue', // Optional background color for block items
              padding: '10px',
              marginBottom: '10px',
            }}
          />
        ))}
      </div>

      {/* Remaining blog posts in a flex carousel */}
      <div className="carousel-container" style={{ display: 'flex', overflowX: 'scroll', padding: '10px 0' }}>
        {blogs.slice(3).map(blog => (
          <div
            key={blog.id}
            style={{
              flex: '0 0 auto', // To make sure items in carousel don't shrink/stretch
              width: '200px',   // Set a fixed width for carousel items
              backgroundColor: 'lightgreen', // Example background color for carousel items
              marginRight: '10px',  // Add some space between items in carousel
              padding: '10px',
            }}
          >
            <BlogCards
              blogTitle={blog.title}
              blogImage={blog.imageUrl || "https://placehold.jp/640x427.png"} // Use placeholder if no image is available
              blogShortDesc={blog.shortDesc}
              blogCreatedAt={new Date(blog.createdAt.seconds * 1000).toLocaleDateString()} // Convert timestamp to date string
              blogCreatedBy={blog.author || "Anonymous"}
              blogId={blog.id}
              onEdit={currentUser.uid === blog.authorId ? () => handleEdit(blog.id) : null} // Only show edit button for the author
              onDelete={currentUser.uid === blog.authorId ? () => handleDelete(blog.id) : null} // Only show delete button for the author
              hrefLink={`/blog/${blog.id}`} // Link to the blog post
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
