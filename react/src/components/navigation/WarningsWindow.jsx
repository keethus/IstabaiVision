import {UilExclamationTriangle} from "@iconscout/react-unicons";

function WarningsWindow({warnings}) {
    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
                <UilExclamationTriangle className="fill-orange-400"/>
                <div
                    className="badge absolute top-1 left-6 bg-orange-500 text-neutral-900">{warnings && warnings.warnings.length}</div>
            </label>
            <div tabIndex={0}
                 className="dropdown-content card card-compact w-80 p-2 mt-4 shadow bg-neutral-900 text-primary-content">
                <div className="card-body">
                    <h3 className="card-title text-orange-400">Warnings!</h3>

                    {warnings && warnings.warnings.map((warning, index) => {
                        return (
                            <div key={index}>
                                <p>{warning.text}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
export default WarningsWindow;