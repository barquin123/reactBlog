import React, { useEffect, useReducer, useState } from 'react'
import { BlogInistialState, BlogReducer } from './blogReducer'
import {storage ,db, auth } from '../../firebase/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal';

// import { ref } from 'firebase/storage';

const AddBlogPost = () => {

  const [state, dispatch] = useReducer(BlogReducer, BlogInistialState);
  const [isloading, setIsLoading] = useState(false);
  const { currentUser } = auth;
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
    setIsLoading(false);
  },[currentUser, navigate])
  
  const handleInputChange = e => {
    dispatch({type: 'changeInputs', 
      payload: {name: e.target.name, value: e.target.value}
    })
  }

  const handleImgChange = e => {
    dispatch({
      type: 'changeFile', 
      payload: e.target.files[0]
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.image) {
      alert('Please select an image');
      return;
    }

    try {
      // Show loading state if needed
      setIsLoading(true);

      // Create a reference for the image in Firebase Storage
      const storageRef = ref(storage, `blogImages/${state.image.name}`);

      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, state.image);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      // Prepare the blog post data
      const blogData = {
        title: state.title,
        shortDesc: state.shortDesc,
        content: state.content,
        imageUrl: downloadURL, // Save the image URL in Firestore
        createdAt: new Date(),
        author: currentUser ? currentUser.displayName : 'Anonymous',
      };

      // Save the blog post data to Firestore
      await addDoc(collection(db, 'blogs'), blogData);

      // Hide loading state
      setIsLoading(false);
      // Reset the form state
      navigate('/home');

    } catch (error) {
      console.error('Error uploading image or saving post:', error);
      alert('Error uploading image or saving post');
    }
  };

  function autoheight(element) {
    var el = document.getElementById(element);
        el.style.height = (el.scrollHeight)+"px";
    }

  return (
    <>
      {/* {isloading && <Modal message='Error on creating blog' modalTitle="Blog Error" />} */}
      {isloading && <div className='fixed loaderContainer top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 block '>
          <div className="loader">
            <span>Loading...</span>
          </div>
        </div>}
      <div className="AddBlogPostContainer container w-96 mx-auto">
       <h2 className='text-3xl font-bold text-center mb-5'>New Blog Post</h2>
          <form className='addBlogForm'>
              <div className="form-control flex flex-col mb-5">
                <label htmlFor='thumbNailImg'>Thumbnail</label>
                <input type="file" className='thumbNailImg outline-none' onChange={handleImgChange} />
              </div>
              <div className="form-control flex flex-col mb-5">
                <label htmlFor="title">Title</label>
                <input className='min-h-5 p-3 outline-none' type='text' id='title' name='title' required onChange={handleInputChange} onInput={() => autoheight('title')}/>
              </div>
              <div className="form-control flex flex-col mb-5">
                <label htmlFor='content'>Short Description</label>
                  <textarea className='min-h-100 p-3 outline-none' id='shortDesc' name='shortDesc' required onChange={handleInputChange} onInput={() => autoheight('shortDesc')} />
              </div>
              <div className="form-control flex flex-col mb-5">
                <label htmlFor='content'>Content</label>
                  <textarea className='min-h-100 p-3 outline-none' id='content' name='content' required onChange={handleInputChange} onInput={() => autoheight('content')} />
              </div>
              <button onClick={handleSubmit} className='p-5 bg-green-400 hover:brightness-50' type='submit'>Add Post</button>
          </form>
      </div>
    </>
  )
}

export default AddBlogPost