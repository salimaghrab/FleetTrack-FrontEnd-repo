import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchCamions, getAdresseFromCoords } from "../service/camionservices";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import IconButton from "@mui/material/IconButton";
import { useMaterialUIController } from "context";
import { Icon } from "@mui/material";
// Table Component
import DataTable from "examples/Tables/DataTable";
import Camions from "..";
function CamionsTable() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const columns = [
    { Header: "Matricule", accessor: "matricule", align: "center" },
    { Header: "État", accessor: "etat", align: "center" },
    { Header: "Position", accessor: "position", align: "center" },
    { Header: "Conducteurs", accessor: "conducteurs", align: "center" },
    { Header: "Actions", accessor: "action", align: "center" },
  ];
  const handleEdit = (camion) => {
    // Navigate to edit page with mission ID
    navigate(`/camions/modifier/${camion.id}`, {
      state: { camion: Camions },
    });
  };

  useEffect(() => {
    const fetchCamionsWithAdresses = async () => {
      try {
        const camions = await fetchCamions();

        const formattedRows = await Promise.all(
          camions.map(async (camion) => {
            const adresse = await getAdresseFromCoords(camion.latitude, camion.longitude);

            return {
              matricule: (
                <MDTypography variant="button" fontWeight="medium">
                  {camion.matricule}
                </MDTypography>
              ),
              etat: (
                <MDBox ml={-1}>
                  <MDBadge
                    badgeContent={camion.etat}
                    color={
                      camion.etat === "Disponible"
                        ? "success"
                        : camion.etat === "En mission"
                        ? "warning"
                        : "error"
                    }
                    variant="gradient"
                    size="sm"
                  />
                </MDBox>
              ),
              position: (
                <MDTypography variant="caption" fontWeight="medium">
                  {adresse}
                </MDTypography>
              ),
              conducteurs: (
                <MDTypography variant="caption" fontWeight="medium">
                  {camion.conducteurs && camion.conducteurs.length > 0
                    ? camion.conducteurs.map((c) => `${c.nom} ${c.prenom}`).join(", ")
                    : "Aucun"}
                </MDTypography>
              ),
              action: (
                <MDBox display="flex" gap={1}>
                  <IconButton
                    color="info"
                    onClick={() => navigate(`/camions/tracking/${camion.id}`)}
                  >
                    <LocationOnIcon />
                  </IconButton>
                  <MDButton
                    variant="text"
                    color={darkMode ? "white" : "dark"}
                    onClick={() => handleEdit(camion)}
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
        console.error("Erreur lors de la récupération des camions avec adresses:", error);
      }
    };

    fetchCamionsWithAdresses();
  }, []);

  return (
    <MDBox pt={3}>
      <MDBox display="flex" justifyContent="flex-end" mb={2}>
        <MDButton variant="gradient" color="success" onClick={() => navigate("/camions/ajouter")}>
          + Ajouter un nouveau camion
        </MDButton>
      </MDBox>
      <MDBox pt={3}>
        <DataTable
          table={{ columns, rows }}
          isSorted={false}
          entriesPerPage={10}
          showTotalEntries={true}
          noEndBorder
        />
      </MDBox>
    </MDBox>
  );
}

export default CamionsTable;
