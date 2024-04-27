import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useDispatch } from "react-redux";
import { setList } from "../redux/features/listSlice";
import axios from "axios";

const GetCoordinates: React.FC = () => {
  const dispatch = useDispatch();
  const map = useMap();
  const [browserCoords, setBrowserCoords] = useState<any>();

  async function newData(pointData: any) {
    try {
      if (pointData.lat.toString().length > 1 && pointData.lng.toString().length > 1) {
        const response = await axios.post("https://localhost:7009/api/Points", pointData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response);
        dispatch(setList(response.data));
      } else {
        return 0;
      }
    } catch (error: any) {
      console.error("Failed Fetch Data:", error);
      return 0;
    }
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

    map.on("click", (e: any) => {
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
          setBrowserCoords([latitude, longitude]);
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
