import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import SelectFilter from "./SelectFilter.jsx";
import DeviceList from "./DeviceList.jsx";

function FilterableDeviceList({devices}) {
    const [filter, setFilter] = useState('NO_FILTER');
    const [filteredDevices, setFilteredDevices] = useState(devices);
    const [devicesLoading, setDevicesLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (filter === 'NO_FILTER') {
            setFilteredDevices(devices);
        } else {
            setFilteredDevices({
                devices: devices.devices.filter((device) => device.type === filter)
            });
            setDevicesLoading(false)
        }
    }, [filter, devices]);

    function handleDeviceChange(deviceDetails){
        dispatch({ type: 'SET_DEVICE_DETAILS', payload: deviceDetails });

    }

    return (
        <div>
            <SelectFilter
                onFilterChange={setFilter}
                filter={filter} />
            <DeviceList filteredDevices={filteredDevices} handleDeviceChange={handleDeviceChange}/>
        </div>
    )
}
export default FilterableDeviceList;
