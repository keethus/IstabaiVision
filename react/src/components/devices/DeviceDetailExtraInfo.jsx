import {UilFavorite} from "@iconscout/react-unicons";

function DeviceDetailExtraInfo({device}) {
    const channels = ['P1', 'P2', 'P3', 'P4', 'P5', 'S1', 'S2', 'S3', 'S4'];

    return (
        <div className="py-4">
            {channels.map(channel => {
                const channelData = device.channels[channel];
                if (channelData && channelData.type === "SWITCH") {
                    return (
                        <div key={channel} className="flex">
                            <div className="align-center my-auto">
                                <UilFavorite size="16" className="self-center mr-1"/>
                            </div>
                            <div>
                                <p className="text-sm font-semibold flex self-center">
                                    {channelData.switch.name}
                                </p>
                                <p className="text-xs  flex self-center">
                                    {channelData.switch.group}
                                </p>
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
}

export default DeviceDetailExtraInfo;