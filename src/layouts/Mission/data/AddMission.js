import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ajouterMission, getAllConducteurs, getCoordsFromAddress } from "../service/MissionService";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import MDAvatar from "components/MDAvatar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Card from "@mui/material/Card";

function AddMission() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    dateTime: "",
    isCompleted: false,
    conducteurId: "",
  });
  const [conducteurs, setConducteurs] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // Fetch available drivers
  useEffect(() => {
    const fetchConducteurs = async () => {
      try {
        const data = await getAllConducteurs();
        setConducteurs(data);
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError("Échec du chargement de la liste des conducteurs");
      }
    };
    fetchConducteurs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressConversion = async () => {
    if (!formData.destination) return;

    setAddressLoading(true);
    try {
      const coordsStr = await getCoordsFromAddress(formData.destination, ",");
      if (coordsStr) {
        setFormData((prev) => ({ ...prev, destination: coordsStr }));
        setSuccess("Adresse convertie en coordonnées avec succès");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Échec de la conversion de l'adresse en coordonnées");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert address to coordinates if it's not already in coordinate format
      let finalDestination = formData.destination;
      if (!formData.destination.includes(",")) {
        finalDestination = await getCoordsFromAddress(formData.destination, ",");
        if (!finalDestination) {
          throw new Error("Échec de la conversion de l'adresse");
        }
      }

      const missionData = {
        destination: finalDestination,
        dateTime: new Date(formData.dateTime).toISOString(),
        isCompleted: formData.isCompleted,
        conducteurId: formData.conducteurId || null,
      };

      await ajouterMission(missionData);

      setSuccess("Mission créée avec succès!");
      setTimeout(() => navigate("/missions"), 1500);
    } catch (err) {
      console.error("Error creating mission:", err);
      setError(err.message || "Échec de la création de la mission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <MDBox p={3}>
        <Card>
          <MDBox pt={4} pb={3} px={2}>
            <MDTypography variant="h4" gutterBottom>
              Créer une Nouvelle Mission
            </MDTypography>

            {error && (
              <MDAlert color="error" onClose={() => setError(null)}>
                {error}
              </MDAlert>
            )}

            {success && <MDAlert color="success">{success}</MDAlert>}

            <MDBox component="form" onSubmit={handleSubmit}>
              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  label="Destination (Adresse complète)"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
                <MDButton
                  variant="outlined"
                  color="info"
                  onClick={handleAddressConversion}
                  disabled={addressLoading || !formData.destination}
                  sx={{ mt: 1 }}
                >
                  {addressLoading ? (
                    <CircularProgress size={24} color="info" />
                  ) : (
                    "Convertir en coordonnées"
                  )}
                </MDButton>
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  fullWidth
                  type="datetime-local"
                  label="Date & Heure"
                  name="dateTime"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateTime}
                  onChange={handleChange}
                  required
                />
              </MDBox>

              <MDBox mb={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isCompleted"
                      checked={formData.isCompleted}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Mission complétée"
                />
              </MDBox>

              <MDBox mb={3}>
                <FormControl fullWidth>
                  <Select
                    name="conducteurId"
                    value={formData.conducteurId}
                    onChange={handleChange}
                    displayEmpty
                    required
                    renderValue={(selected) => {
                      if (!selected) return <em>Sélectionner un conducteur</em>;
                      const driver = conducteurs.find((c) => c.id === selected);
                      return driver ? `${driver.nom} ${driver.prenom}` : selected;
                    }}
                  >
                    <MenuItem value="">
                      <em>Sélectionner un conducteur</em>
                    </MenuItem>
                    {conducteurs.map((conducteur) => (
                      <MenuItem key={conducteur.id} value={conducteur.id}>
                        <MDBox display="flex" alignItems="center">
                          <MDAvatar
                            src={
                              conducteur.image ? `data:image/jpeg;base64,${conducteur.image}` : ""
                            }
                            name={`${conducteur.nom} ${conducteur.prenom}`}
                            size="sm"
                            mr={1}
                          />
                          {conducteur.nom} {conducteur.prenom} ({conducteur.telephone})
                        </MDBox>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MDBox>

              <MDBox display="flex" justifyContent="space-between">
                <MDButton
                  variant="gradient"
                  color="secondary"
                  onClick={() => navigate("/missions")}
                  disabled={loading}
                >
                  Annuler
                </MDButton>

                <MDButton variant="gradient" color="info" type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={24} color="white" /> : "Créer Mission"}
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default AddMission;
