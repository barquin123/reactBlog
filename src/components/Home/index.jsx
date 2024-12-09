import { useEffect, useReducer, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import BlogCards from "../Blog/blogCards";
import {
  BlogPostInitialState,
  BlogPostReducer,
  DELETE_BLOG,
  SET_BLOGS,
  SET_ERROR,
  SET_LOADING,
} from "./blogPostReducer";
import Loading from "../Modal/loading";

const Home = () => {
  const [state, dispatch] = useReducer(BlogPostReducer, BlogPostInitialState);
  const [visibleBlogsCount, setVisibleBlogsCount] = useState(3); // Keep track of the number of blogs to show
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: SET_LOADING, payload: true });

        const blogCollection = collection(db, "blogs");
        const blogSnapshot = await getDocs(blogCollection);
        const blogList = blogSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

        dispatch({ type: SET_BLOGS, payload: blogList });
      } catch (error) {
        dispatch({ type: SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: SET_LOADING, payload: false });
      }
    };

    fetchData();
  }, [navigate]);

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

  const handleLoadMore = () => {
    setVisibleBlogsCount((prevCount) => prevCount + 3); // Load 3 more blogs
  };

  const { blogs, isLoading, error } = state;

  if (isLoading) {
    return <Loading />;
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

      {/* First few blog posts as block elements */}
      <div className="block-items mb-8">
        {blogs.slice(0, visibleBlogsCount).map((blog) => (
          <BlogCards
            key={blog.id}
            blogTitle={blog.title}
            blogImage={blog.imageUrl || "https://placehold.jp/640x427.png"}
            blogShortDesc={blog.shortDesc}
            blogCreatedAt={new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}
            blogCreatedBy={blog.author || "Anonymous"}
            blogId={blog.id}
            onEdit={currentUser && currentUser.uid === blog.authorId ? () => handleEdit(blog.id) : null}
            onDelete={currentUser && currentUser.uid === blog.authorId ? () => handleDelete(blog.id) : null}
            hrefLink={`/blog/${blog.id}`}
          />
        ))}
      </div>

      {/* Load More Button */}
      {visibleBlogsCount < blogs.length && (
        <div className="text-center mt-4">
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
