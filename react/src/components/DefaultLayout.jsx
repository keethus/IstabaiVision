import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {useEffect} from "react";
import axiosClient from "../axios-client.js";
import { UilSignOutAlt } from '@iconscout/react-unicons'

import 'devextreme/dist/css/dx.dark.css';
export default function DefaultLayout() {
  const {user, token, setUser, setToken} = useStateContext()

  if(!token) {
    return <Navigate to='/login' />
  }

  const onLogout = (e) => {
    e.preventDefault();

    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null)
      })
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
        setUser(data)
      })
  }, [])

  return (
    <div className="dark">
      <div>
        <div className="navbar bg-base-100 max-w-7xl mx-auto mt-2 rounded-box bg-neutral-800 shadow">
          <div className="navbar-start flex align-center pl-2">
            <h1 className="text-xl text-neutral-500 font-bold  ">Ojāra Vācieša 6B</h1>
          </div>
          <div className="navbar-center">
            <div className="tabs tabs-boxed bg-neutral-900">
              <Link to='/basement' className="tab tab-lg ">Basement</Link>
              <Link to='/first' className="tab tab-lg ">1st</Link>
              <Link to='/second' className="tab tab-lg ">2nd</Link>
            </div>
          </div>
          <div className="navbar-end">

            <a href="#" onClick={onLogout} className="btn btn-ghost btn-circle">
                <UilSignOutAlt className="fill-red-400" />
            </a>
          </div>
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
