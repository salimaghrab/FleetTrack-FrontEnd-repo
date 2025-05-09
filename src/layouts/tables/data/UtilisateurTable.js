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
import Switch from "@mui/material/Switch"; // Importation du composant Switch

// Table Component
import DataTable from "examples/Tables/DataTable";

// Composant pour un utilisateur (avatar + infos)
function Utilisateur({ image, nom, prenom, email }) {
  return (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={`data:image/jpeg;base64,${image}`} name={`${nom} ${prenom}`} size="sm" />
      <MDBox ml={2} display="flex" flexDirection="column">
        <MDTypography variant="button" fontWeight="medium" color="text">
          {nom} {prenom}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {email}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

Utilisateur.propTypes = {
  image: PropTypes.string,
  nom: PropTypes.string,
  prenom: PropTypes.string,
  email: PropTypes.string,
};

// Composant principal pour afficher la table des utilisateurs
function UtilisateurTable() {
  const [rows, setRows] = useState([]);
  const [usersData, setUsersData] = useState([]); // Raw users to get IDs

  const columns = [
    { Header: "utilisateur", accessor: "utilisateur", width: "30%", align: "left" },
    { Header: "rôle", accessor: "role", align: "center" },
    { Header: "téléphone", accessor: "telephone", align: "center" },
    { Header: "status", accessor: "status", align: "center" }, // Nouvelle colonne status
    { Header: "action", accessor: "action", align: "center" },
  ];

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/User/delete/${id}`);
      setUsersData((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  // Fonction pour basculer l'approbation d'un utilisateur
  const handleToggleApproval = async (id) => {
    try {
      await axios.post(`/api/User/toggle-approval/${id}`);

      // Mise à jour locale de l'état (inverser le statut actuel)
      setUsersData((prev) =>
        prev.map((user) => (user.id === id ? { ...user, approved: !user.approved } : user))
      );
    } catch (error) {
      console.error("Erreur lors du basculement de l'approbation:", error);
    }
  };

  const formatRows = (users) =>
    users.map((user) => ({
      utilisateur: (
        <Utilisateur
          image={user.conducteur?.image || ""}
          nom={user.conducteur?.nom || ""}
          prenom={user.conducteur?.prenom || ""}
          email={user.email}
        />
      ),
      role: (
        <MDBadge
          badgeContent={user.role}
          color={user.role === "Admin" ? "success" : "dark"}
          variant="gradient"
          size="sm"
        />
      ),
      telephone: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {user.conducteur?.telephone || "N/A"}
        </MDTypography>
      ),
      status: (
        <MDBox display="flex" alignItems="center" justifyContent="center">
          <Switch
            checked={user.approved === true}
            onChange={() => handleToggleApproval(user.id)}
            color="success"
          />
          <MDTypography variant="caption" color="text" fontWeight="medium" ml={1}>
            {user.approved ? "Approuvé" : "Non approuvé"}
          </MDTypography>
        </MDBox>
      ),
      action: (
        <MDButton variant="text" color="error" onClick={() => handleDelete(user.id)}>
          <Icon>delete</Icon>&nbsp;Supprimer
        </MDButton>
      ),
    }));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/User/all");
        const users = response.data || [];

        // S'assurer que chaque utilisateur a un statut d'approbation par défaut si non défini
        const usersWithApproval = users.map((user) => ({
          ...user,
          approved: user.approved === undefined ? true : user.approved,
        }));

        setUsersData(usersWithApproval);
        setRows(formatRows(usersWithApproval));
      } catch (error) {
        console.error("Erreur lors du fetch des utilisateurs:", error);
      }
    };

    fetchUsers();
  }, []);

  // Update rows when usersData changes (after delete or status change)
  useEffect(() => {
    setRows(formatRows(usersData));
  }, [usersData]);

  return (
    <MDBox pt={3}>
      <DataTable
        table={{ columns, rows }}
        isSorted={false}
        entriesPerPage={false}
        showTotalEntries={false}
        noEndBorder
      />
    </MDBox>
  );
}

export default UtilisateurTable;
