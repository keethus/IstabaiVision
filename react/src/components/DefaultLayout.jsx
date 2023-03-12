import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {
    UilBatteryBolt, UilBatteryEmpty,
    UilBell,
    UilDatabase,
    UilExclamationTriangle,
    UilEye, UilGrid, UilGrids, UilPlug, UilSignal,
    UilSignOutAlt, UilTear,
    UilTemperature, UilToggleOn, UilWater
} from '@iconscout/react-unicons'

import 'devextreme/dist/css/dx.dark.css';
import {Dropdown} from "react-daisyui";
export default function DefaultLayout() {
  const {user, token, setUser, setToken} = useStateContext()
    const [warnings, setWarnings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState(null);

  if(!token) {
    return <Navigate to='/login' />
  }

    useEffect(() => {
        if(loading === false) {
            setTimeout(() => {
                getWarnings()
            }, 10000);
        }
    }, [loading])

    useEffect(() => {
        getDevices()
        getWarnings()
    }, [])

    const getWarnings = () => {
        setLoading(true)
        fetch(`https://api.istabai.com/2/homes.warnings.json?api_key=${import.meta.env.VITE_ISTABAI_API_KEY}&home_id=1155`)
            .then(r => r.json())
            .then(data => {
                setLoading(false)
                setWarnings(data)
                console.log('istabai warnings', data)
            })
            .catch(e => {
                setLoading(false)
                console.log('istabai error', e)
            })
    }
    const getDevices = () => {
        fetch(`https://api.istabai.com/2/devices.list.json?api_key=${import.meta.env.VITE_ISTABAI_API_KEY}&home_id=1155`)
            .then(r => r.json())
            .then(data => {
                setDevices(data)
                console.log('istabai devices', data)
            })
            .catch(e => {
                console.log('istabai error', e)
            })
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
        <div className="flex">
        <div className="w-48 h-full flex-1">

            <button data-drawer-target="cta-button-sidebar" data-drawer-toggle="cta-button-sidebar" aria-controls="cta-button-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="cta-button-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 shadow" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-neutral-900 rounded-r-xl">
                    <h1 className="text-xl text-neutral-400 font-bold mt-6">Devices</h1>
                    <select className="select select-bordered bg-neutral-800 w-full max-w-xs mt-5 ">
                        <option defaultValue={"BASE_STATION"}>Base Stations</option>
                        <option>Climate Sensors</option>
                        <option>Large Orange</option>
                        <option>Large Tomato</option>
                    </select>
                    <ul className="space-y-2 mt-4 menu p-2 rounded-box">
                        {devices && devices.devices.map((device, index) => {
                            let icon;
                            let battery;
                            let infoIcon;
                            let fillClass = 'fill-green-400';

                            if(device.signal_strength > 0.9) {
                                fillClass = "fill-green-500";
                            } else if (device.signal_strength > 0.8) {
                                fillClass = "fill-green-400";
                            } else if (device.signal_strength > 0.7) {
                                fillClass = "fill-lime-400";
                            } else if (device.signal_strength > 0.6) {
                                fillClass = "fill-lime-300";
                            } else if (device.signal_strength > 0.5) {
                                fillClass = "fill-yellow-400";
                            } else if (device.signal_strength > 0.4) {
                                fillClass = "fill-amber-500";
                            } else if (device.signal_strength > 0.3) {
                                fillClass = "fill-orange-400";
                            } else if (device.signal_strength > 0.2) {
                                fillClass = "fill-orange-600";
                            } else if (device.signal_strength > 0.1) {
                                fillClass = "fill-red-400";
                            }

                            if(device.type === 'BASE_STATION') {
                                icon = <UilDatabase/>
                            } else if(device.type === 'MOTION_SENSOR') {
                                icon = <UilEye />
                                if(device.battery === 0) {
                                    infoIcon = <UilBatteryEmpty className="fill-orange-400" size="20"/>
                                } else {
                                    infoIcon = <UilBatteryBolt size="20"/>
                                }
                            } else if(device.type === 'TEMPERATURE_SENSOR') {
                                icon = <UilTemperature />
                                if(device.battery === 0) {
                                    infoIcon = <UilBatteryEmpty className="fill-orange-400" size="20"/>
                                } else {
                                    infoIcon = <UilBatteryBolt size="20"/>
                                }
                            } else if(device.type === "SIEMENS_SSA955") {
                                icon = <UilGrids  />
                                infoIcon = <UilSignal className={fillClass} size="20" />;
                            } else if(device.type === "SWITCH_BOILER") {
                                icon = <UilTear/>
                                infoIcon = <UilSignal className={fillClass} size="20" />;
                            } else if(device.type === "RELAY_S2P4") {
                                icon = <UilToggleOn/>
                                infoIcon = <UilSignal className={fillClass} size="20" />;
                            } else if(device.type === "WALL_PLUG") {
                                icon = <UilPlug/>
                                infoIcon = <UilSignal className={fillClass} size="20" />;
                            }
                            return (
                                <li key={index}>
                                    <a className="text-sm"> {icon}  <p><span className="font-bold">{device.id}</span> <br /> <span className="text-[10px]">{device.type} <span className="font-bold absolute top-1 right-1 text-neutral-700 text-[5px]"> {infoIcon}</span></span></p></a>
                                </li>
                            )
                        })}
                        <li>
                            <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">Kanban</span>
                                <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
                            </a>
                        </li>
                    </ul>
                    <div id="dropdown-cta" className="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900" role="alert">
                        <div className="flex items-center mb-3">
                            <span className="bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">Beta</span>
                            <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 inline-flex h-6 w-6 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800" data-dismiss-target="#dropdown-cta" aria-label="Close">
                                <span className="sr-only">Close</span>
                                <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                        </div>
                        <p className="mb-3 text-sm text-blue-800 dark:text-blue-400">
                            Preview the new Flowbite dashboard navigation! You can turn the new navigation off for a limited time in your profile.
                        </p>
                        <a className="text-sm text-blue-800 underline hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" href="#">Turn new navigation off</a>
                    </div>
                </div>
            </aside>

            <div className="p-4 sm:ml-64">
                <div className="navbar bg-base-100 max-w-8xl mx-auto  rounded-box bg-neutral-900 shadow">
                    <div className="navbar-start flex align-center pl-2">
                        <h1 className="text-xl text-neutral-400 font-bold  ">Hexagons</h1>
                    </div>
                    <div className="navbar-center">
                        <div className="tabs tabs-boxed bg-neutral-900">
                            <Link to='/basement' className="tab tab-lg ">0th</Link>
                            <Link to='/first' className="tab tab-lg ">1st</Link>
                            <Link to='/second' className="tab tab-lg ">2nd</Link>
                        </div>
                    </div>
                    <div className="navbar-end">


                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle" >
                                <UilExclamationTriangle className="fill-orange-400"/> <div className="badge absolute top-1 left-6 bg-orange-500 text-neutral-900">{warnings && warnings.warnings.length}</div>
                            </label>
                            <div tabIndex={0} className="dropdown-content card card-compact w-80 p-2 shadow bg-neutral-900 text-primary-content">
                                <div className="card-body">
                                    <h3 className="card-title text-orange-400">Warnings!</h3>

                                    {warnings && warnings.warnings.map((warning, index) => {
                                        return (
                                            <div key={index}>
                                                <p>{warning.text}</p>
                                            </div>
                                        )
                                    } )}

                                </div>
                            </div>
                        </div>

                        <button  onClick={onLogout} className="btn btn-ghost btn-circle">
                            <UilSignOutAlt className="fill-red-500" />
                        </button>
                    </div>
                </div>
                <main >
                    <Outlet />
                </main>
            </div>

        </div>

        </div>
    </div>
  )
}
