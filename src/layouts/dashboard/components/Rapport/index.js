/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import React, { useEffect, useState } from "react";
import axios from "axios";

// @mui material components
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// Composant pour afficher la destination avec icône
function Destination({ destination }) {
  return (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="2rem"
        height="2rem"
        borderRadius="md"
        color="white"
        bgColor="info"
        variant="gradient"
        mr={2}
      >
        <LocationOnIcon fontSize="small" />
      </MDBox>
      <MDBox display="flex" flexDirection="column">
        <MDTypography variant="button" fontWeight="medium">
          Destination
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {destination}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

// Composant principal pour afficher la table des rapports
function RapportMissionTable() {
  const [rows, setRows] = useState([]);
  const [rapportsData, setRapportsData] = useState([]);

  const columns = [
    { Header: "mission", accessor: "mission", width: "30%", align: "left" },
    { Header: "distance", accessor: "distance", align: "center" },
    { Header: "temps", accessor: "temps", align: "center" },
    { Header: "statut", accessor: "statut", align: "center" },
    { Header: "actions", accessor: "actions", align: "center" },
  ];

  // Formater la date et l'heure
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Formater la distance en km
  const formatDistance = (meters) => {
    return (meters / 1000).toFixed(2) + " km";
  };

  // Formater le temps passé
  const formatTimeSpent = (timeStr) => {
    if (!timeStr) return "N/A";
    // Format "hh:mm:ss.mmm" à "hh h mm min"
    const timeParts = timeStr.split(":");
    if (timeParts.length < 2) return timeStr;

    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    return `${hours} h ${minutes} min`;
  };

  // Voir les détails d'un rapport
  const handleViewDetails = (id) => {
    console.log("Voir les détails du rapport:", id);
    // Naviguer vers la page de détails
    // window.location.href = `/rapports/${id}`;
  };

  const formatRows = (rapports) =>
    rapports.map((rapport) => ({
      mission: <Destination destination={rapport.mission.destination} />,
      distance: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatDistance(rapport.totalDistance)}
        </MDTypography>
      ),
      temps: (
        <MDBox display="flex" alignItems="center" justifyContent="center">
          <AccessTimeIcon color="info" fontSize="small" sx={{ mr: 1 }} />
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {formatTimeSpent(rapport.totalTimeSpent)}
          </MDTypography>
        </MDBox>
      ),
      statut: (
        <MDBox display="flex" alignItems="center" justifyContent="center">
          {rapport.isMissionCompleted ? (
            <>
              <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 1 }} />
              <MDTypography variant="caption" color="success" fontWeight="medium">
                Complétée
              </MDTypography>
            </>
          ) : (
            <>
              <CancelIcon color="error" fontSize="small" sx={{ mr: 1 }} />
              <MDTypography variant="caption" color="error" fontWeight="medium">
                En cours
              </MDTypography>
            </>
          )}
        </MDBox>
      ),
      actions: (
        <MDBox display="flex" justifyContent="center">
          <MDButton
            variant="text"
            color="info"
            onClick={() => handleViewDetails(rapport.id)}
            sx={{ mx: 1 }}
          >
            <Icon>visibility</Icon>&nbsp;Détails
          </MDButton>
          <Tooltip title={formatDateTime(rapport.dateRapport)} placement="top">
            <MDButton
              variant="outlined"
              color="secondary"
              size="small"
              iconOnly
              circular
              sx={{ mx: 1 }}
            >
              <Icon>calendar_today</Icon>
            </MDButton>
          </Tooltip>
        </MDBox>
      ),
    }));

  useEffect(() => {
    const fetchRapports = async () => {
      try {
        const response = await axios.get("/api/Rapport/all");
        const rapports = response.data || [];
        setRapportsData(rapports);
        setRows(formatRows(rapports));
      } catch (error) {
        console.error("Erreur lors du chargement des rapports:", error);
      }
    };

    fetchRapports();
  }, []);

  return (
    <MDBox pt={3}>
      <DataTable
        table={{ columns, rows }}
        isSorted={true}
        entriesPerPage={{ defaultValue: 5, entries: [5, 10, 15, 20] }}
        showTotalEntries={true}
        canSearch={true}
        noEndBorder={false}
      />
    </MDBox>
  );
}

export default RapportMissionTable;
