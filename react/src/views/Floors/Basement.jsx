import VectorMap, {
    Layer,
    Tooltip,
    Label, Size,
} from 'devextreme-react/vector-map';

import {roomsData, buildingData, insideBuildingData, doorsData} from "./BasementPolygons";
import {useEffect, useState} from "react";
import {Background, ControlBar} from "devextreme-react/vector-map.js";

const projection = {
    to: ([l, lt]) => [l / 1500000, lt / 1500000],
    from: ([x, y]) => [x * 1500000, y * 1500000],
};

export default function Basement() {
    const [rooms, setRooms] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const customizeTooltip = (arg) => {
        if (arg.layer.name === 'rooms') {
            const room = rooms.rooms.find(room => room.id === arg.attribute('id'));
            let motionDate;

            if (room) {
                if (room.has_motion_sensor) {
                    motionDate = new Date(room.last_motion * 1000);
                }

                if (room.has_motion_sensor) {
                    return {
                        text: `Temp: ${room.temperature} °C
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

        <div className="p-6 ">

            <VectorMap
                id="vector-map"
                projection={projection}
                touchEnabled={true}
                maxZoomFactor={20}
                zoomFactor={4}
                panningEnabled={true}
            >
                <Background color={'#2c2c2c'} borderColor={'#2c2c2c'}/>
                <Size height={600}/>
                <ControlBar
                    enabled={false}
                />
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

