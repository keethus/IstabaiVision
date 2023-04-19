
import {roomsData, buildingData, insideBuildingData, doorsData} from "./secondFloorPolygons";

import 'leaflet/dist/leaflet.css';
import {MapContainer, GeoJSON, Tooltip, Popup, Marker, useMapEvents} from 'react-leaflet';

import L from 'leaflet';
import {buildingStyle, getRooms, scaleDown} from "../../components/utils.jsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import NewLocationMarker from "../../components/map/NewLocationMarker.jsx";
import DeviceDetailWindow from "../../components/devices/DeviceDetailWindow.jsx";


export default function Second() {
    const [rooms, setRooms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deviceMarkers, setDeviceMarkers] = useState(null);
    const placingMarker = useSelector(state => state.placingMarker);
    const devices = useSelector(state => state.allDevices);

    const device = useSelector(state => state.deviceDetails);

    const dispatch = useDispatch();

    useEffect(() => {
        getDevicesFromFloor(2)
        async function fetchData() {
            const data = await getRooms();
            setRooms(data);
            setLoading(false);
        }
        if (!rooms) {
            fetchData();
        }
    }, [rooms]);

    const getDevicesFromFloor = async (floor) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/devices/${floor}`);
            const data = await response.json();
            const newFeature = {
                type: 'FeatureCollection',
                features: data.map(device => {
                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [device.latitude, device.longitude]
                        },
                        properties: {
                            url: "https://img.icons8.com/nolan/512/unchecked-circle.png",
                            text: device.device_id
                        }
                    }
                })
            };
            setDeviceMarkers(newFeature)
            console.log('floor devices',newFeature);
        } catch (error) {
            console.error(error);
        }
    };


    const onEachRoom = (feature, layer) => {
        if (feature.properties && feature.properties.name) {
            let tooltipText = '';
            if(feature.properties.id) {
                if(!rooms) return;
                const room = rooms.rooms.find(room => room.id === feature.properties.id);
                let motionDate;

                if (room) {
                    if (room.has_motion_sensor) {
                        motionDate = new Date(room.last_motion * 1000);
                    }
                    if (room.has_motion_sensor) {
                        tooltipText = `Temp: ${room.temperature} °C
                            Co2: ${room.co2}
                            Humidity: ${room.humidity}%
                            Motion: ${motionDate.toLocaleString()}`

                    } else {
                        tooltipText = `
                            <p>Temp: <b>${room.temperature} °C</b></p>
                            <p> Co2: <b>${room.co2}</b></p>
                            <p>Humidity: <b>${room.humidity}%</b> </p>`
                    }
                }
            } else {
                tooltipText = `No data available for this room.`
            }
            layer.bindTooltip(tooltipText, {permanent: false, sticky: true} )
        }

    }

    const markerOnClick = (event) => {
        console.log(event.target._latlng);
    }



    return (
        <div>
            {!loading &&
                <MapContainer center={[0, 0]}
                              zoom={-50}
                              crs={L.CRS.Simple}
                              scrollWheelZoom={true}
                              className="bg-neutral-500 z-10"
                              style={{ height: '80vh', backgroundColor: '#2c2c2c'}}>
                    <GeoJSON data={scaleDown(roomsData, 1500)}
                             style={{color: 'transparent', weight: 1, opacity: 0.2}}
                             onEachFeature={onEachRoom} >
                    </GeoJSON>
                    {placingMarker && <NewLocationMarker floor={2} />}

                    {deviceMarkers &&
                        <GeoJSON data={deviceMarkers} onEachFeature={(feature, layer) => {
                            const {coordinates} = feature.geometry;
                            const {text} = feature.properties;
                            layer.bindTooltip(text);
                            layer.on('click', (e) => {
                                const matchedDevice = devices.devices.find((d) => d.id === text);
                                dispatch({ type: 'SET_DEVICE_DETAILS', payload: matchedDevice });

                                console.log('Clicked on GeoJSON feature:', matchedDevice);
                                console.log('ze device', device)
                            });

                            L.marker([coordinates[1], coordinates[0]], {riseOnHover: true, autoPanOnFocus: true})
                        }}  />
                    }


                    <Marker position={[0, 0]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                    <GeoJSON data={scaleDown(buildingData, 1500)} style={buildingStyle} />
                    <GeoJSON data={scaleDown(insideBuildingData, 1500)} style={buildingStyle} />
                    <GeoJSON data={scaleDown(doorsData, 1500)} style={{color: 'green', weight: 1, opacity: 0.2}} />
                </MapContainer>
            }
        </div>
    );
}


