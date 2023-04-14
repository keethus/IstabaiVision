import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {memo, useCallback, useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {
    UilBatteryBolt,
    UilBatteryEmpty,
    UilDatabase,
    UilExclamationCircle,
    UilExclamationTriangle,
    UilEye,
    UilFavorite,
    UilGrids,
    UilKeyholeCircle,
    UilLightbulb,
    UilMapMarkerPlus,
    UilPlug,
    UilSignal,
    UilSignOutAlt,
    UilSubway,
    UilSync,
    UilTear,
    UilTemperature,
    UilToggleOn,
} from '@iconscout/react-unicons'

import 'devextreme/dist/css/dx.dark.css';
import {Button, Dropdown} from "react-daisyui";
import moment from "moment";
import {createStore} from "redux";
import {Provider, useDispatch, useSelector} from "react-redux";




export default function DefaultLayout() {
    const {user, token, setUser, setToken} = useStateContext()
    const [warnings, setWarnings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState(null);

    const initialState = {
        deviceDetails: null
    }

    function deviceReducer(state = initialState, action) {
        switch (action.type) {
            case 'SET_DEVICE_DETAILS':
                return { ...state, deviceDetails: action.payload };
            default:
                return state;
        }
    }

    const store = createStore(deviceReducer)

    moment.locale('LV')
    if (!token) {
        return <Navigate to='/login'/>
    }

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

    const signalStrengthClasses = [
        { range: [0.9, 1], class: "fill-green-500" },
        { range: [0.8, 0.9], class: "fill-green-400" },
        { range: [0.7, 0.8], class: "fill-lime-400" },
        { range: [0.6, 0.7], class: "fill-lime-300" },
        { range: [0.5, 0.6], class: "fill-yellow-400" },
        { range: [0.4, 0.5], class: "fill-amber-500" },
        { range: [0.3, 0.4], class: "fill-orange-400" },
        { range: [0.2, 0.3], class: "fill-orange-600" },
        { range: [0.1, 0.2], class: "fill-red-400" },
    ];

    const getSignalStrengthClass = (signalStrength) => {
        const item = signalStrengthClasses.find((item) =>
            signalStrength >= item.range[0] && signalStrength <= item.range[1]
        );
        return item ? item.class : "";
    };


    // change
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

    function SelectFilter({filter, onFilterChange}) {
        return (
            <select
                className="select select-bordered bg-neutral-800 w-full max-w-xs mt-5"
                onChange={(e) => onFilterChange(e.target.value)}
                value={filter}>

                <option defaultValue disabled>Select type</option>
                <option value={"NO_FILTER"}>No Filter</option>
                <option value={"BASE_STATION"}>Base Stations</option>
                <option value={"TEMPERATURE_SENSOR"}>Climate Sensors</option>
                <option value={"MOTION_SENSOR"}>Motion Sensors</option>
                <option value={"SWITCH_BOILER"}>Boiler Switches</option>
                <option value={"WALL_PLUG"}>Wall Plug</option>
                <option value={"RELAY_S2P4"}>Relays</option>
                <option value={"SIEMENS_SSA955"}>Siemens SSA955</option>
            </select>
        )
    }

    function DeviceList({filteredDevices, handleDeviceChange}) {
        return (
            <ul className="space-y-2 mt-4 menu p-2 rounded-box">
                {filteredDevices && filteredDevices.devices?.map((device, index) => {
                    let icon, battery, infoIcon, fillClass

                    fillClass = getSignalStrengthClass(device.signal_strength);

                    if (device.type === 'BASE_STATION') {
                        icon = <UilDatabase/>
                    } else if (device.type === 'MOTION_SENSOR') {
                        icon = <UilEye/>
                        if (device.battery === 0) {
                            infoIcon = <UilBatteryEmpty className="fill-orange-400" size="20"/>
                        } else {
                            infoIcon = <UilBatteryBolt size="20"/>
                        }
                    } else if (device.type === 'TEMPERATURE_SENSOR') {
                        icon = <UilTemperature/>
                        if (device.battery === 0) {
                            infoIcon = <UilBatteryEmpty className="fill-orange-400" size="20"/>
                        } else {
                            infoIcon = <UilBatteryBolt size="20"/>
                        }
                    } else if (device.type === "SIEMENS_SSA955") {
                        icon = <UilGrids/>
                        infoIcon = <UilSignal className={fillClass} size="20"/>;
                    } else if (device.type === "SWITCH_BOILER") {
                        icon = <UilTear/>
                        infoIcon = <UilSignal className={fillClass} size="20"/>;
                    } else if (device.type === "RELAY_S2P4") {
                        icon = <UilToggleOn/>
                        infoIcon = <UilSignal className={fillClass} size="20"/>;
                    } else if (device.type === "WALL_PLUG") {
                        icon = <UilPlug/>
                        infoIcon = <UilSignal className={fillClass} size="20"/>;
                    }
                    return (
                        <li key={device.id}>
                            <a href="#"
                               onClick={(event) => handleDeviceChange(device, event)}
                               className="text-sm">
                                {icon}
                                <p>
                                    <span className="font-bold">{device.id}</span> <br/>
                                    <span className="text-[10px]">{device.type}
                                        <span className="font-bold absolute top-1 right-1 text-neutral-700 text-[5px]"> {infoIcon}</span>
                                    </span>
                            </p></a>
                        </li>
                    )
                })}
            </ul>
        )
    }



    function FilterableDeviceList({devices}) {
        const [filter, setFilter] = useState('NO_FILTER');
        const [filteredDevices, setFilteredDevices] = useState(devices);
        const dispatch = useDispatch();

        useEffect(() => {
            if (filter === 'NO_FILTER') {
                setFilteredDevices(devices);
            } else {
                setFilteredDevices({
                    devices: devices.devices.filter((device) => device.type === filter)
                });
            }
        }, [filter]);

        function handleDeviceChange(deviceDetails){
            dispatch({ type: 'SET_DEVICE_DETAILS', payload: deviceDetails });

        }

        return (
            <div>
                <SelectFilter
                    onFilterChange={setFilter}
                    filter={filter} />
                <DeviceList filteredDevices={filteredDevices} handleDeviceChange={handleDeviceChange}/>

            </div>
        )
    }

    function Warnings() {
        return (
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                    <UilExclamationTriangle className="fill-orange-400"/>
                    <div
                        className="badge absolute top-1 left-6 bg-orange-500 text-neutral-900">{warnings && warnings.warnings.length}</div>
                </label>
                <div tabIndex={0}
                     className="dropdown-content card card-compact w-80 p-2 shadow bg-neutral-900 text-primary-content">
                    <div className="card-body">
                        <h3 className="card-title text-orange-400">Warnings!</h3>

                        {warnings && warnings.warnings.map((warning, index) => {
                            return (
                                <div key={index}>
                                    <p>{warning.text}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    function Navigation() {
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
                   <Warnings/>

                    <button onClick={onLogout} className="btn btn-ghost btn-circle">
                        <UilSignOutAlt className="fill-red-500"/>
                    </button>
                </div>
            </div>
        )
    }

    function SideBar() {
        return <>
            <button data-drawer-target="cta-button-sidebar" data-drawer-toggle="cta-button-sidebar"
                    aria-controls="cta-button-sidebar" type="button"
                    className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd"
                          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>
            <aside
                className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 shadow"
                aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-neutral-900 rounded-r-xl">
                    <h1 className="text-xl text-neutral-400 font-bold mt-6">Devices</h1>
                    <FilterableDeviceList devices={devices}/>
                </div>
            </aside>
        </>
    }

    function DeviceDetailExtraInfo({device}) {
        return (
             <div className="py-4">
                 {device.channels.P1 && device.channels.P1.type === "SWITCH"  &&
                    <div className="flex">
                        <div className="align-center my-auto">
                            <UilFavorite size="16" className="self-center mr-1"/>
                        </div>
                        <div>
                            <p className="text-sm font-semibold flex self-center">
                                {device.channels.P1.switch.name}
                            </p>
                            <p className="text-xs  flex self-center">
                                {device.channels.P1.switch.group}
                            </p>
                        </div>
                    </div>
                 }
                 {device.channels.P2 && device.channels.P2.type === "SWITCH"  &&
                    <div className="flex">
                        <div className="align-center my-auto">
                            <UilFavorite size="16" className="self-center mr-1"/>
                        </div>
                        <div>
                            <p className="text-sm font-semibold flex self-center">
                                {device.channels.P2.switch.name}
                            </p>
                            <p className="text-xs  flex self-center">
                                {device.channels.P2.switch.group}
                            </p>
                        </div>
                    </div>
                 }
                 {device.channels.P3 && device.channels.P3.type === "SWITCH"  &&
                     <div className="flex">
                         <div className="align-center my-auto">
                             <UilFavorite size="16" className="self-center mr-1"/>
                         </div>
                         <div>
                             <p className="text-sm font-semibold flex self-center">
                                 {device.channels.P3.switch.name}
                             </p>
                             <p className="text-xs  flex self-center">
                                 {device.channels.P3.switch.group}
                             </p>
                         </div>
                     </div>
                 }
                 {device.channels.P4 && device.channels.P4.type === "SWITCH"  &&
                     <div className="flex">
                         <div className="align-center my-auto">
                             <UilFavorite size="16" className="self-center mr-1"/>
                         </div>
                         <div>
                             <p className="text-sm font-semibold flex self-center">
                                 {device.channels.P4.switch.name}
                             </p>
                             <p className="text-xs  flex self-center">
                                 {device.channels.P4.switch.group}
                             </p>
                         </div>
                     </div>
                 }
                 {device.channels.P5 && device.channels.P5.type === "SWITCH"  &&
                     <div className="flex">
                         <div className="align-center my-auto">
                             <UilFavorite size="16" className="self-center mr-1"/>
                         </div>
                         <div>
                             <p className="text-sm font-semibold flex self-center">
                                 {device.channels.P5.switch.name}
                             </p>
                             <p className="text-xs  flex self-center">
                                 {device.channels.P5.switch.group}
                             </p>
                         </div>
                     </div>
                 }
                 {device.channels.S1 && device.channels.S1.type === "SWITCH" &&
                     <div className="flex">
                         <div className="align-center my-auto">
                             <UilFavorite size="16" className="self-center mr-1"/>
                         </div>
                         <div>
                             <p className="text-sm font-semibold flex self-center">
                                 {device.channels.S1.switch.name}
                             </p>
                             <p className="text-xs  flex self-center">
                                 {device.channels.S1.switch.group}
                             </p>
                         </div>
                     </div>
                 }
                 {device.channels.S2 && device.channels.S2.type === "SWITCH" &&
                     <div className="flex">
                         <div className="align-center my-auto">
                             <UilFavorite size="16" className="self-center mr-1"/>
                         </div>
                         <div>
                             <p className="text-sm font-semibold flex self-center">
                                 {device.channels.S2.switch.name}
                             </p>
                             <p className="text-xs  flex self-center">
                                 {device.channels.S2.switch.group}
                             </p>
                         </div>
                     </div>
                 }
                 {device.channels.S3 && device.channels.S3.type === "SWITCH" &&
                     <div className="flex">
                         <div className="align-center my-auto">
                             <UilFavorite size="16" className="self-center mr-1"/>
                         </div>
                         <div>
                             <p className="text-sm font-semibold flex self-center">
                                 {device.channels.S3.switch.name}
                             </p>
                             <p className="text-xs  flex self-center">
                                 {device.channels.S3.switch.group}
                             </p>
                         </div>
                     </div>
                 }
                 {device.channels.S4 && device.channels.S4.type === "SWITCH" &&
                     <div className="flex">
                         <div className="align-center my-auto">
                             <UilFavorite size="16" className="self-center mr-1"/>
                         </div>
                         <div>
                             <p className="text-sm font-semibold flex self-center">
                                 {device.channels.S4.switch.name}
                             </p>
                             <p className="text-xs  flex self-center">
                                 {device.channels.S4.switch.group}
                             </p>
                         </div>
                     </div>
                 }
            </div>
        )
    }

    function DeviceDetailWindow() {
        const [buttonClass, setButtonClass] = useState('bg-neutral-800')
        const [buttonActive, setButtonActive] = useState(false)
        const [buttonText, setButtonText] = useState('Place on map')
        const device = useSelector(state => state.deviceDetails)

        useEffect(() => {
            if(buttonActive === true) {
                setButtonClass('bg-primary text-white')
                setButtonText('Cancel')
            } else {
                setButtonClass('bg-neutral-800')
                setButtonText('Place on map')
            }


        }, [buttonActive])

        console.log(device)
        if(device) {
            let fillClass, icon, info, error, extraInfo, extraIcon, battery

            fillClass = getSignalStrengthClass(device.signal_strength);

            if(device.signal_strength) {
                icon = <UilSignal className={fillClass} size="22"/>
            } else {
                icon = '';
            }

            if(device.battery) {
                battery = <p className="text-xs flex"><UilBatteryBolt size="16" className="self-center mr-1"/>{device.battery}%</p>
            } else if(device.battery === 0) {
                battery = <p className="text-xs flex"><UilBatteryEmpty size="16"  className="self-center mr-1 fill-orange-400"/>{device.battery}%</p>
            }

            if(device.error) {
                error = <p className="text-xs flex pt-4"><UilExclamationCircle size="16"  className="self-center mr-1 fill-red-500"/>{device.error}</p>
            }

            if(device.channels) {
                if(!device.multichannel) {
                    info = <p className="text-xs flex self-center">
                        <UilFavorite size="16" className="self-center mr-1"/>
                        {device.channels.S1.type}
                    </p>

                    if(device.channels.S1.type === 'SWITCH') {
                        if(device.channels.S1.switch.icon === 'subway') {
                            extraIcon = <UilSubway size="26" className="self-center mr-2"/>
                        } else if(device.channels.S1.switch.icon === 'key' || device.channels.S1.switch.icon === 'unlock-alt' || device.channels.S1.switch.icon === 'unlock' || device.channels.S1.switch.icon === 'universal-access') {
                            extraIcon = <UilKeyholeCircle size="26" className="self-center mr-2"/>
                        } else if(device.channels.S1.switch.icon === 'toggle-on') {
                            extraIcon = <UilToggleOn size="26" className="self-center mr-2"/>
                        } else if(device.channels.S1.switch.icon === 'spinner' || device.channels.S1.switch.icon === 'adn' || device.channels.S1.switch.icon === 'bullseye') {
                            extraIcon = <UilLightbulb size="26" className="self-center mr-2"/>
                        }
                        extraInfo = <div className="py-4 flex">
                            <div className="align-center my-auto">
                                {extraIcon}
                            </div>
                            <div>
                                <p className="text-sm font-semibold flex self-center">
                                    {device.channels.S1.switch.name}
                                </p>
                                <p className="text-xs  flex self-center">
                                    {device.channels.S1.switch.group}
                                </p>
                            </div>
                        </div>
                    }
                }
            } else if(device.kind) {
                info = <p className="text-xs flex self-center">
                    <UilFavorite size="16" className="self-center mr-1"/>
                    {device.kind}
                </p>
            }

            if(device.multichannel) {
                extraInfo = <DeviceDetailExtraInfo device={device}/>
            }

            const placeMarker = () => {
                setButtonActive(!buttonActive)

            }

            return (
                    <div className="absolute bottom-0 right-0 w-96 ">
                        {buttonActive &&

                            <div className="modal-box bg-neutral-900 shadow-lg flex h-auto animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Click on map to place marker!
                            </div>

                        }
                        <div className="modal-box bg-neutral-900 shadow-lg h-auto">
                            <div className="modal-header">
                                <div>
                                    <div>
                                        <h1 className="modal-title font-bold">{device.id}</h1>
                                        <p className="text-xs pb-2">{device.type}</p>
                                        <p className="text-xs flex">
                                            <UilSync  size="16" className="mr-1 self-center"/>
                                            {moment.unix(device._t_last_data).fromNow()}
                                        </p>
                                        {info}
                                        {battery}
                                        {extraInfo}
                                        {error}
                                    </div>
                                    <div className="absolute right-1 top-1 m-5">
                                        {icon}
                                    </div>
                                    <div className="pt-4">
                                        <Button onClick={placeMarker} className={`btn btn-wide w-full { hover:bg-neutral-700 border-1 border-neutral-700 flex justify-between ${buttonClass}`} >
                                            {buttonText}
                                            <UilMapMarkerPlus />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            )
        }
    }

    return (
        <div className="dark">
            <div className="flex">
                <div className="w-48 h-full flex-1">
                    <Provider store={store}>
                        <SideBar/>
                        <div className="p-4 sm:ml-64">
                            <Navigation/>
                            <main>
                                <DeviceDetailWindow/>
                                <Outlet/>
                            </main>
                        </div>
                    </Provider>
                </div>
            </div>
        </div>
    )
}
