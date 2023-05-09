import {useState} from "react";
import {Marker, Popup, useMapEvents} from "react-leaflet";
import {useDispatch, useSelector} from "react-redux";

function NewLocationMarker({floor}) {

    const device = useSelector(state => state.deviceDetails)
    const dispatch = useDispatch();

    const [newMarker, setNewMarker] = useState(null)

    const map = useMapEvents({
        click(event) {
            const position = [event.latlng.lat, event.latlng.lng]
            setNewMarker(position)

            const newFeature = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: position
                    },
                    properties: {
                        url: "https://img.icons8.com/nolan/512/unchecked-circle.png",
                    }
                }]
            };
            console.log(position)
            dispatch({ type: 'SET_MARKER_LOCATION', payload: newFeature });
            if(newFeature) {
                dispatch({ type: 'SET_MARKER_PLACED', payload: true });
                dispatch({ type: 'SET_FLOOR', payload: floor });
            }
        },
    })

    return newMarker === null ? null : (
        <Marker position={newMarker}>
            <Popup>You are here</Popup>
        </Marker>
    )
}
export default NewLocationMarker;