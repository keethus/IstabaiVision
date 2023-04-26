import {getSignalStrengthClass, renderDeviceIcon} from "../utils.jsx";
import {
    UilBatteryBolt,
    UilBatteryEmpty, UilCheckCircle, UilCircuit,
    UilDatabase, UilExclamationOctagon, UilExclamationTriangle,
    UilEye,
    UilGrids, UilInfoCircle, UilPlug,
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
                let  infoIcon, fillClass;

                if(device.is_placed) {
                    infoIcon = <UilCheckCircle size={16} className="fill-green-500"/>
                } else if(device.error) {
                    infoIcon = <UilInfoCircle size={16} className="fill-red-500"/>
                }

                return (
                    <li key={device.id}>
                        <a href="#"
                           onClick={(event) => handleDeviceChange(device, event)}
                           className="text-sm">
                            {renderDeviceIcon(device)}
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