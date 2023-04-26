import {useEffect, useLayoutEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    UilBatteryBolt,
    UilBatteryEmpty, UilCheckCircle, UilExclamationCircle,
    UilFavorite,
    UilKeyholeCircle, UilLightbulb, UilMapMarkerEdit, UilMapMarkerPlus, UilSearch,
    UilSignal,
    UilSubway, UilSync, UilTimesCircle, UilToggleOn
} from "@iconscout/react-unicons";
import DeviceDetailExtraInfo from "./DeviceDetailExtraInfo.jsx";
import moment from "moment/moment.js";
import {Button} from "react-daisyui";
import {getSignalStrengthClass} from "../utils.jsx";
import {useMapEvent, useMapEvents} from "react-leaflet";

function DeviceDetailWindow() {
    const [buttonClass, setButtonClass] = useState('bg-neutral-800')
    const [buttonActive, setButtonActive] = useState(false)
    const [buttonText, setButtonText] = useState('Place on map')
    const [mapRef, setMapRef] = useState(null)

    const device = useSelector(state => state.deviceDetails);
    const markerPlaced = useSelector(state => state.markerPlaced);
    const markerLocation = useSelector(state => state.markerLocation)
    const floor = useSelector(state => state.floor)
    const map = useSelector(state => state.map)

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        setButtonActive(false)
        if(map) {
            setMapRef(map)
        }
        console.log('device changed: ', device)
    }, [device, dispatch])


    useEffect(() => {
        if(buttonActive === true) {
            dispatch({ type: 'SET_PLACING_MARKER', payload: true });
            setButtonClass('bg-primary text-white')
            setButtonText('Cancel')
        } else {
            dispatch({ type: 'SET_PLACING_MARKER', payload: false });
            dispatch({ type: 'SET_MARKER_PLACED', payload: false });
            dispatch({ type: 'SET_MARKER_LOCATION', payload: null })

            setButtonClass('bg-neutral-800')
            setButtonText('Place on map')
        }
    }, [buttonActive])

    useEffect(() => {
        if(markerPlaced) {
            setButtonClass('bg-neutral-800')
        }
    }, [markerPlaced])

    const onSubmit = (e) => {
        e.preventDefault();
        const payload = {
            device_id: device.id,
            latitude: markerLocation.features[0].geometry.coordinates[1],
            longitude: markerLocation.features[0].geometry.coordinates[0],
            floor: floor,
            icon: device.type
        }

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/device/store`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                dispatch({ type: 'SET_MARKER_PLACED', payload: false });
                setButtonActive(false)
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const renderBattery = () => {
        if (device.battery) {
            return (
                <p className="text-xs flex"><UilBatteryBolt size="16" className="self-center mr-1"/>{device.battery * 100}%</p>
            )
        } else if (device.battery === 0) {
            return (
                <p className="text-xs flex"><UilBatteryEmpty size="16"  className="self-center mr-1 fill-orange-400"/>{device.battery * 100}%</p>
            )
        }
    }

    if(device) {
        let fillClass, icon, info, error, extraInfo, extraIcon, battery
        fillClass = getSignalStrengthClass(device.signal_strength);

        if(device.signal_strength) {
            icon = <UilSignal className={fillClass} size="22"/>
        } else {
            icon = '';
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

        const locateMarker = () => {
            mapRef.flyTo([device.longitude, device.latitude], 2)
            return null
        }

        const removeMarker = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/device/${device.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                window.location.reload();
            } catch (e) {
                console.log('error', e)
            }
        }

        return (
            <div className="absolute bottom-0 right-0 w-96 z-50">
                {buttonActive && !markerPlaced &&
                    <div className="modal-box bg-neutral-900 shadow-lg flex h-auto  animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6 mr-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Click on map to place marker!
                    </div>
                }
                {markerPlaced &&
                    <div className="modal-box bg-neutral-900 shadow-lg flex h-auto flex-col gap-4">
                        <div className="flex">
                            <img src="https://img.icons8.com/nolan/512/unchecked-circle.png" alt="" style={{width: 24, height: 24}} className="mr-2"/>
                            Confirm device location
                        </div>
                        <div>
                            <Button onClick={onSubmit} className={`btn btn-wide w-full hover:bg-neutral-700 border-1 border-neutral-700  bg-primary text-white`} >
                                Save
                            </Button>
                        </div>
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
                                {renderBattery()}
                                {extraInfo}
                                {device.error && (
                                    <p className="text-xs flex pt-4 text-red-500"><UilExclamationCircle size="16"  className="self-center mr-1 fill-red-500 "/>{device.error}</p>
                                )}
                                {device.is_placed &&
                                    <p className="text-xs flex pt-4 text-green-500"><UilCheckCircle size="16"  className="self-center mr-1 fill-green-500 "/>Placed ({device.floor}) </p>
                                }
                            </div>
                            <div className="absolute right-1 top-1 m-5">
                                {icon}
                            </div>
                            <div className="pt-4">

                                {!device.is_placed ? (
                                    <Button onClick={placeMarker} className={`btn btn-wide w-full { hover:bg-neutral-700 border-1 border-neutral-700 flex justify-between ${buttonClass}`} >
                                        {buttonText}
                                        <UilMapMarkerPlus />
                                    </Button>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Button onClick={locateMarker} className={`btn btn-wide w-full  hover:bg-green-700 border-1 bg-green-600 border-green-400 flex justify-between text-green-50`} >
                                            Locate
                                            <UilSearch />
                                        </Button>
                                        <Button onClick={removeMarker} className={`btn btn-wide w-full { hover:bg-neutral-700 border-1 border-neutral-700 flex justify-between ${buttonClass}`} >
                                            Remove from map
                                            <UilTimesCircle />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DeviceDetailWindow