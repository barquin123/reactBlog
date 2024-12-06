import { useEffect } from "react";
import { useRoutes, useLocation } from "react-router-dom";

import Login from "./components/Auth/login";
import Register from "./components/Auth/register";
import AddBlogPost from "./components/Blog/addBlogPost";
import Header from "./components/Header";
import Home from "./components/Home";
import { AuthProvider } from "./context/authContext";
import BlogPost from "./components/Blog/index";
import EditBlog from "./components/Blog/editBlog";
import Profile from "./components/Auth/profile";
import Particlesjsx from "./components/particles/particles";

function App() {
  const location = useLocation();

  // Set the document title whenever the route changes
  useEffect(() => {
    // Define titles for specific routes inside useEffect
    const routeTitles = {
      "/": "Home - My Blog App",
      "/login": "Login - My Blog App",
      "/register": "Register - My Blog App",
      "/home": "Home - My Blog App",
      "/addblogpost": "Add Blog Post - My Blog App",
      "/profile": "Profile - My Blog App",
      // We need to match dynamic routes like "/blog/:id" and "/edit-blog/:blogId"
    };

    const currentPath = location.pathname;
    
    // Try to match dynamic routes
    if (currentPath.startsWith("/blog/")) {
      document.title = "Blog Post - My Blog App";
    } else if (currentPath.startsWith("/edit-blog/")) {
      document.title = "Edit Blog Post - My Blog App";
    } else {
      // For static paths
      document.title = routeTitles[currentPath] || "My Blog App"; // Fallback title
    }
  }, [location.pathname]); // Only depend on location.pathname

  // Define routes
  const routesArray = [
    {
      path: "*",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/addblogpost",
      element: <AddBlogPost />,
    },
    {
      path: "/blog/:id",
      element: <BlogPost />,
    },
    {
      path: "/edit-blog/:blogId",
      element: <EditBlog />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
  ];
  let routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
        <Particlesjsx />
      <div className="content">
        <Header />
        <div className="py-5">{routesElement}</div>
      </div>
    </AuthProvider>
  );
}

export default App;
