import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ajouterCamion } from "../service/camionservices";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Card from "@mui/material/Card";

function CamionAdd() {
  const [matricule, setMatricule] = useState("");
  const [etat, setEtat] = useState("Disponible");
  const [adresse, setAdresse] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const camion = { matricule, etat, adresse };

    try {
      await ajouterCamion(camion); // ⬅️ Appel du service centralisé
      navigate("/camions"); // 🔁 Redirection
    } catch (error) {
      console.error("Erreur lors de l'ajout du camion :", error);
      alert("Erreur lors de l'ajout du camion. Essaie plus tard !");
    }
  };

  return (
    <DashboardLayout>
      <MDBox p={3}>
        <Card>
          <MDBox p={4}>
            <MDTypography variant="h4" mb={3}>
              Ajouter un Camion via Adresse 📍
            </MDTypography>
            <form onSubmit={handleSubmit}>
              <MDBox mb={3}>
                <MDInput
                  label="Matricule"
                  fullWidth
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  required
                />
              </MDBox>

              <MDBox mb={3}>
                <FormControl fullWidth>
                  <InputLabel id="etat-label">État</InputLabel>
                  <Select
                    labelId="etat-label"
                    value={etat}
                    onChange={(e) => setEtat(e.target.value)}
                    required
                  >
                    <MenuItem value="Disponible">Disponible</MenuItem>
                    <MenuItem value="En mission">En mission</MenuItem>
                    <MenuItem value="En panne">En panne</MenuItem>
                  </Select>
                </FormControl>
              </MDBox>

              <MDBox mb={3}>
                <MDInput
                  label="Adresse"
                  fullWidth
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  required
                  placeholder="Ex : Avenue Habib Bourguiba, Tunis"
                />
              </MDBox>

              <MDButton type="submit" color="info" variant="gradient">
                Ajouter le Camion
              </MDButton>
            </form>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default CamionAdd;
