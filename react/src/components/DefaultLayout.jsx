import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {
    UilExclamationTriangle,
    UilSignOutAlt,
} from '@iconscout/react-unicons'
import 'devextreme/dist/css/dx.dark.css';
import moment from "moment";
import {createStore} from "redux";
import {Provider, useDispatch, useSelector} from "react-redux";
import DeviceDetailWindow from "./devices/DeviceDetailWindow.jsx";
import FilterableDeviceList from "./devices/FilterableDeviceList.jsx";
import SideBar from "./navigation/SideBar.jsx";
import WarningWindow from "./navigation/WarningWindow.jsx";
import Navigation from "./navigation/Navigation.jsx";


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
                            <Navigation onLogout={onLogout}/>
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
