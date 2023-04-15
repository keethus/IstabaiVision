import {Link} from "react-router-dom";
import {UilSignOutAlt} from "@iconscout/react-unicons";
import WarningWindow from "./WarningWindow.jsx";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import {useEffect} from "react";

function Navigation({onLogout}) {


    return (
        <div className="navbar bg-base-100 max-w-8xl mx-auto rounded-box bg-neutral-900 shadow-lg">
            <div className="navbar-start flex align-center pl-2">
                <h1 className="text-xl text-neutral-400 font-bold">Hexagons</h1>
            </div>
            <div className="navbar-center">
                <div className="tabs tabs-boxed bg-neutral-900 font-bold text-3xl" >
                    <Link to='/basement' className="tab tab-lg ">0</Link>
                    <Link to='/first' className="tab tab-lg ">1</Link>
                    <Link to='/second' className="tab tab-lg ">2</Link>
                </div>
            </div>
            <div className="navbar-end">
                <WarningWindow/>

                <button onClick={onLogout} className="btn btn-ghost btn-circle">
                    <UilSignOutAlt className="fill-red-500"/>
                </button>
            </div>
        </div>
    )
}
export default Navigation;