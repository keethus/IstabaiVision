import {roomsData, buildingData, insideBuildingData, doorsData} from "./BasementPolygons.js";
import 'leaflet/dist/leaflet.css';
import {MapContainer, GeoJSON} from 'react-leaflet';
import L from 'leaflet';
import {
    buildingStyle,
    getDevicesFromFloor,
    getRooms,
    onEachRoom,
    scaleDown
} from "../../components/utils.jsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import NewLocationMarker from "../../components/map/NewLocationMarker.jsx";
import "leaflet-edgebuffer";

export default function Second() {
    const [rooms, setRooms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deviceMarkers, setDeviceMarkers] = useState(null);
    const [map, setMap] = useState(null);
    const placingMarker = useSelector(state => state.placingMarker);
    const devices = JSON.parse(localStorage.getItem('devices'))
    const dispatch = useDispatch();
    const floor = '0';

    useEffect(() => {
        localStorage.setItem('floor', floor);
        window.dispatchEvent(new Event("storage"));
    })

    useEffect(() => {
        if(map) {
            dispatch({ type: 'SET_MAP', payload: map });
        }
    }, [map])


    useEffect(() => {
        async function fetchData() {
            const roomsData = await getRooms();
            setRooms(roomsData);

            const devicesData = await getDevicesFromFloor("0");
            setDeviceMarkers(devicesData)
        }
        if (!rooms) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [rooms, devices]);


    return (
        <div>
            {!loading ? (
                <MapContainer center={[0, 0]}
                              zoom={-50}
                              crs={L.CRS.Simple}
                              scrollWheelZoom={true}
                              className=" h-screen w-full inset-0 z-10 absolute"
                              style={{ backgroundColor: '#2c2c2c'}}
                              ref={setMap}
                                removeControl>
                    <GeoJSON data={scaleDown(roomsData, 1500)}
                             style={{color: 'transparent', weight: 1, opacity: 0.2}}
                             onEachFeature={(feature, layer) => onEachRoom(feature, layer, rooms)} >
                    </GeoJSON>
                    {placingMarker && <NewLocationMarker floor={floor} />}

                    {deviceMarkers && map &&
                        <GeoJSON data={deviceMarkers} pointToLayer={(feature, latlng) => {
                            const { url } = feature.properties;
                            const icon = L.divIcon({
                                html: url,
                                className: 'bg-transparent',
                                iconSize: [32, 32], // adjust as needed
                                iconAnchor: [16, 0] // adjust as needed
                            });
                            return L.marker(latlng, { icon });
                        }} onEachFeature={(feature, layer) => {
                            const text = `<b> ${feature.properties.text} </b>`;
                            layer.bindTooltip(text, {direction: 'top', offset: [0, 0]});
                            layer.on('click', (e) => {
                                const matchedDevice = devices.find((d) => d.id.toString() === feature.properties.text);
                                dispatch({ type: 'SET_DEVICE_DETAILS', payload: matchedDevice });
                            });
                        }}  />
                    }

                    <GeoJSON data={scaleDown(buildingData, 1500)} style={buildingStyle}   edgeBufferTiles={5}/>
                    <GeoJSON data={scaleDown(insideBuildingData, 1500)} style={buildingStyle} />
                    <GeoJSON data={scaleDown(doorsData, 1500)} style={{color: '#65a30d', weight: 1, opacity: 0.4}} />
                </MapContainer>
            ) : (
                <div className="flex justify-center items-center h-80">
                    <div className="animate-spin rounded-full h-28 w-28 border-t-4 border-b-4 border-neutral-900"></div>
                </div>
            )}
        </div>
    )
}


