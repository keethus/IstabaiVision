import {
    UilCircuit,
    UilDatabase,
    UilEye,
    UilGrids,
    UilPlug,
    UilTemperature,
    UilToggleOn
} from "@iconscout/react-unicons";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {lastId} from "leaflet/src/core/Util.js";

export const signalStrengthClasses = [
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

export const getSignalStrengthClass = (signalStrength) => {
    const item = signalStrengthClasses.find((item) =>
        signalStrength >= item.range[0] && signalStrength <= item.range[1]
    );
    return item ? item.class : "";
};

export  function scaleDown(geojson, factor) {
    const scaledGeojson = JSON.parse(JSON.stringify(geojson)); // make a deep copy of the geojson
    scaledGeojson.features.forEach(feature => {
        feature.geometry.coordinates = feature.geometry.coordinates.map(polygon => {
            return polygon.map(ring => {
                return ring.map(coordinates => {
                    return coordinates / factor;
                });
            });
        });
    });
    return scaledGeojson;
}

export const buildingStyle = {
    color: '#0a0a0a',
    weight: 1,
    fillOpacity: 1,
    borderOpacity: 1,
    border: true,

}; 

export const getRooms = async () => {
    try {
        const response = await fetch(`https://api.istabai.com/2/rooms.list.json?api_key=${import.meta.env.VITE_ISTABAI_API_KEY}&home_id=1155`);
        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
};

export const mergeDevices = (databaseDevices, apiDevices) => {

    // merge devices from database, and devices from istabai api
    // return all api devices, but if there is a match, add database device data
    const mergedDevices = apiDevices.devices.map(apiDevice => {
        const databaseDevice = databaseDevices.find(databaseDevice => databaseDevice.device_id === apiDevice.id.toString())
        if (databaseDevice) {
            return {
                ...apiDevice,
                ...databaseDevice,
                id: apiDevice.id,
                is_placed: true,
            }
        } else {
            return apiDevice
        }
    })

    return mergedDevices
};

export function getImageUrl(type) {
    if(type === 'BASE_STATION') {
        return `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" id="map-marker"><path fill=" #8B0000" d="M8,16.5a1,1,0,1,0,1,1A1,1,0,0,0,8,16.5ZM12,2C8,2,4,3.37,4,6V18c0,2.63,4,4,8,4s8-1.37,8-4V6C20,3.37,16,2,12,2Zm6,16c0,.71-2.28,2-6,2s-6-1.29-6-2V14.73A13.16,13.16,0,0,0,12,16a13.16,13.16,0,0,0,6-1.27Zm0-6c0,.71-2.28,2-6,2s-6-1.29-6-2V8.73A13.16,13.16,0,0,0,12,10a13.16,13.16,0,0,0,6-1.27ZM12,8C8.28,8,6,6.71,6,6s2.28-2,6-2,6,1.29,6,2S15.72,8,12,8ZM8,10.5a1,1,0,1,0,1,1A1,1,0,0,0,8,10.5Z"></path></svg>`
    } else if(type === 'MOTION_SENSOR') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="map-marker"><path fill="#FF7F50" d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z"></path></svg>`
    } else if(type === 'TEMPERATURE_SENSOR') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="map-marker"><path fill="#228B22" d="M13,15.28V5.5a1,1,0,0,0-2,0v9.78A2,2,0,0,0,10,17a2,2,0,0,0,4,0A2,2,0,0,0,13,15.28ZM16.5,13V5.5a4.5,4.5,0,0,0-9,0V13a6,6,0,0,0,3.21,9.83A7,7,0,0,0,12,23,6,6,0,0,0,16.5,13Zm-2,7.07a4,4,0,0,1-6.42-2.2,4,4,0,0,1,1.1-3.76,1,1,0,0,0,.3-.71V5.5a2.5,2.5,0,0,1,5,0v7.94a1,1,0,0,0,.3.71,4,4,0,0,1-.28,6Z"></path></svg>`
    } else if(type === 'SIEMENS_SSA955') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="map-marker"><path fill="#6B3FA0" d="M21,2H3A1,1,0,0,0,2,3V21a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V3A1,1,0,0,0,21,2ZM8,20H4V4H8Zm6,0H10V4h4Zm6,0H16V4h4Z"></path></svg>`
    } else if(type === 'SWITCH_BOILER') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="map-marker"><path fill="#DAA520" d="M10,13a1,1,0,1,0,1,1A1,1,0,0,0,10,13Zm0-4a1,1,0,1,0,1,1A1,1,0,0,0,10,9Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,14,9Zm7,4a1,1,0,0,0,0-2H19V9h2a1,1,0,0,0,0-2H18.82A3,3,0,0,0,17,5.18V3a1,1,0,0,0-2,0V5H13V3a1,1,0,0,0-2,0V5H9V3A1,1,0,0,0,7,3V5.18A3,3,0,0,0,5.18,7H3A1,1,0,0,0,3,9H5v2H3a1,1,0,0,0,0,2H5v2H3a1,1,0,0,0,0,2H5.18A3,3,0,0,0,7,18.82V21a1,1,0,0,0,2,0V19h2v2a1,1,0,0,0,2,0V19h2v2a1,1,0,0,0,2,0V18.82A3,3,0,0,0,18.82,17H21a1,1,0,0,0,0-2H19V13Zm-4,3a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V8A1,1,0,0,1,8,7h8a1,1,0,0,1,1,1Zm-3-3a1,1,0,1,0,1,1A1,1,0,0,0,14,13Z"></path></svg>`
    } else if(type === 'RELAY_S2P4') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="map-marker"><path fill="#4682B4" d="M16,8.5A3.5,3.5,0,1,0,19.5,12,3.5,3.5,0,0,0,16,8.5Zm0,5A1.5,1.5,0,1,1,17.5,12,1.5,1.5,0,0,1,16,13.5ZM16,5H8A7,7,0,0,0,8,19h8A7,7,0,0,0,16,5Zm0,12H8A5,5,0,0,1,8,7h8a5,5,0,0,1,0,10Z"></path></svg>`
    } else if(type === 'WALL_PLUG') {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="map-marker"><path fill="#FF8C00" d="M19,6H16V3a1,1,0,0,0-2,0V6H10V3A1,1,0,0,0,8,3V6H5A1,1,0,0,0,5,8H6v5a1,1,0,0,0,.29.71L9,16.41V21a1,1,0,0,0,2,0V17h2v4a1,1,0,0,0,2,0V16.41l2.71-2.7A1,1,0,0,0,18,13V8h1a1,1,0,0,0,0-2Zm-3,6.59L13.59,15H10.41L8,12.59V8h8ZM11,13h2a1,1,0,0,0,0-2H11a1,1,0,0,0,0,2Z"></path></svg>`
    } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="map-marker"><path fill="#00ffff" d="M12.44,13.11,12.27,13a1,1,0,0,0-1.09.22.87.87,0,0,0-.22.32,1,1,0,0,0-.08.39,1,1,0,0,0,.08.38,1.07,1.07,0,0,0,.54.54,1,1,0,0,0,.38.08,1.09,1.09,0,0,0,.39-.08,1,1,0,0,0,.32-.22,1,1,0,0,0,0-1.41ZM11.88,6A2.75,2.75,0,0,0,9.5,7.32a1,1,0,1,0,1.73,1A.77.77,0,0,1,11.88,8a.75.75,0,1,1,0,1.5,1,1,0,1,0,0,2,2.75,2.75,0,1,0,0-5.5Zm8.58,3.68A8.5,8.5,0,0,0,7.3,3.36,8.56,8.56,0,0,0,3.54,9.63,8.46,8.46,0,0,0,6,16.46l5.3,5.31a1,1,0,0,0,1.42,0L18,16.46A8.46,8.46,0,0,0,20.46,9.63ZM16.6,15.05,12,19.65l-4.6-4.6A6.49,6.49,0,0,1,5.53,9.83,6.57,6.57,0,0,1,8.42,5a6.47,6.47,0,0,1,7.16,0,6.57,6.57,0,0,1,2.89,4.81A6.49,6.49,0,0,1,16.6,15.05Z"></path></svg>`
    }
}
let lastSelectedLayer;

export const onEachRoom = (feature, layer, rooms) => {
    let selectedRoom;


    const dispatch = useDispatch();


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
                    tooltipText = `<p>Temp: <b>${room.temperature} °C</b></p>
                            <p>Co2: <b>${room.co2}</b></p>
                            <p>Humidity: <b>${room.humidity}%</b></p>
                            <p>Motion: <b>${motionDate.toLocaleString()}</b></p>`
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
    layer.on('mouseover' , () => {
        if(!selectedRoom) {
            layer.setStyle({color: 'rgb(115 115 115)', fillOpacity: 0.2})
        } else {
            if(lastSelectedLayer && lastSelectedLayer !== layer) {
                layer.setStyle({color: 'rgb(115 115 115)', fillOpacity: 0.2})
            } else {
                if(selectedRoom === feature.properties.id ) {
                    layer.setStyle({color: '#fcd34d'})
                }
            }

        }

    })

    layer.on('mouseout' , () => {
        if(!selectedRoom) {
            layer.setStyle({color: 'transparent'})
        } else {
            if(lastSelectedLayer && lastSelectedLayer !== layer) {
                layer.setStyle({color: 'transparent', fillOpacity: 0.2})
            } else if(selectedRoom === feature.properties.id ) {
                layer.setStyle({color: '#FFC107', fillOpacity: 0.6, })

            }

        }
    })

    layer.on('click', () => {

        if(lastSelectedLayer && lastSelectedLayer !== layer) {
            lastSelectedLayer.setStyle({color: 'transparent'})
        }

        const allLayers = document.querySelectorAll('.leaflet-interactive');
        allLayers.forEach(layer => {
            layer.classList.remove('fade-in');
        });

        selectedRoom = feature.properties.id;
        layer.setStyle({ color: '#FFC107', fillOpacity: 0.6});
        dispatch({ type: 'SET_SELECTED_ROOM', payload: selectedRoom });

        lastSelectedLayer = layer
        layer.getElement().classList.add('fade-in');
    })
}

export const getDevicesFromFloor = async (floor) => {
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
                        url: getImageUrl(device.icon),
                        text: device.device_id
                    }
                }
            })
        };
        return newFeature;
    } catch (error) {
        console.error(error);
    }
};

export const renderDeviceIcon = (device) => {
    let icon;
    //#FF7F50, #228B22, #6B3FA0, #DAA520, #4682B4, #FF8C00, #00ffff

    if (device.type === 'BASE_STATION') {
        icon = <UilDatabase className="text-[#8B0000]"/>
    } else if (device.type === 'MOTION_SENSOR') {
        icon = <UilEye className="text-[#FF7F50]"/>
    } else if (device.type === 'TEMPERATURE_SENSOR') {
        icon = <UilTemperature className="text-[#228B22]"/>
    } else if (device.type === "SIEMENS_SSA955") {
        icon = <UilGrids className="text-[#6B3FA0]"/>
    } else if (device.type === "SWITCH_BOILER") {
        icon = <UilCircuit className="text-[#DAA520]"/>
    } else if (device.type === "RELAY_S2P4") {
        icon = <UilToggleOn className="text-[#4682B4]"/>
    } else if (device.type === "WALL_PLUG") {
        icon = <UilPlug className="text-[#FF8C00]"/>
    }

    return icon;
    lastLayer = layer;
}