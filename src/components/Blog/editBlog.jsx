import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams for URL params
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { BlogPostInitialState, BlogPostReducer, SET_ERROR, SET_LOADING, UPDATE_BLOG } from '../Home/blogPostReducer';
// import { BlogPostReducer, BlogPostInitialState, UPDATE_BLOG, SET_LOADING, SET_ERROR } from './blogPostReducer'; // Import reducer and actions

const EditBlog = () => {
  const { blogId } = useParams(); // Get the blogId from the URL
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(BlogPostReducer, BlogPostInitialState);
  const [blog, setBlog] = useState({
    title: '',
    shortDesc: '',
    content: '',
    imageUrl: '',
  });
  const { blogs, isLoading, error } = state;

  useEffect(() => {
    
    // Fetch the blog data from Firestore when the component mounts
    const fetchBlogData = async () => {
      dispatch({ type: SET_LOADING, payload: true });
      try {
        const docRef = doc(db, 'blogs', blogId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setBlog(docSnap.data());
        } else {
          dispatch({ type: SET_ERROR, payload: 'Blog not found' });
        }
      } catch (err) {
        dispatch({ type: SET_ERROR, payload: 'Error fetching blog data' });
        console.log(err);
      } finally {
        dispatch({ type: SET_LOADING, payload: false });
      }
    };

    fetchBlogData();
  }, [blogId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog({
      ...blog,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const docRef = doc(db, 'blogs', blogId);

      // Update the blog data in Firestore
      await updateDoc(docRef, {
        title: blog.title,
        shortDesc: blog.shortDesc,
        content: blog.content,
        imageUrl: blog.imageUrl, // If the image URL changes, you can handle it similarly
      });

      // Dispatch the UPDATE_BLOG action to update the state
      dispatch({ 
        type: UPDATE_BLOG, 
        payload: { 
          id: blogId, 
          updatedData: blog 
        }
      });

      // Navigate back to the home page after updating the blog
      navigate(`/blog/${blogId}`);
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: 'Error updating blog' });
      console.error(err);
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  if (isLoading) {
    return <div className="text-xl font-medium pt-14">Loading...</div>;
  }

  if (error) {
    return <div className="text-xl font-medium pt-14">{error}</div>;
  }

  return (
    <div className="container w-96 mx-auto">
      <h2 className="text-3xl font-bold text-center mb-5">Edit Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control flex flex-col mb-5">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={blog.title}
            onChange={handleInputChange}
            className="min-h-5 p-3 outline-none"
            required
          />
        </div>
        <div className="form-control flex flex-col mb-5">
          <label htmlFor="shortDesc">Short Description</label>
          <textarea
            name="shortDesc"
            id="shortDesc"
            value={blog.shortDesc}
            onChange={handleInputChange}
            className="min-h-100 p-3 outline-none"
            required
          />
        </div>
        <div className="form-control flex flex-col mb-5">
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            value={blog.content}
            onChange={handleInputChange}
            className="min-h-100 p-3 outline-none"
            required
          />
        </div>
        <div className="form-control flex flex-col mb-5">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            value={blog.imageUrl}
            onChange={handleInputChange}
            className="min-h-5 p-3 outline-none"
          />
        </div>
        <button
          type="submit"
          className="p-5 bg-green-400 hover:brightness-50"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
