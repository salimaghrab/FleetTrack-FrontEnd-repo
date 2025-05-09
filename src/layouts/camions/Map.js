import React from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// Create the truck icon
const truckIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995507.png", // un vrai camion sérieux 😎
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const Map = ({ position, address, matricule, etat, routeCoordinates }) => {
  // We need a unique key for the map container to force re-render
  const mapKey = `map-${position[0]}-${position[1]}-${Date.now()}`;

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      key={mapKey}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={position} icon={truckIcon}>
        <Popup>
          <strong>{matricule}</strong>
          <br />
          {etat}
          <br />
          {address}
        </Popup>
      </Marker>

      {routeCoordinates && routeCoordinates.length > 1 && (
        <Polyline positions={routeCoordinates} color="blue" weight={3} />
      )}
    </MapContainer>
  );
};

// Define PropTypes for the Map component
Map.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  address: PropTypes.string.isRequired,
  matricule: PropTypes.string.isRequired,
  etat: PropTypes.string.isRequired,
  routeCoordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
};

// Default props
Map.defaultProps = {
  routeCoordinates: [],
};

export default Map;
