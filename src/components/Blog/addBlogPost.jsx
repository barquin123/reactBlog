import { useEffect, useReducer, useRef, useState } from 'react';
import { storage, db, auth } from '../../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { BlogInistialState, BlogReducer } from './addBlogReducer';

const AddBlogPost = () => {
  const [state, dispatch] = useReducer( BlogReducer, BlogInistialState);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = auth;
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
    setIsLoading(false);
  }, [currentUser, navigate]);

  const handleInputChange = e => {
    dispatch({
      type: 'changeInputs',
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      dispatch({
        type: 'changeFile',
        payload: { file, preview },
      });
      setFileName(file.name); // Set file name when file is selected
    }
  };

  // Function to clear the file and preview state
  const handleClearPreview = () => {
    dispatch({
      type: 'changeFile',
      payload: { file: null, preview: null },
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clears the file input
      setFileName(''); // Reset file name
    }
  };

  // Form validation function
  const validateForm = () => {
    let valid = true;

    // Reset previous errors
    dispatch({
      type: 'setError',
      payload: { field: 'title', message: '' },
    });
    dispatch({
      type: 'setError',
      payload: { field: 'shortDesc', message: '' },
    });
    dispatch({
      type: 'setError',
      payload: { field: 'content', message: '' },
    });

    // Validation checks
    if (!state.title) {
      dispatch({
        type: 'setError',
        payload: { field: 'title', message: 'Title is required' },
      });
      valid = false;
    }
    if (!state.shortDesc) {
      dispatch({
        type: 'setError',
        payload: { field: 'shortDesc', message: 'Short Description is required' },
      });
      valid = false;
    }
    if (!state.content) {
      dispatch({
        type: 'setError',
        payload: { field: 'content', message: 'Content is required' },
      });
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      setIsLoading(true);

      let downloadURL = null; // Initialize the image URL as null

      // Create a reference for the image in Firebase Storage
      if (state.file) {
        const storageRef = ref(storage, `blogImages/${state.file.name}`);

        // Upload the image to Firebase Storage
        await uploadBytes(storageRef, state.file);

        // Get the download URL of the uploaded image
        downloadURL = await getDownloadURL(storageRef);
      }

      // Prepare the blog post data
      const blogData = {
        title: state.title,
        shortDesc: state.shortDesc,
        content: state.content,
        imageUrl: downloadURL, // Save the image URL in Firestore
        createdAt: new Date(),
        author: currentUser ? currentUser.displayName : 'Anonymous',
        authorId: currentUser ? currentUser.uid : 'anonymous', // Add the authorId (current user's uid)
      };

      // Save the blog post data to Firestore and get the document reference
      const docRef = await addDoc(collection(db, 'blogs'), blogData);

      // You can now access the `docRef.id`, which is the auto-generated `blogId`

      // Optionally, you can navigate to the blog post or store `docRef.id` in the state
      navigate(`/blog/${docRef.id}`);

      // Hide loading state
      setIsLoading(false);

      // Reset the form state
    } catch (error) {
      console.error('Error uploading image or saving post:', error);
      alert('Error uploading image or saving post');
    }
  };

  function autoheight(element) {
    const el = document.getElementById(element);
    el.style.height = `${el.scrollHeight}px`;
  }

  return (
    <>
      {isLoading && (
        <div className="fixed loaderContainer top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 block">
          <div className="loader">
            <span>Loading...</span>
          </div>
        </div>
      )}

      <div className="AddBlogPostContainer container w-96 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-5">New Blog Post</h2>
        <form className="addBlogForm">
        <div className="form-control flex flex-col mb-5">
            <label>Thumbnail</label>
            <input
              type="file"
              className='thumbNailImg outline-none hidden' // Hide the file input
              onChange={handleImgChange}
              id='thumbNailImg'
              ref={fileInputRef} // Reference to the file input
            />
            {/* Custom file input */}
            <label
              htmlFor='thumbNailImg'
              className="cursor-pointer cursor-pointer text-gray-600 bg-blue-300 p-3 rounded-md text-center"
            >
              {fileName ? fileName : 'Choose a file'} {/* Show file name if selected */}
            </label>

            {state.imagePreview && (
              <div className="mt-3 relative">
                <img
                  src={state.imagePreview}
                  alt="Thumbnail Preview"
                  className="w-48 h-48 object-cover border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleClearPreview}
                  className="absolute top-0 right-0 text-white bg-red-500 rounded-full p-1"
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <div className="form-control flex flex-col mb-5">
            <label htmlFor="title">Title</label>
            <input
              className="min-h-5 p-3 outline-none"
              type="text"
              id="title"
              name="title"
              required
              onChange={handleInputChange}
              onInput={() => autoheight('title')}
            />
            {state.errors.title && (
              <p className="text-red-500 text-sm mt-2">{state.errors.title}</p>
            )}
          </div>
          <div className="form-control flex flex-col mb-5">
            <label htmlFor="content">Short Description</label>
            <textarea
              className="min-h-100 p-3 outline-none"
              id="shortDesc"
              name="shortDesc"
              required
              onChange={handleInputChange}
              onInput={() => autoheight('shortDesc')}
            />
            {state.errors.shortDesc && (
              <p className="text-red-500 text-sm mt-2">{state.errors.shortDesc}</p>
            )}
          </div>
          <div className="form-control flex flex-col mb-5">
            <label htmlFor="content">Content</label>
            <textarea
              className="min-h-100 p-3 outline-none"
              id="content"
              name="content"
              required
              onChange={handleInputChange}
              onInput={() => autoheight('content')}
            />
            {state.errors.content && (
              <p className="text-red-500 text-sm mt-2">{state.errors.content}</p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="p-5 bg-green-400 hover:brightness-50"
            type="submit"
          >
            Add Post
          </button>
        </form>
      </div>
    </>
  );
};

export default AddBlogPost;
