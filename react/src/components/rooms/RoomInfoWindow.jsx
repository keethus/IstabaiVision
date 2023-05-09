import {useSelector} from "react-redux";
import {useEffect, useMemo, useRef, useState} from "react";
import {
    UilAngleDown,
    UilAngleUp,
    UilCelsius,
    UilCloud,
    UilClouds, UilComment, UilDirection,
    UilEye, UilFlower, UilMessage, UilMoon, UilPower, UilSetting, UilSun,
    UilTear, UilTemperature,
    UilTemperatureHalf,
    UilTemperatureMinus, UilTemperaturePlus, UilTimesCircle
} from "@iconscout/react-unicons";
import moment from "moment";
import {Button} from "react-daisyui";

export const RoomInfoWindow = () => {
    const roomId = useSelector(state => state.selectedRoom);
    const rooms = JSON.parse(localStorage.getItem('rooms'));
    const [room, setRoom] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [comments, setComments] = useState([]);
    const messageRef = useRef();
    const commentsRef = useRef([]);
    let motionDate = null;

    // TODO: For chat, scroll to bottom of modal

    useEffect(() => {
        // match room id and get room info
        if (rooms) {
            const roomInfo = rooms.rooms.find(r => r.id === roomId);
            setRoom(roomInfo);
            if(room) {
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/comments/${roomId}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        setComments(data);
                        console.log('comments', comments)

                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });

                setShowDetails(false)

                document.getElementById("room-details").classList.add("fade-in");
                setTimeout(function() {
                    document.getElementById("room-details").classList.remove("fade-in");
                }, 500)
                console.log('room', room)
            }
        }
    }, [roomId])

    const onSubmit = (e) => {
        //TODO: append comment-section div with new comment


        e.preventDefault();
        const payload = {
            room_id: room.id,
            name: room.name,
            body: messageRef.current.value,
            user_id: localStorage.getItem('USER_ID')
        }

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleShowDetails = () => {
        setShowDetails(!showDetails);
    }

    useEffect(() => {
        commentsRef.current = comments;
        console.log('commentsRef', commentsRef.current)
    }, [comments])

    const renderComments = useMemo(() => {
        if (!comments.length) {
            return null;
        }
        return (
            <div className="flex flex-col gap-2">
                {commentsRef.current.map(comment => {
                    const chatType = comment.user.id === localStorage.getItem('USER_ID')
                        ? 'chat-start'
                        : 'chat-end';
                    const userName = comment.user.email;

                    return (
                        <div className={`chat ${chatType}`}>
                            <div className="chat-header">
                                {userName}
                            </div>
                            <div className="chat-bubble bg-neutral-700">{comment.body}</div>
                            <div className="chat-footer opacity-50">
                                <time className="text-xs opacity-50">{moment(comment.created_at).fromNow()}</time>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    })

    return (
        <div>
            {room && room.name &&
                <div id="room-details" className="absolute bottom-2 bg-neutral-900 rounded-xl  w-1/2 z-50 shadow-lg flex flex-col  cursor-pointer">
                    <div onClick={handleShowDetails}>
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
                    <div className={`collapsible  ${showDetails ? 'opened' : ''}`}>
                        <div className={`flex w-full items-center text-xl gap-4`}>
                            <div className={"w-1/2"}>
                                <label  htmlFor={room.id} className={`btn btn-wide w-full { hover:bg-neutral-700 border-1 border-neutral-700 flex justify-between bg-neutral-800`} >
                                    <span className={"pr-4"}>Comments</span>
                                    <UilComment />
                                </label>
                            </div>
                            <div className={"w-1/2"}>
                                <Button className={`btn btn-wide w-full { hover:bg-neutral-700 border-1 border-neutral-700 flex justify-between bg-neutral-800`} >
                                    <span className={"pr-4"}>Settings</span>
                                    <UilSetting />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <input type="checkbox" id={room.id} className="modal-toggle" />
                    <div className="modal z-[100]">
                        <div className="modal-box relative bg-neutral-900">
                            <label htmlFor={room.id} className="btn btn-sm btn-circle absolute right-2 top-2 bg-neutral-600">✕</label>
                            <div className="max-h-96 overflow-x-auto" id="comment-section">
                                {renderComments}
                            </div>
                            <div className="input-group pt-2">
                                <input type="text" ref={messageRef} placeholder="Type..." className="input input-bordered bg-neutral-800 w-full" />
                                <button onClick={onSubmit} className="btn btn-square input-bordered hover:bg-neutral-600 bg-neutral-700">
                                    <UilMessage size={24}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}