import VectorMap, {
  Layer,
  Tooltip,
  Label, Size,
} from 'devextreme-react/vector-map';

import {roomsData, buildingData, insideBuildingData, doorsData } from "./secondFloorPolygons";

const projection = {
    to: ([l, lt]) => [l / 900000, lt / 900000],
    from: ([x, y]) => [x * 900000, y * 900000],
};
const mapBounds = [-400000, 400000, 400000, -400000];
export default function Second() {
  return (
    <div className="p-6 ">
      <VectorMap
        id="vector-map"
        maxZoomFactor={12}
        projection={projection}
      >
        <Size height={700} />
        <Layer
          dataSource={buildingData}
          hoverEnabled={false}
          name="building"
          color="#636363">
        </Layer>
        <Layer
          dataSource={insideBuildingData}
          hoverEnabled={false}
          name="building"
          color="#636363">
        </Layer>
        <Layer
          dataSource={doorsData}
          name="doors"
          borderWidth={2}
          color="green">
          <Tooltip
            enabled={true}
            customizeTooltip={customizeTooltip}
          ></Tooltip>
        </Layer>
        <Layer
          dataSource={roomsData}
          name="rooms"
          borderWidth={2}
          color="transparent">
          <Label enabled={true} dataField="name" color="red" className="text-gray-200"></Label>
        </Layer>

        <Tooltip
          enabled={true}
          customizeTooltip={customizeTooltip}
        ></Tooltip>
      </VectorMap>
    </div>
  );
}

function customizeTooltip(arg) {
  if (arg.layer.name === 'rooms') {
    return { text: `Square: ${arg.attribute('square')} ft&#178` };
  }
  if (arg.layer.name === 'doors') {
    return { text: `Door: ${arg.attribute('name')}` };
  }
  return null;
}

