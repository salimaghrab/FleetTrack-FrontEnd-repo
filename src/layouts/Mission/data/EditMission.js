import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  modifierMission,
  getCoordsFromAddress,
  getAllConducteurs,
  getAddressFromCoords,
} from "../service/MissionService";

// Composants Material Dashboard 2 React
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Icon from "@mui/material/Icon";

function EditMission() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  console.log("Location state:", location.state);
  const missionDataFromState = location.state?.missionData;

  const [formData, setFormData] = useState({
    id: "",
    destination: "", // Uniquement ce champ pour l'adresse/coordonnées
    dateTime: "",
    conducteurId: "",
    isCompleted: false,
  });

  const [conducteurs, setConducteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addressMode, setAddressMode] = useState(true); // true = adresse, false = coordonnées
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data for mission ID:", id);

        let missionData = missionDataFromState;
        if (!missionData || Object.keys(missionData).length === 0) {
          console.log("No initial data, fetching from API...");
          const response = await axios.get(`/api/Mission/${id}`);
          missionData = response.data;
          console.log("Fetched mission data from API:", missionData);
        }

        const allConducteurs = await getAllConducteurs();
        console.log("Fetched conducteurs:", allConducteurs.length);

        let dateTimeValue = "";
        if (missionData.dateTime) {
          const date = new Date(missionData.dateTime);
          dateTimeValue = date.toISOString().slice(0, 16);
        }
        let destination = missionData.destination || "";

        // 🎯 Ici la conversion coordonnées => adresse
        if (destination.includes(",")) {
          const coordsParts = destination.split(",");
          if (coordsParts.length === 2) {
            const [lng, lat] = coordsParts.map((x) => parseFloat(x.trim()));
            const address = await getAddressFromCoords({ lat, lng });
            if (address) destination = address;
          }
        }
        const formDataToSet = {
          id: missionData.id || id,
          destination: missionData.destination || "",
          dateTime: dateTimeValue,
          conducteurId: missionData.conducteur?.id || "",
          isCompleted: missionData.isCompleted || false,
        };

        console.log("Setting form data:", formDataToSet);
        setFormData(formDataToSet);
        setConducteurs(allConducteurs);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Erreur lors du chargement des données de la mission.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, missionDataFromState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const toggleAddressMode = () => {
    setAddressMode(!addressMode);
  };

  const validateForm = () => {
    if (!formData.destination.trim()) {
      setError("La destination est requise.");
      return false;
    }

    if (!formData.dateTime) {
      setError("La date et l'heure sont requises.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      let destinationToSend = formData.destination;

      // Si en mode adresse, convertir en coordonnées si nécessaire
      if (addressMode) {
        const coords = await getCoordsFromAddress(formData.destination);
        if (coords) {
          destinationToSend = coords;
        }
      }

      const missionToSave = {
        ...formData,
        destination: destinationToSend,
      };

      console.log("Données envoyées:", missionToSave);
      await modifierMission(missionToSave);

      setSuccess("Mission modifiée avec succès !");
      setTimeout(() => navigate("/missions"), 2000);
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      setError("Erreur lors de la modification de la mission. " + (err.message || ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h5" color="white">
                  Modifier la Mission
                </MDTypography>
              </MDBox>

              <MDBox pt={3} pb={3} px={3}>
                {loading ? (
                  <MDTypography variant="body2">Chargement des données...</MDTypography>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <MDAlert color="error" mb={2}>
                        {error}
                      </MDAlert>
                    )}

                    {success && (
                      <MDAlert color="success" mb={2}>
                        {success}
                      </MDAlert>
                    )}

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <MDInput
                          type="datetime-local"
                          label="Date/Heure"
                          name="dateTime"
                          value={formData.dateTime}
                          onChange={handleChange}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          required
                          margin="dense"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <MDBox display="flex" alignItems="center" mb={1}>
                          <MDTypography variant="button" fontWeight="regular">
                            Mode de saisie:
                          </MDTypography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={addressMode}
                                onChange={toggleAddressMode}
                                name="addressMode"
                                color="primary"
                              />
                            }
                            label={addressMode ? "Adresse" : "Coordonnées"}
                            sx={{ ml: 1 }}
                          />
                        </MDBox>

                        <MDInput
                          label={
                            addressMode
                              ? "Adresse de destination"
                              : "Coordonnées (longitude,latitude)"
                          }
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          fullWidth
                          required
                          margin="dense"
                          helperText={addressMode ? "" : "Exemple: 2.3522,48.8566"}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="dense">
                          <InputLabel id="conducteur-label">Conducteur</InputLabel>
                          <Select
                            labelId="conducteur-label"
                            name="conducteurId"
                            value={formData.conducteurId}
                            onChange={handleChange}
                            label="Conducteur"
                          >
                            <MenuItem value="">
                              <em>Non assigné</em>
                            </MenuItem>
                            {conducteurs.map((conducteur) => (
                              <MenuItem key={conducteur.id} value={conducteur.id}>
                                {conducteur.nom} {conducteur.prenom}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.isCompleted}
                              onChange={handleChange}
                              name="isCompleted"
                              color="success"
                            />
                          }
                          label="Mission terminée"
                        />
                      </Grid>
                    </Grid>

                    <MDBox mt={4} mb={1} display="flex" justifyContent="space-between">
                      <MDButton
                        variant="gradient"
                        color="light"
                        onClick={() => navigate("/missions")}
                        startIcon={<Icon>arrow_back</Icon>}
                      >
                        Retour
                      </MDButton>

                      <MDButton
                        type="submit"
                        variant="gradient"
                        color="info"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Traitement..." : "Enregistrer"}
                      </MDButton>
                    </MDBox>
                  </form>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditMission;
