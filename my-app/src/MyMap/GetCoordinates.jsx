import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/Slices/listSlice";

const GetCoordinates = () => {
  const dispatch = useDispatch();
  const map = useMap();

  async function newData(pointData) {
    dispatch(addItem(pointData));
  }

  useEffect(() => {
    if (!map) return;

    const info = L.DomUtil.create("div", "legend");
    const positionControl = L.Control.extend({
      options: {
        position: "bottomleft",
      },
      onAdd: function () {
        info.textContent = "Click on map";
        return info;
      },
    });

    const control = new positionControl();
    map.addControl(control);

    map.on("click", (e) => {
      info.textContent = `Latitude: ${e.latlng.lat}, Longitude: ${e.latlng.lng}`;

      newData({
        id: 0,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        dateTime: "2024-04-26T20:31:14.058Z",
      });
    });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], map.getZoom());
        },
        (error) => {
          console.error("Error getting user location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
};

export default GetCoordinates;
