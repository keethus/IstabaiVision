import {Link} from "react-router-dom";
import {UilSignOutAlt} from "@iconscout/react-unicons";
import WarningsWindow from "./WarningsWindow.jsx";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import {useEffect, useState} from "react";
import SettingsWindow from "./SettingsWindow.jsx";

function Navigation({onLogout, warnings}) {
    const [floor, setFloor] = useState(localStorage.getItem('floor'));

    useEffect(() => {
        window.addEventListener('storage', () => {
            setFloor(localStorage.getItem('floor'))
        })
    }, []);


    return (
        <>
            <div className="navbar mx-auto rounded-box bg-neutral-900 shadow-lg z-[100] relative p-4">
                <div className="navbar-start flex align-center pl-2 gap-8">
                    <div className="form-control">
                        <div className="input-group ">
                            <input type="text" placeholder="Search…" className="input input-bordered bg-neutral-800 w-80" />
                            <button className="btn btn-square input-bordered hover:bg-neutral-600 bg-neutral-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </div>
                    </div>

                </div>
                <div className="navbar-center">
                    <h1 className="text-xl text-neutral-400 font-bold">Hexagons</h1>
                </div>
                <div className="navbar-end">
                    <SettingsWindow/>
                    <WarningsWindow warnings={warnings}/>
                    <button onClick={onLogout} className="btn btn-ghost btn-circle">
                        <UilSignOutAlt className="fill-red-500"/>
                    </button>
                </div>
            </div>
            <div className="z-50 relative mt-2  drop-shadow-lg w-fit">
                <div className="tabs tabs-boxed bg-neutral-900 font-bold text-3xl flex flex-col-reverse justify-between  w-fit rounded-2xl" >
                    <Link to='/basement' className={`tab tab-lg ${parseInt(floor) === 0 ? "bg-[#FFC107] rounded-2xl text-neutral-900" : ""}`}>0</Link>
                    <Link to='/first' className={`tab tab-lg ${parseInt(floor) === 1 ? "bg-[#FFC107] rounded-2xl text-neutral-900" : ""}`}>1</Link>
                    <Link to='/second' className={`tab tab-lg ${parseInt(floor) === 2 ? "bg-[#FFC107] rounded-2xl text-neutral-900" : ""}`}>2</Link>
                </div>
            </div>
        </>
    )
}
export default Navigation;