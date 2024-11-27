import Login from "./components/Auth/login";
import Register from "./components/Auth/register";
import AddBlogPost from "./components/Blog/addBlogPost";

import Header from "./components/Header";
import Home from "./components/Home";

import { AuthProvider } from "./context/authContext";
import { useRoutes, useLocation  } from "react-router-dom";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
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
  ];
  let routesElement = useRoutes(routesArray);

  const shouldShowHeader = location.pathname === "/home" || "/addblogpost";
  return (
    <AuthProvider>
      {shouldShowHeader && <Header />}
      <div className="py-5">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;