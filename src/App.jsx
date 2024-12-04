import Login from "./components/Auth/login";
import Register from "./components/Auth/register";
import AddBlogPost from "./components/Blog/addBlogPost";

import Header from "./components/Header";
import Home from "./components/Home";

import { AuthProvider } from "./context/authContext";
import { useRoutes, useLocation  } from "react-router-dom";
import BlogPost from "./components/Blog/index";
import EditBlog from "./components/Blog/editBlog";
import Profile from "./components/Auth/profile";

function App() {
  const location = useLocation();
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
      path: "/edit-blog/:blogId",  // Add route for edit blog
      element: <EditBlog />,  // Link to EditBlog component
    },
    {
      path: "/profile",  // Add route for edit blog
      element: <Profile />,  // Link to EditBlog component
    },
  ];
  let routesElement = useRoutes(routesArray);

  // const shouldShowHeader = location.pathname === "/home" || "/addblogpost";
  return (
    <AuthProvider>
      <Header />
      <div className="py-5">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;