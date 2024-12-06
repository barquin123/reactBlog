import { useEffect, useReducer, useRef } from "react";
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
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const carouselRef = useRef(null); // Ref for carousel container

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

  const handleScroll = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === "left" ? -270 : 270; // Scroll width
    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const { blogs, isLoading, error } = state;

  if (isLoading) {
    return <Loading/> ;
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
      <div className="block-items mb-8">
        {blogs.slice(0, 3).map((blog) => (
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

      {/* Remaining blog posts in a carousel */}
      <div className="relative px-5">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 z-10 hover:bg-gray-700"
          onClick={() => handleScroll("left")}
        >
          &#8249;
        </button>
        <div ref={carouselRef} className="carousel-container flex overflow-hidden space-x-4 scrollbar-hide">
          {blogs.slice(3).map((blog) => (
            <div key={blog.id} className="flex-shrink-0 w-72 p-2 shadow-md rounded-lg [&_img.blogThumb]:h-carouselImage [&>div.cards-Container]:min-h-carouselHome [&_h2.blogTitle]:text-xl" >
              <BlogCards
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
            </div>
          ))}
        </div>
        <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 z-10 hover:bg-gray-700" onClick={() => handleScroll("right")}>
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default Home;
