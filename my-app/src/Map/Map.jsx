import React, { useEffect, useState,useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setList } from "../redux/features/listSlice";
import { fetchNavsData } from "../redux/actions";
import "./coordinates-of-the-center-of-the-visible-map.css";

// Leaflet tile layer configuration
const tileLayer = {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
};

// Map component
const Map = () => {
  const dispatch = useDispatch();
  const List = useSelector((state) => state.list.items);
  const [navs, setNavs] = useState(List);
  const [selected, setSelected] = useState();

  // Fetch marker data from Redux store
  const fetchData = async () => {
    try {
      const response = await fetchNavsData();
      setNavs(response);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // Fetch data on component mount or when marker list changes
  useEffect(() => {
    fetchData();
  }, [List]);

  // Download JSON file handler
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

  // Handle marker click
  function handleItemClick(index) {
    setSelected(index);
  }

  // Handle marker removal
  const handleRemove = async (navId) => {
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

  // Custom marker component
  const PointMarker = ({ center, content, openPopup }) => {
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
            content={item.title}
            center={{ lat: item.lat, lng: item.lng }}
            openPopup={selectedIndex === index}
          />
        ))}
      </>
    );
  };

  // State to hold current location coordinates
  const [currentLocation, setCurrentLocation] = useState();

  // Component to get coordinates of the center of the visible map
  const GetCoordinates = () => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      // Leaflet control to display coordinates
      const legend = L.control({ position: "bottomleft" });
      const div = L.DomUtil.create("div", "legend");

      // Function to update coordinates
      legend.onAdd = () => {
        const { lat, lng } = map.getCenter();
        const zoom = map.getZoom();

        L.DomEvent.disableClickPropagation(div);
        setCurrentLocation({
          id: 0,
          lat: lat,
          lng: lng,
          dateTime: "2024-04-26T20:31:14.058Z",
        });
        div.innerHTML = `center: ${lat.toFixed(5)}, ${lng.toFixed(5)} | zoom: ${zoom}`;

        return div;
      };

      // Add control to the map
      legend.addTo(map);

      // Function to update coordinates on drag or zoom
      const updateCoordinates = () => {
        const { lat, lng } = map.getCenter();
        const zoom = map.getZoom();
        div.innerHTML = `center: ${lat.toFixed(5)}, ${lng.toFixed(5)} | zoom: ${zoom}`;
      };

      // Event listeners for drag and zoom events
      map.on("dragend zoomend", updateCoordinates);

      // Cleanup function to remove event listeners and control
      return () => {
        map.off("dragend zoomend", updateCoordinates);
        legend.remove();
      };
    }, [map]);

    return null;
  };

  // Function to save current location coordinates
  const saveCoordinates = async () => {
    try {
      if (
        currentLocation.lat.toString().length > 1 &&
        currentLocation.lng.toString().length > 1
      ) {
        const response = await axios.post(
          "https://localhost:7009/api/Points",
          currentLocation,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        dispatch(setList(response.data));
      } else {
        return 0;
      }
    } catch (error) {
      console.error("Failed Fetch Data:", error);
      return 0;
    }
  };

  // Render
  return (
    <div id="map" className="mt-5">
      <div className="row">
        <div className="col-md-9">
          <div>
            {/* MapContainer to display the map */}
            <MapContainer
              className={"center-of-map"}
              center={[39.919, 32.854]}
              zoom={5}
              scrollWheelZoom={true}
              style={{ height: "75vh", width: "100wh" }}
            >
              {/* TileLayer for the map */}
              <TileLayer {...tileLayer} />
              {/* Render markers */}
              <MyMarkers selectedIndex={selected} data={navs} />
              {/* Component to display and update coordinates */}
              <GetCoordinates />
            </MapContainer>
          </div>
          {/* Button to save current location coordinates */}
          <div className="d-flex justify-content-center mt-1">
            <button className="btn btn-success" onClick={saveCoordinates}>
            Noktayı Kaydet
            </button>
          </div>
        </div>
        <div className="col-md-3">
          {/* List of markers */}
          <div
            className="nav-list mt-2"
            style={{ height: "75vh", overflowY: "scroll" }}
          >
            {navs?.map((nav) => (
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
                  Delete
                </button>
                <hr />
              </div>
            ))}
          </div>
          {/* Button to download JSON file */}
          <div className="float-end mt-1">
            <button className="btn btn-primary" onClick={handleDownload}>
              İndir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
