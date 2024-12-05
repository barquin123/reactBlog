import { useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // make sure to import your Firestore configuration
import { BlogPostInitialState, BlogPostReducer, DELETE_BLOG } from '../Home/blogPostReducer';
import { useAuth } from '../../context/authContext';

const BlogPost = () => {
  const { id } = useParams(); // Use the `id` from the URL
  const [blog, setBlog] = useState(null); // State to store the blog data
  const [isLoading, setIsLoading] = useState(true);
  const {currentUser} = useAuth(); // Get the current user
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(BlogPostReducer, BlogPostInitialState);
  useEffect(() => {
    // Fetch blog post from Firestore by `id`
    const fetchBlogPost = async () => {
      try {
        // Get the document from the `blogs` collection with the `id`
        const blogDoc = await getDoc(doc(db, 'blogs', id));
        
        if (blogDoc.exists()) {
          setBlog(blogDoc.data()); // Set the blog data in state
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setIsLoading(false); // Hide loading after fetch
      }
    };

    fetchBlogPost();
  }, [id]);

  const handleEdit = (blogId) => {
    navigate(`/edit-blog/${blogId}`);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const docRef = doc(db, "blogs", blogId);
        await deleteDoc(docRef);
        dispatch({ type: DELETE_BLOG, payload: blogId });
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while fetching
  }

  if (!blog) {
    return <div>Blog post not found</div>; // In case the blog doesn't exist
  }

  return (
    <div className="BlogPostContainer max-w-3xl mx-auto">
      <div className="container w-full m-auto p-6 rounded-2xl border-solid border-white border backdrop-blur-3xl bg-black ">
      <h1 className='font-bold uppercase text-center text-3xl mb-5'>{blog.title}</h1>
        <figure className='relative overflow-hidden mb-5 '>
          <img src={blog.imageUrl} alt="" className="bgimg absolute  " style={{ background: `url(${blog.imageUrl})`, filter: 'blur(10px)', zIndex: "-1"}} />
          <img src={blog.imageUrl} alt={blog.title} className={`blog-image m-auto ${blog.imageUrl ? '' : 'hidden'} max-h-cardBlog`} />
        </figure>
        <div className="flex justify-between mb-5">
          <p><strong>Author:</strong> {blog.author}</p>
          <p><strong>Published on:</strong> {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</p>
        </div>
        <p className='italic mb-5 border-b border-solid border-white'>{blog.shortDesc}</p>
        <p>{blog.content}</p>
       {(currentUser && currentUser.uid === blog.authorId) && (
        <div className="actions mt-3">
              <button 
                onClick={() => handleEdit(id)}
                className="editBtn text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(id)}
                className="deleteBtn text-red-500 hover:underline ml-3"
              >
                Delete
              </button>
          </div>
       )}
      </div>
    </div>
  );
};

export default BlogPost;
