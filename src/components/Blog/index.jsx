import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // make sure to import your Firestore configuration

const BlogPost = () => {
  const { id } = useParams(); // Use the `id` from the URL
  const [blog, setBlog] = useState(null); // State to store the blog data
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading state while fetching
  }

  if (!blog) {
    return <div>Blog post not found</div>; // In case the blog doesn't exist
  }

  return (
    <div className="BlogPostContainer">
      <h1>{blog.title}</h1>
      <img src={blog.imageUrl} alt={blog.title} className="blog-image" />
      <p><strong>Author:</strong> {blog.author}</p>
      <p><strong>Published on:</strong> {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}</p>
      <h3>Short Description</h3>
      <p>{blog.shortDesc}</p>
      <h3>Content</h3>
      <p>{blog.content}</p>
    </div>
  );
};

export default BlogPost;
