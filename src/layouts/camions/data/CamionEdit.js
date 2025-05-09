import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, MenuItem, Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { modifierCamion } from "../service/camionservices";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

function CamionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [matricule, setMatricule] = useState("");
  const [etat, setEtat] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [camionSansConducteur, setCamionSansConducteur] = useState(false);
  const [conducteursDispo, setConducteursDispo] = useState([]);
  const [conducteurSelectionne, setConducteurSelectionne] = useState(null);

  useEffect(() => {
    const fetchCamion = async () => {
      try {
        const response = await axios.get(`/api/Camion/${id}`);
        const camion = response.data;
        console.log(camion);
        setMatricule(camion.matricule);
        setEtat(camion.etat);
        setLatitude(camion.latitude);
        setLongitude(camion.longitude);

        if (!camion.conducteurs || camion.conducteurs.length === 0) {
          setCamionSansConducteur(true);
          const conducteursRes = await axios.get("/api/conducteurs/all");
          setConducteursDispo(conducteursRes.data);
        }
      } catch (error) {
        console.error("Erreur de récupération du camion :", error);
        alert("Impossible de récupérer le camion.");
      }
    };

    fetchCamion();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (camionSansConducteur && conducteurSelectionne) {
        // 🧠 SEULEMENT assignation
        await axios.post("/api/Camion/AssignerConducteur", {
          camionId: parseInt(id),
          conducteurId: parseInt(conducteurSelectionne),
        });
      } else {
        // 🧠 SEULEMENT modification des infos
        const camionModifié = {
          id: parseInt(id),
          matricule,
          etat,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        };

        await modifierCamion(camionModifié);
      }

      alert("Opération réussie !");
      navigate("/camions");
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur s'est produite.");
    }
  };

  return (
    <DashboardLayout>
      <Card>
        <MDBox p={4}>
          <MDTypography variant="h4" mb={2}>
            Modifier Camion
          </MDTypography>
          <form onSubmit={handleSubmit}>
            <MDBox mb={3}>
              <TextField
                label="Matricule"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                fullWidth
              />
            </MDBox>

            <MDBox mb={3}>
              <TextField
                label="État"
                value={etat}
                onChange={(e) => setEtat(e.target.value)}
                fullWidth
              />
            </MDBox>

            <MDBox mb={3}>
              <TextField
                label="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                fullWidth
              />
            </MDBox>

            <MDBox mb={3}>
              <TextField
                label="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                fullWidth
              />
            </MDBox>

            {camionSansConducteur && (
              <MDBox mb={3}>
                <TextField
                  select
                  label="Assigner un conducteur"
                  value={conducteurSelectionne || ""}
                  onChange={(e) => setConducteurSelectionne(e.target.value)}
                  fullWidth
                >
                  {conducteursDispo.map((conducteur) => (
                    <MenuItem key={conducteur.id} value={conducteur.id}>
                      {conducteur.nom} {conducteur.prenom}
                    </MenuItem>
                  ))}
                </TextField>
              </MDBox>
            )}

            <MDBox mt={2} display="flex" justifyContent="flex-end" gap={2}>
              <MDButton variant="outlined" color="dark" onClick={() => navigate("/camions")}>
                Annuler
              </MDButton>
              <MDButton type="submit" variant="gradient" color="info">
                Enregistrer
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default CamionEdit;
