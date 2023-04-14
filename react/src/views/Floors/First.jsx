import VectorMap, {
    Layer,
    Tooltip,
    Label, Size, Background, ControlBar,
} from 'devextreme-react/vector-map';
import {roomsData, buildingData, insideBuildingData, doorsData} from "./firstFloorPolygons";
import {useCallback, useEffect, useRef, useState} from "react";

const projection = {
    to: ([l, lt]) => [l / 1500000, lt / 1500000],
    from: ([x, y]) => [x * 1500000, y * 1500000],
};

export default function First() {
    const [rooms, setRooms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cursorCoordinates, setCursorCoordinates] = useState(null);

    useEffect(() => {
        if (loading === false) {
            setTimeout(() => {
                getRooms()
            }, 10000);
        } else {
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

    const getCoords = (e) => {
        setCursorCoordinates(e.component.convertToGeo(e.event.x, e.event.y));
        alert(cursorCoordinates);
    }

    const customizeTooltip = (arg) => {
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
        <div className="p-6 animate__animated animate__fadeIn">
            <VectorMap
                id="vector-map"
                projection={projection}
                zoomFactor={4}
                maxZoomFactor={20}
                onClick={getCoords}
                panningEnabled={true}
            >
                <Background
                    color={'#2c2c2c'}
                    borderColor={'#2c2c2c'}
                />
                <ControlBar
                    enabled={false}
                />
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
            </VectorMap>
        </div>
    );
}



