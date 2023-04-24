import {UilExclamationTriangle, UilSetting} from "@iconscout/react-unicons";
import {useSelector} from "react-redux";

function SettingsWindow() {
    const floor = useSelector(state => state.floor)

    const removeDevicesFromFloor = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/devices/${floor}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                window.location.reload();
            } catch (e) {
                console.log('error', e)
            }
    }

    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
                <UilSetting className="fill-yellow-400"/>
            </label>
            <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-neutral-900 rounded-box w-80 mt-4 text-sm">
                <li><a onClick={removeDevicesFromFloor}>Remove all devices from this floor ({floor})</a></li>

            </ul>
        </div>
    )
}
export default SettingsWindow;