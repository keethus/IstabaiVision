import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";

import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";

import First from "./views/Floors/First.jsx";
import Second from "./views/Floors/Second.jsx";
import Basement from "./views/Floors/Basement.jsx";


const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/first" />
      },
      {
        path: '/basement',
        element: <Basement />
      },
      {
        path: '/first',
        element: <First />
      },
      {
        path: '/second',
        element: <Second />
      },
    ]
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <Signup />
      },
    ]
  },


  {
    path: "*",
    element: <NotFound />
  }
])

export default router;
