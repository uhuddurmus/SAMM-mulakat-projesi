import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem, getList } from "../redux/Slices/listSlice";
import GetCoordinates from "./GetCoordinates";
import axios from "axios";

const MyMap = () => {
  // Leaflet tile layer
  const tileLayer = {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  };

  // Redux state and dispatch
  const dispatch = useDispatch();
  const List = useSelector((state) => state.items);

  // Fetch data from Redux on component mount or list change

  useEffect(() => {
    dispatch(getList());
  }, []);

  // Handle marker removal
  const handleRemove = async (navId) => {
    dispatch(deleteItem(navId));
  };

  // Handle JSON file download
  const handleDownload = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7009/api/Points/DownloadJsonFile",
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "points.json");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading JSON file:", error);
    }
  };

  // Marker component
  const PointMarker = ({ center, openPopup }) => {
    const map = useMap();
    const markerRef = useRef(null);

    useEffect(() => {
      if (openPopup) {
        map.flyToBounds([center]);
        markerRef.current.openPopup();
      }
    }, [map, center, openPopup]);

    return (
      <Marker
        ref={markerRef}
        position={[center.lat, center.lng]}
        icon={L.divIcon({
          className: "mymarker",
          html: "❌",
        })}
      />
    );
  };

  // Markers component
  const MyMarkers = ({ data, selectedIndex }) => {
    return (
      <>
        {data.map((item, index) => (
          <PointMarker
            key={index}
            center={{ lat: item.lat, lng: item.lng }}
            openPopup={selectedIndex === index}
          />
        ))}
      </>
    );
  };

  // Selected marker state and handler
  const [selected, setSelected] = useState();
  function handleItemClick(index) {
    setSelected(index);
  }

  // Render
  return (
    <div id="map" className="mt-5">
      <div className="row">
        <div className="col-md-9">
          <MapContainer
            center={[39.919, 32.854]}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: "75vh", width: "100wh" }}
          >
            <TileLayer {...tileLayer} />
            <MyMarkers selectedIndex={selected} data={List} />
            <GetCoordinates />
          </MapContainer>
        </div>
        <div className="col-md-3">
          <div
            className="nav-list mt-2"
            style={{ height: "75vh", overflowY: "scroll" }}
          >
            {List?.map((nav) => (
              <div key={nav.id} className="nav-item mb-2 text-center">
                <div
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => handleItemClick(nav.id)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span>
                    <span className="fw-bolder">Latitude:</span> {nav.lat},{" "}
                    <span className="fw-bolder">Longitude:</span> {nav.lng}
                  </span>
                </div>
                <button
                  className="btn btn-danger me-2 text-center"
                  onClick={() => handleRemove(nav.id)}
                >
                  Sil
                </button>
                <hr />
              </div>
            ))}
          </div>
          <div className="float-end">
            <button className="btn btn-primary mt-1" onClick={handleDownload}>
              İndir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMap;
