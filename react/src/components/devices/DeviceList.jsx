import {getSignalStrengthClass} from "../utils.jsx";
import {
    UilBatteryBolt,
    UilBatteryEmpty, UilCircuit,
    UilDatabase,
    UilEye,
    UilGrids, UilPlug,
    UilSignal, UilTear,
    UilTemperature, UilToggleOn
} from "@iconscout/react-unicons";
import {useEffect} from "react";

function DeviceList({filteredDevices, handleDeviceChange}) {
    if(!filteredDevices) {
        const loadingElements = [];
        for (let i = 0; i < 12; i++) {
            loadingElements.push(
                <li key={i}>
                    <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-neutral-700 h-10 w-10"></div>
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-2 bg-neutral-700 rounded"></div>
                            <div className="space-y-1">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-2 bg-neutral-700 rounded col-span-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            );
        }
        return <ul className="space-y-2 mt-4 menu p-2 rounded-box">{loadingElements}</ul>;
    }

    return (
        <ul className="space-y-2 mt-4 menu p-2 rounded-box">
            {filteredDevices && filteredDevices.map((device, index) => {
                let icon, infoIcon, fillClass

                fillClass = getSignalStrengthClass(device.signal_strength);

                if (device.type === 'BASE_STATION') {
                    icon = <UilDatabase/>
                } else if (device.type === 'MOTION_SENSOR') {
                    icon = <UilEye/>
                    if (device.battery === 0) {
                        infoIcon = <UilBatteryEmpty className="fill-orange-400" size="20"/>
                    } else {
                        infoIcon = <UilBatteryBolt size="20"/>
                    }
                } else if (device.type === 'TEMPERATURE_SENSOR') {
                    icon = <UilTemperature/>
                    if (device.battery === 0) {
                        infoIcon = <UilBatteryEmpty className="fill-orange-400" size="20"/>
                    } else {
                        infoIcon = <UilBatteryBolt size="20"/>
                    }
                } else if (device.type === "SIEMENS_SSA955") {
                    icon = <UilGrids/>
                    infoIcon = <UilSignal className={fillClass} size="20"/>;
                } else if (device.type === "SWITCH_BOILER") {
                    icon = <UilCircuit/>
                    infoIcon = <UilSignal className={fillClass} size="20"/>;
                } else if (device.type === "RELAY_S2P4") {
                    icon = <UilToggleOn/>
                    infoIcon = <UilSignal className={fillClass} size="20"/>;
                } else if (device.type === "WALL_PLUG") {
                    icon = <UilPlug/>
                    infoIcon = <UilSignal className={fillClass} size="20"/>;
                }
                return (
                    <li key={device.id}>
                        <a href="#"
                           onClick={(event) => handleDeviceChange(device, event)}
                           className="text-sm">
                            {icon}
                            <p>
                                <span className="font-bold">{device.id}</span> <br/>
                                <span className="text-[10px]">{device.type}
                                    <span className="font-bold absolute top-1 right-1 text-neutral-700 text-[5px]"> {infoIcon}</span>
                                    </span>
                            </p></a>
                    </li>
                )
            })}
        </ul>
    )
}

export default DeviceList