import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import { Link } from "react-router-dom";

// Material UI components for confirmation dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

// Table Component
import DataTable from "examples/Tables/DataTable";

function Conducteur({ image, nom, prenom }) {
  return (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={`data:image/jpeg;base64,${image}`} name={`${nom} ${prenom}`} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {nom} {prenom}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

Conducteur.propTypes = {
  image: PropTypes.string,
  nom: PropTypes.string,
  prenom: PropTypes.string,
};

function ConducteurTable() {
  const [rows, setRows] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [conducteurToDelete, setConducteurToDelete] = useState(null);
  const columns = [
    { Header: "conducteur", accessor: "conducteur", width: "30%", align: "left" },
    { Header: "téléphone", accessor: "telephone", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "âge", accessor: "age", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const fetchConducteurs = async () => {
    try {
      const response = await axios.get("api/conducteurs/all");
      const conducteurs = response.data || [];

      const formattedRows = conducteurs.map((c) => ({
        conducteur: <Conducteur image={c.image} nom={c.nom} prenom={c.prenom} />,
        telephone: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {c.telephone || "N/A"}
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={c.status || "offline"}
              color={c.status === "online" ? "success" : "dark"}
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        age: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {c.age || "N/A"}
          </MDTypography>
        ),
        action: (
          <MDBox display="flex" justifyContent="center">
            <Link to={`/conducteurs/${c.id}`} style={{ marginRight: "8px" }}>
              <MDTypography
                component="span"
                variant="caption"
                color="info"
                fontWeight="medium"
                style={{ cursor: "pointer" }}
              >
                Éditer
              </MDTypography>
            </Link>
            <MDButton
              variant="text"
              color="error"
              size="small"
              onClick={() => handleDeleteClick(c.id)}
            >
              <Icon fontSize="small">delete</Icon>
            </MDButton>
          </MDBox>
        ),
      }));

      setRows(formattedRows);
    } catch (error) {
      console.error("Erreur lors du fetch des conducteurs:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setConducteurToDelete(id);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`api/conducteurs/delete/${conducteurToDelete}`);
      // Refresh the conducteurs list after successful deletion
      fetchConducteurs();
      setConfirmDelete(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du conducteur:", error);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDelete(false);
    setConducteurToDelete(null);
  };

  useEffect(() => {
    fetchConducteurs();
  }, []);

  return (
    <MDBox pt={3}>
      <DataTable
        table={{ columns, rows }}
        isSorted={false}
        entriesPerPage={false}
        showTotalEntries={false}
        noEndBorder
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmer la suppression"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer ce conducteur ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

export default ConducteurTable;
