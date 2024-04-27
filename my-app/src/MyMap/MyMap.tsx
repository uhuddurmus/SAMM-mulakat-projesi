import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker,useMap } from "react-leaflet";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import { fetchNavsData } from "../redux/actions";
import { setList } from "../redux/features/listSlice";
import GetCoordinates  from "./GetCoordinates";
import axios from "axios";

interface PointMarkerProps {
  center: any;
  content?: any;
  openPopup: any;
}

interface MyMarkersProps {
  data: any;
  selectedIndex: any;
}

const MyMap = () => {
  // Leaflet tile layer
  const tileLayer = {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  };

  // Redux state and dispatch
  const dispatch = useDispatch();
  const List = useSelector((state: any) => state.list.items);
  const [navs, setNavs] = useState<any>(List);

  // Fetch data from Redux on component mount or list change
  const fetchData = async () => {
    try {
      const response = await fetchNavsData();
      setNavs(response);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [List]);

  // Handle marker removal
  const handleRemove = async (navId: any) => {
    try {
      const response = await axios.delete(`https://localhost:7009/api/Points/${navId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      dispatch(setList(response.data));
      console.log("Point deleted successfully:", response);
    } catch (error) {
      console.error("Error deleting point:", error);
    }
  };

  // Handle JSON file download
  const handleDownload = async () => {
    try {
      const response = await axios.get("https://localhost:7009/api/Points/DownloadJsonFile", {
        responseType: "blob",
      });
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
  const PointMarker: React.FC<PointMarkerProps> = ({ center, openPopup }) => {
    const map = useMap();
    const markerRef = useRef<any>(null);

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
  const MyMarkers: React.FC<MyMarkersProps> = ({ data, selectedIndex }) => {
    return (
      <>
        {data.map((item: any, index: any) => (
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
  function handleItemClick(index: any) {
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
            <MyMarkers selectedIndex={selected} data={navs} />
            <GetCoordinates />
          </MapContainer>
        </div>
        <div className="col-md-3">
          <div className="nav-list mt-2" style={{ height: "75vh", overflowY: "scroll" }}>
            {navs?.map((nav: any) => (
              <div key={nav.id} className="nav-item mb-2 text-center">
                <div className="d-flex justify-content-between align-items-center" onClick={() => handleItemClick(nav.id)} style={{cursor:'pointer',userSelect:'none'}}>
                  <span>
                    <span className="fw-bolder">Latitude:</span> {nav.lat},{" "}
                    <span className="fw-bolder">Longitude:</span> {nav.lng}
                  </span>
                </div>
                <button className="btn btn-danger me-2 text-center" onClick={() => handleRemove(nav.id)}>
                  Delete
                </button>
                <hr />
              </div>
            ))}
          </div>
          <div className="float-end">
            <button className="btn btn-primary" onClick={handleDownload}>
              Download JSON File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMap;
