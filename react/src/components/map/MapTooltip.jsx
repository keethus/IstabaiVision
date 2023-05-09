 export const customizeTooltip = (arg) => {
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