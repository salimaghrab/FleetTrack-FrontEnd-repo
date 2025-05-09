import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Material Dashboard Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const TrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [state, setState] = useState({
    camion: null,
    routeData: null,
    address: "",
    loading: true,
    error: null,
  });

  // IMPORTANT: Replace with public token (pk.) instead of secret key (sk.)
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoibWVkc2xpbWFuNCIsImEiOiJjbGp1N3VxaDQwMnhmM2RueGU1aDFkdmEzIn0.bODwBvSKSWQgWiEm2cqMJA";

  // Create truck icon
  const truckIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/477/477120.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Function to initialize or update the map
  const initializeOrUpdateMap = () => {
    const { camion, routeData, address } = state;

    if (!camion || !mapContainerRef.current) return;

    const position = [camion.latitude, camion.longitude];

    // If map already exists, clean it up before re-initializing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create new map instance
    const map = L.map(mapContainerRef.current).setView(position, 13);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add marker for truck position
    const marker = L.marker(position, { icon: truckIcon }).addTo(map);
    marker.bindPopup(`<strong>${camion.matricule}</strong><br/>${camion.etat}<br/>${address}`);

    // Add route polyline if available
    if (routeData && routeData.coordinates && routeData.coordinates.length > 1) {
      const polyline = L.polyline(routeData.coordinates, { color: "blue", weight: 3 }).addTo(map);
      map.fitBounds(polyline.getBounds());
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        // 1. njib camion lat long
        const truckRes = await axios.get(`/api/Camion/${id}`);
        if (!isMounted) return;
        if (!truckRes.data) throw new Error("Camion introuvable");

        // 2. map routes
        const routeRes = await axios.get(`/api/Camion/TrackCamion/${id}`);
        if (!isMounted) return;
        if (!routeRes.data) throw new Error("Données de route indisponibles");

        // 3.  geocoding
        let address = "Adresse inconnue";
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${truckRes.data.longitude},${truckRes.data.latitude}.json?access_token=${MAPBOX_TOKEN}`
          );
          const data = await response.json();
          address = data.features[0]?.place_name || address;
        } catch (geocodeError) {
          console.error("Erreur de géocodage:", geocodeError);
        }

        if (isMounted) {
          setState({
            camion: truckRes.data,
            routeData: {
              ...routeRes.data,
              coordinates:
                routeRes.data.geometry?.coordinates?.map((coord) => [coord[1], coord[0]]) || [],
            },
            address,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        console.error("Erreur:", err);
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err.response?.data?.message || err.message,
          }));
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);

      // Clean up map when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [id]);

  // Update the map when data changes
  useEffect(() => {
    if (!state.loading && state.camion) {
      initializeOrUpdateMap();
    }
  }, [state.camion, state.routeData]);

  const { camion, routeData, address, loading, error } = state;

  if (loading) {
    return (
      <MDBox p={3}>
        <Card>
          <MDBox
            p={3}
            textAlign="center"
            height="70vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <MDTypography variant="h6">Chargement en cours...</MDTypography>
          </MDBox>
        </Card>
      </MDBox>
    );
  }

  if (error) {
    return (
      <MDBox p={3}>
        <Card>
          <MDBox
            p={3}
            textAlign="center"
            height="70vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <MDTypography color="error">{error}</MDTypography>
            <MDBox mt={2}>
              <MDButton color="primary" onClick={() => navigate("/camions")}>
                Retour à la liste
              </MDButton>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
    );
  }

  if (!camion || !routeData) return null;

  return (
    <DashboardLayout>
      <MDBox p={3}>
        <Card>
          <MDBox p={3}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <MDTypography variant="h4">Suivi Camion {camion.matricule}</MDTypography>
              <MDButton
                variant="gradient"
                color="info"
                onClick={() => navigate("/camions")}
                size="small"
              >
                Retour aux camions
              </MDButton>
            </MDBox>

            <MDBox display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 3fr" }} gap={2}>
              {/* Info Panel */}
              <MDBox>
                <Card>
                  <MDBox p={2}>
                    <MDTypography variant="h6" fontWeight="medium" mb={1}>
                      Informations du camion
                    </MDTypography>

                    <MDBox mb={2} p={1} bgcolor="rgba(0,0,0,0.02)" borderRadius="lg">
                      <MDTypography variant="button" fontWeight="bold" display="block">
                        Statut:
                        <MDBadge
                          badgeContent={camion.etat}
                          color={camion.etat === "Disponible" ? "success" : "warning"}
                          size="sm"
                          container
                          ml={1}
                        />
                      </MDTypography>
                    </MDBox>

                    <MDBox mb={2} p={1} bgcolor="rgba(0,0,0,0.02)" borderRadius="lg">
                      <MDTypography variant="button" fontWeight="bold" display="block" mb={0.5}>
                        Position actuelle
                      </MDTypography>
                      <MDTypography variant="caption">{address}</MDTypography>
                    </MDBox>

                    <MDBox mb={2} p={1} bgcolor="rgba(0,0,0,0.02)" borderRadius="lg">
                      <MDTypography variant="button" fontWeight="bold" display="block" mb={0.5}>
                        Coordonnées GPS
                      </MDTypography>
                      <MDTypography variant="caption">
                        {camion.latitude?.toFixed(6)}, {camion.longitude?.toFixed(6)}
                      </MDTypography>
                    </MDBox>

                    <MDBox mb={2} p={1} bgcolor="rgba(0,0,0,0.02)" borderRadius="lg">
                      <MDTypography variant="button" fontWeight="bold" display="block" mb={0.5}>
                        Itinéraire
                      </MDTypography>
                      <MDTypography variant="caption" display="block">
                        Distance: {(routeData.distance / 1000).toFixed(2)} km
                      </MDTypography>
                      <MDTypography variant="caption" display="block">
                        Durée: {Math.floor(routeData.duration / 60)} min{" "}
                        {Math.floor(routeData.duration % 60)} sec
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
              </MDBox>

              {/* Map Container */}
              <MDBox>
                <Card sx={{ height: "100%" }}>
                  <MDBox
                    ref={mapContainerRef}
                    height="50vh"
                    width="100%"
                    borderRadius="lg"
                    overflow="hidden"
                  />
                </Card>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
};

export default TrackingPage;
