import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import SelectFilter from "./SelectFilter.jsx";
import DeviceList from "./DeviceList.jsx";

function FilterableDeviceList({devices}) {
    const [filter, setFilter] = useState('NO_FILTER');
    const [floorOnly , setFloorOnly] = useState(false);
    const [filteredDevices, setFilteredDevices] = useState(devices);
    const [devicesLoading, setDevicesLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {

        if (filter === 'NO_FILTER') {
            setFilteredDevices(devices);
        } else {
            setFilteredDevices(devices.filter((device) => device.type === filter));
            setDevicesLoading(false)
        }

        if(floorOnly) {
            if (filter === 'NO_FILTER') {
                setFilteredDevices(devices.filter((device) => device.floor === localStorage.getItem('floor')));
            } else {
                setFilteredDevices(devices.filter((device) => device.type === filter && device.floor === localStorage.getItem('floor')));
                setDevicesLoading(false)
            }
        }

        if(devices) {
            dispatch({ type: 'SET_ALL_DEVICES', payload: devices })
        }
    }, [filter, devices, floorOnly]);



    function handleDeviceChange(deviceDetails){
        dispatch({ type: 'SET_DEVICE_DETAILS', payload: deviceDetails });
    }

    return (
        <div>
            <SelectFilter
                onFilterChange={setFilter}
                filter={filter} />
                <div className="form-control w-52 mx-auto pt-2">
                    <label className="cursor-pointer label">
                        <span className="label-text text-neutral-400">This floor only</span>
                        <input type="checkbox"
                               name="floor-only"
                               value={true}
                               onChange={(e) => { setFloorOnly(e.target.checked) }}
                               className="toggle toggle-warning "/>
                    </label>
                </div>
            <DeviceList filteredDevices={filteredDevices} handleDeviceChange={handleDeviceChange}/>
        </div>
    )
}
export default FilterableDeviceList;
