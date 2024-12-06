import { useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams for URL params
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage utilities
import { db, storage } from '../../firebase/firebase'; // Import Firestore and Storage
import { BlogPostInitialState, BlogPostReducer, SET_ERROR, SET_LOADING, UPDATE_BLOG } from '../Home/blogPostReducer';

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
  const [selectedImage, setSelectedImage] = useState(null); // State to track the selected image file
  const [previewImage, setPreviewImage] = useState(''); // State for image preview
  const { isLoading, error } = state;

  useEffect(() => {
    // Fetch the blog data from Firestore when the component mounts
    const fetchBlogData = async () => {
      dispatch({ type: SET_LOADING, payload: true });
      try {
        const docRef = doc(db, 'blogs', blogId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBlog(data);
          setPreviewImage(data.imageUrl); // Set the existing image as the preview
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    // Generate a preview for the selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: SET_LOADING, payload: true });

    try {
      let imageUrl = blog.imageUrl; // Preserve the existing image URL if no new file is uploaded

      // If a new image file is selected, upload it to Firebase Storage
      if (selectedImage) {
        const storageRef = ref(storage, `blogImages/${blogId}/${selectedImage.name}`);
        await uploadBytes(storageRef, selectedImage);
        imageUrl = await getDownloadURL(storageRef); // Get the download URL for the uploaded file
      }

      const docRef = doc(db, 'blogs', blogId);

      // Update the blog data in Firestore
      await updateDoc(docRef, {
        title: blog.title,
        shortDesc: blog.shortDesc,
        content: blog.content,
        imageUrl, // Update the image URL
      });

      // Dispatch the UPDATE_BLOG action to update the state
      dispatch({
        type: UPDATE_BLOG,
        payload: {
          id: blogId,
          updatedData: { ...blog, imageUrl },
        },
      });

      // Navigate back to the blog page after updating
      navigate(`/blog/${blogId}`);
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: 'Error updating blog' });
      console.error(err);
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  const handleCancel = () => {
    navigate(`/blog/${blogId}`);
  }

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
          <label htmlFor="imageUrl" className='cursor-pointer'>Image
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-48 object-cover mb-4 rounded"
            />
          )}
          </label>
          {/* <label htmlFor="imageUrl ">{ previewImage ? previewImage : "choose file" }</label> */}
          <input
            type="file"
            name="imageUrl"
            id="imageUrl"
            onChange={handleFileChange}
            className="min-h-5 p-3 outline-none hidden"
          />
        </div>
        <div className="flex gap-2">
        <button
          type="submit"
          className="p-5 bg-green-400 hover:brightness-50"
        >
          Update Post
        </button>
        <button
          type="button"
          onClick={() => handleCancel()}
          className="p-5 bg-red-400 hover:brightness-50"
        >
          Cancel
        </button> 
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
