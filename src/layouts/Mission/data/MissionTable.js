import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAddressFromCoords } from "../service/MissionService";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { useMaterialUIController } from "context";
// Table Component
import DataTable from "examples/Tables/DataTable";

function MissionTable() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const columns = [
    { Header: "Conducteur", accessor: "driver", align: "left" },
    { Header: "Destination", accessor: "destination", align: "left" },
    { Header: "Date/Heure", accessor: "dateTime", align: "center" },
    { Header: "Statut", accessor: "status", align: "center" },
    { Header: "Téléphone", accessor: "phone", align: "center" },
    { Header: "Actions", accessor: "action", align: "center" },
  ];

  const fetchMissions = async () => {
    try {
      const response = await axios.get("api/Mission/all");
      const missions = response.data || [];

      console.log("Raw mission data:", missions); // Log all mission data to see its structure

      // 🔄 Convert coordinates to addresses with better error handling
      const formattedRows = await Promise.all(
        missions.map(async (mission) => {
          let address = "Adresse inconnue";

          // Debug the full mission object to see all available fields
          console.log(`Mission ID: ${mission.id}, full data:`, mission);

          // Check if coordinates are available anywhere in the mission object
          // Try all possible coordinate field combinations
          if (
            mission.destination &&
            typeof mission.destination === "string" &&
            mission.destination.includes(".")
          ) {
            // Case: Coordinates are stored in the destination field as a string
            console.log(`Trying coordinates from destination field: ${mission.destination}`);
            address = await getAddressFromCoords(mission.destination);
          } else if (mission.coordinates && typeof mission.coordinates === "string") {
            // Case: Coordinates are stored in a dedicated coordinates field
            console.log(`Trying with coordinates field: ${mission.coordinates}`);
            address = await getAddressFromCoords(mission.coordinates);
          } else if (mission.longitude && mission.latitude) {
            // Case: Longitude and latitude are separate fields and both exist
            console.log(`Trying with separate lon/lat: ${mission.longitude}, ${mission.latitude}`);
            address = await getAddressFromCoords(mission.longitude, mission.latitude);
          } else if (mission.coordonnees && typeof mission.coordonnees === "string") {
            // French field name case
            console.log(`Trying with coordonnees field: ${mission.coordonnees}`);
            address = await getAddressFromCoords(mission.coordonnees);
          } else if (mission.location) {
            // Case: Location field
            if (typeof mission.location === "string") {
              console.log(`Trying with location field (string): ${mission.location}`);
              address = await getAddressFromCoords(mission.location);
            } else if (mission.location.longitude && mission.location.latitude) {
              console.log(
                `Trying with location object: ${mission.location.longitude}, ${mission.location.latitude}`
              );
              address = await getAddressFromCoords(
                mission.location.longitude,
                mission.location.latitude
              );
            }
          }

          return {
            driver: mission.conducteur ? (
              <MDBox display="flex" alignItems="center">
                <MDAvatar
                  src={
                    mission.conducteur.image
                      ? `data:image/jpeg;base64,${mission.conducteur.image}`
                      : ""
                  }
                  name={`${mission.conducteur.nom} ${mission.conducteur.prenom}`}
                  size="sm"
                />
                <MDBox ml={2} lineHeight={1}>
                  <MDTypography display="block" variant="button" fontWeight="medium">
                    {mission.conducteur.nom} {mission.conducteur.prenom}
                  </MDTypography>
                  <MDTypography variant="caption">Age: {mission.conducteur.age}</MDTypography>
                </MDBox>
              </MDBox>
            ) : (
              <MDTypography variant="caption">Non assigné</MDTypography>
            ),
            destination: (
              <MDTypography variant="button" fontWeight="medium">
                {address}
              </MDTypography>
            ),
            dateTime: (
              <MDTypography variant="caption" fontWeight="medium">
                {new Date(mission.dateTime).toLocaleString()}
              </MDTypography>
            ),
            status: mission.isCompleted ? (
              <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="text"
                fontWeight="medium"
              >
                Done
              </MDTypography>
            ) : (
              <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="text"
                fontWeight="medium"
              >
                Working
              </MDTypography>
            ),
            phone: (
              <MDTypography variant="caption" fontWeight="medium">
                {mission.conducteur?.telephone || "N/A"}
              </MDTypography>
            ),
            action: (
              <MDBox>
                <MDButton variant="text" color="error" onClick={() => handleDelete(mission.id)}>
                  <Icon>delete</Icon>
                </MDButton>
                <MDButton
                  variant="text"
                  color={darkMode ? "white" : "dark"}
                  onClick={() => handleEdit(mission)}
                >
                  <Icon>edit</Icon>
                </MDButton>
              </MDBox>
            ),
          };
        })
      );

      setRows(formattedRows);
    } catch (error) {
      console.error("Erreur lors de la récupération des missions:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/Mission/${id}`);
      console.log("✅ Mission supprimée avec succès !");
      await fetchMissions(); // 🔄 Refresh after deletion
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error);
    }
  };
  const handleEdit = (mission) => {
    // Navigate to edit page with mission ID
    navigate(`/Mission/modifier/${mission.id}`, {
      state: { missionData: mission },
    });
  };

  useEffect(() => {
    fetchMissions(); // ⏱️ Initial load
  }, []);

  return (
    <MDBox pt={3}>
      <MDBox display="flex" justifyContent="flex-end" mb={2}>
        <MDButton variant="gradient" color="info" onClick={() => navigate("/missions/new")}>
          Créer une Mission
        </MDButton>
      </MDBox>

      <DataTable
        table={{ columns, rows }}
        isSorted={false}
        entriesPerPage={10}
        showTotalEntries={true}
        noEndBorder
      />
    </MDBox>
  );
}

export default MissionTable;
