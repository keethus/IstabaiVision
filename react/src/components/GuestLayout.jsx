import {Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

import logo from "../assets/images/hex-logo.png";


export default function GuestLayout() {
  const {token} = useStateContext()
  if(token) {
    return <Navigate to='/' />
  }

  return (
    <div className="flex  flex-col dark h-screen justify-center">
      <img src={logo} alt="" className="h-40 mx-auto py-4"/>
      <main>
        <div className="card max-w-lg bg-neutral-800 shadow-xl mx-auto my-auto">
          <div className="card-body">
            <Outlet />
          </div>
        </div>
      </main> 

    </div>
  )
}
