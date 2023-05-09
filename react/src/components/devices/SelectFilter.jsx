function SelectFilter({filter, onFilterChange}) {
    return (
        <select
            className="select select-bordered bg-neutral-800 w-full max-w-xs mt-5"
            onChange={(e) => onFilterChange(e.target.value)}
            value={filter}>

            <option defaultValue disabled>Select type</option>
            <option value={"NO_FILTER"}>No Filter</option>
            <option value={"BASE_STATION"}>Base Stations</option>
            <option value={"TEMPERATURE_SENSOR"}>Climate Sensors</option>
            <option value={"MOTION_SENSOR"}>Motion Sensors</option>
            <option value={"SWITCH_BOILER"}>Boiler Switches</option>
            <option value={"WALL_PLUG"}>Wall Plug</option>
            <option value={"RELAY_S2P4"}>Relays</option>
            <option value={"SIEMENS_SSA955"}>Siemens SSA955</option>
        </select>
    )
}
export default SelectFilter;