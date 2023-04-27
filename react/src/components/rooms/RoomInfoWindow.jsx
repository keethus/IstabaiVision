import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
    UilAngleDown,
    UilAngleUp,
    UilCelsius,
    UilCloud,
    UilClouds, UilDirection,
    UilEye, UilFlower, UilMoon, UilPower, UilSun,
    UilTear, UilTemperature,
    UilTemperatureHalf,
    UilTemperatureMinus, UilTemperaturePlus
} from "@iconscout/react-unicons";
import moment from "moment";

export const RoomInfoWindow = () => {
    const roomId = useSelector(state => state.selectedRoom);
    const rooms = JSON.parse(localStorage.getItem('rooms'));
    const [room, setRoom] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    let motionDate = null;

    useEffect(() => {
        // match room id and get room info
        if (rooms) {
            const roomInfo = rooms.rooms.find(r => r.id === roomId);
            setRoom(roomInfo);
            if(room) {
                setShowDetails(false)

                document.getElementById("room-details").classList.add("fade-in");
                setTimeout(function() {
                    document.getElementById("room-details").classList.remove("fade-in");
                }, 500)
                console.log('room', room)
            }
        }
    }, [roomId])

    useEffect(() => {
        console.log('test', showDetails)
    }, [showDetails])

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    }

    return (
        <div>
            {room && room.name &&
                <div id="room-details" className="absolute bottom-2 bg-neutral-900 rounded-xl  w-1/2 z-50 shadow-lg flex flex-col  cursor-pointer" onClick={handleShowDetails}>
                    <div className="flex justify-between w-full bg-primary rounded-t-xl p-6 shadow-xl">
                        <div className="w-2/5">
                            <div className="font-bold text-xl  ">
                                {room.name}
                            </div>
                        </div>
                        <div className="flex justify-end gap-8 w-3/5">
                            <div className="font-base gap-1  text-md flex items-center">
                                {room.temperature}
                                <UilCelsius size={16}/>
                            </div>
                            <div className="font-base gap-1  text-md flex items-center">
                                {room.humidity}%
                                <UilTear size={16} />
                            </div>
                        {room.co2 &&
                            <div className="font-base gap-1  text-md flex items-center">
                                {room.co2}
                                <UilCloud size={16}/>

                            </div>
                        }
                        {room.last_motion &&
                            <div className="font-base gap-1 text-sm flex items-center">
                                <UilEye size={16}/>
                                {moment.unix(room.last_motion).fromNow()}
                            </div>
                        }
                    </div>
                </div>
                    <div className={`collapsible  ${showDetails ? 'opened' : ''}`}>
                        <div className="flex w-full justify-between">
                            <div className="w-1/2">


                            </div>
                            <div className="w-1/2">
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between font-bold pt-4 text-neutral-500 py-6 px-8">
                                <div className={`flex items-center text-xl gap-2 pb-1 ${room.mode === "DAY" ? "primary border-b-4 border-primary" : ""} `}>
                                    <UilSun size={30}/>
                                    {room.set_temperature.day}
                                    <UilCelsius size={16}/>
                                </div>
                                <div className={`flex items-center text-xl gap-2 pb-1 ${room.mode === "ECO" ? "primary border-b-4 border-primary" : ""} `}>
                                    <UilFlower size={30}/>
                                    {room.set_temperature.eco}
                                    <UilCelsius size={16}/>
                                </div>
                                <div className={`flex items-center text-xl gap-2 pb-1 ${room.mode === "NIGHT" ? "primary border-b-4 border-primary" : ""} `}>
                                    <UilMoon size={30}/>
                                    {room.set_temperature.night}
                                    <UilCelsius size={16}/>
                                </div>
                                <div className={`flex items-center text-xl gap-2 pb-1 ${room.mode === "OFFLINE" ? "primary border-b-4 border-primary" : ""} `}>
                                    <UilPower size={30}/>
                                    {room.set_temperature.offline}
                                    <UilCelsius size={16}/>
                                </div>
                                <div className={`flex items-center text-xl gap-2 pb-1 ${room.mode === "TEMP" ? "primary border-b-4 border-primary" : ""} `}>
                                    <UilTemperature size={30}/>
                                    {room.set_temperature.temp}
                                    <UilCelsius size={16}/>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            }
        </div>
    )
}