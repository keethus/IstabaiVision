import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import 'devextreme/dist/css/dx.dark.css';
import moment from "moment";
import {createStore} from "redux";
import {Provider} from "react-redux";
import DeviceDetailWindow from "./devices/DeviceDetailWindow.jsx";
import SideBar from "./navigation/SideBar.jsx";
import Navigation from "./navigation/Navigation.jsx";
import {mergeDevices} from "./utils.jsx";

export default function DefaultLayout() {
    moment.locale('LV')
    const {user, token, setUser, setToken} = useStateContext()
    const [warnings, setWarnings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState(null);
    const [databaseDevices, setDatabaseDevices] = useState(null);

    const initialState = {
        deviceDetails: null,
        placingMarker: false,
        markerPlaced: false,
        markerLocation: null,
        floor: 1,
        floorDevices: null,
        allDevices: devices,
        map: null,
    }


    function deviceReducer(state = initialState, action) {
        switch (action.type) {
            case 'SET_DEVICE_DETAILS':
                return { ...state, deviceDetails: action.payload };
            case 'SET_PLACING_MARKER':
                return { ...state, placingMarker: action.payload };
            case 'SET_MARKER_PLACED':
                return { ...state, markerPlaced: action.payload };
            case 'SET_MARKER_LOCATION':
                return { ...state, markerLocation: action.payload };
            case 'SET_FLOOR':
                return { ...state, floor: action.payload };
            case 'SET_FLOOR_DEVICES':
                return { ...state, floorDevices: action.payload };
            case 'SET_ALL_DEVICES':
                return { ...state, allDevices: action.payload };
            case 'SET_MAP':
                return { state, map: action.payload };
            default:
                return state;
        }
    }

    const store = createStore(deviceReducer)

    if (!token) {
        return <Navigate to='/login'/>
    }

    useEffect(() => {
        getDevicesFromDB()
        getWarnings()
    },[] )

    useEffect(() => {
        getDevices()
    }, [databaseDevices])


    const getWarnings = () => {
        setLoading(true)
        fetch(`https://api.istabai.com/2/homes.warnings.json?api_key=${import.meta.env.VITE_ISTABAI_API_KEY}&home_id=1155`)
            .then(r => r.json())
            .then(data => {
                setWarnings(data)
            })
            .catch(e => {
                console.log('istabai error', e)
            })
    }

    const getDevicesFromDB = () => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/devices`)
            .then(r => r.json())
            .then(data => {
                setDatabaseDevices(data)
            })
            .catch(e => {
                console.log('istabai error', e)
            })
    }

    const getDevices = () => {
        fetch(`https://api.istabai.com/2/devices.list.json?api_key=${import.meta.env.VITE_ISTABAI_API_KEY}&home_id=1155`)
            .then(r => r.json())
            .then(data => {
                const mergedDevices = mergeDevices(databaseDevices, data);
                setDevices(mergedDevices)

            })
            .catch(e => {
                console.log('istabai error', e)
            })
    }

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

    return (
        <div className="dark">
            <div className="flex">
                <div className="w-48 h-full flex-1">
                    <Provider store={store}>
                        <SideBar devices={devices}/>
                        <div className="p-4 sm:ml-64">
                            <Navigation onLogout={onLogout} warnings={warnings}/>
                            <main>
                                <DeviceDetailWindow />
                                <Outlet/>
                            </main>
                        </div>
                    </Provider>
                </div>
            </div>
        </div>
    )
}
