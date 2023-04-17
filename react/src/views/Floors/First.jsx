import VectorMap, {
    Layer,
    Tooltip,
    Label, Size, Background, ControlBar, Font, LoadingIndicator,
} from 'devextreme-react/vector-map';
import {roomsData, buildingData, insideBuildingData, doorsData} from "./firstFloorPolygons";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";


const projection = {
    to: ([l, lt]) => [l / 1500000, lt / 1500000],
    from: ([x, y]) => [x * 1500000, y * 1500000],
};

export default function First() {
    const [rooms, setRooms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cursorCoordinates, setCursorCoordinates] = useState(null);
    const [deviceMarkers, setDeviceMarkers] = useState(null);

    const placingMarker = useSelector(state => state.placingMarker);
    const device = useSelector(state => state.deviceDetails)
    const markerPlaced = useSelector(state => state.markerPlaced)
    const markerLocation = useSelector(state => state.markerLocation)
    const floorDevices  = useSelector(state => state.floorDevices)

    const dispatch = useDispatch();

    useEffect(() => {
        if (loading) {
            getDevicesFromFloor(1)
            getRooms()
        }
    }, [loading])

    const getRooms = () => {
        setLoading(true)
        fetch(`https://api.istabai.com/2/rooms.list.json?api_key=${import.meta.env.VITE_ISTABAI_API_KEY}&home_id=1155`)
            .then(r => r.json())
            .then(data => {
                setLoading(false)
                setRooms(data)
                console.log('istabai data', data)

            })
            .catch(e => {
                setLoading(false)
                console.log('istabai error', e)
            })
    }



    function getImageUrl(name) {
        return `images/VectorMap/${name}.png`;
    }


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



    const getCoords = (e) => {
        if(!placingMarker) return;
        console.log(device);

        const coordinates = e.component.convertCoordinates(e.event.x, e.event.y);
        setCursorCoordinates(coordinates);

        const newFeature = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                properties: {
                    url: "https://img.icons8.com/nolan/512/unchecked-circle.png",
                }
            }]
        };
        dispatch({ type: 'SET_MARKER_LOCATION', payload: newFeature });

        if(newFeature) {
            dispatch({ type: 'SET_MARKER_PLACED', payload: true });
            dispatch({ type: 'SET_FLOOR', payload: 1 });
        }

        console.log('is placed', markerPlaced)
        console.log(cursorCoordinates)
    }

    const customizeTooltip = (arg) => {
        if (arg.layer.type === 'marker') {
            return {
                text: `${arg.attribute('text')}`
            };
        }
        if (arg.layer.name === 'rooms') {
            const room = rooms.rooms.find(room => room.id === arg.attribute('id'));
            let motionDate;
            if (room) {
                if (room.has_motion_sensor) {
                    motionDate = new Date(room.last_motion * 1000);
                    return {
                        text: `Temperature: ${room.temperature} °C
                            Co2: ${room.co2}
                            Humidity: ${room.humidity}%
                            Motion: ${motionDate.toLocaleString()}`
                    };
                } else {
                    return {
                        text: `Temp: ${room.temperature} °C
                        Co2: ${room.co2}
                        Humidity: ${room.humidity}%`
                    };
                }
            } else {
                return {
                    text: `No data available for this room.`
                };
            }
        }
        return null;
    };


    return (
        <div className="p-6 -z-10 " >
            <VectorMap
                id="vector-map"
                projection={projection}
                zoomFactor={4}
                maxZoomFactor={20}
                onClick={getCoords}
                panningEnabled={true}>
                <Layer
                    dataSource={markerLocation}
                    type="marker"
                    elementType="image"
                    dataField="url"
                    size={30}
                   >
                    <Label dataField="text">
                        <Font size={14} />
                    </Label>
                </Layer>

                {deviceMarkers &&
                    <Layer
                        dataSource={deviceMarkers}
                        type="marker"
                        elementType="image"
                        dataField="url"
                        size={30}
                        className="cursor-pointer">
                        <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
                    </Layer>
                }


                <Background
                    color={'transparent'}
                    borderColor={'#2c2c2c'}/>
                <ControlBar
                    enabled={false}/>
                <Size height={600}/>
                <Layer
                    dataSource={buildingData}
                    hoverEnabled={false}
                    name="building"
                    color="#636363">
                </Layer>
                <Layer
                    dataSource={insideBuildingData}
                    hoverEnabled={false}
                    name="building"
                    color="#636363">
                </Layer>
                <Layer
                    dataSource={doorsData}
                    name="doors"
                    borderWidth={2}
                    color="green">
                    <Tooltip
                        enabled={true}
                        customizeTooltip={customizeTooltip}
                    ></Tooltip>
                </Layer>
                <Layer
                    dataSource={roomsData}
                    name="rooms"
                    borderWidth={2}
                    color="transparent">
                    <Label enabled={true} dataField="name" color="red" className="text-gray-200"></Label>
                </Layer>

                <Tooltip
                    enabled={true}
                    customizeTooltip={customizeTooltip}
                ></Tooltip>
                <LoadingIndicator
                    show={true}/>
            </VectorMap>
        </div>
    );


}



