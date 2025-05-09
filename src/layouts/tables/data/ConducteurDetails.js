import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Set the base URL for all axios requests

const ConducteurDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conducteur, setConducteur] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchConducteur = async () => {
      try {
        const res = await axios.get(`/api/conducteurs/${id}`);
        setConducteur(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Erreur lors du fetch du conducteur :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConducteur();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const form = new FormData();
    form.append("Nom", formData.nom);
    form.append("Prenom", formData.prenom);
    form.append("Age", formData.age);
    form.append("Telephone", formData.telephone);
    if (imageFile) form.append("image", imageFile);

    try {
      await axios.put(`/api/conducteurs/update/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEditMode(false);
      const res = await axios.get(`/api/conducteurs/${id}`);
      setConducteur(res.data);
      setFormData(res.data);
      setImageFile(null);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  if (loading) return <CircularProgress />;
  if (!conducteur) return <Typography>Conducteur introuvable.</Typography>;

  const avatarSrc = formData.imagePreview
    ? formData.imagePreview
    : conducteur.image
    ? `data:image/jpeg;base64,${btoa(
        String.fromCharCode(...new Uint8Array(conducteur.image.data))
      )}`
    : undefined;

  return (
    <DashboardLayout>
      <Paper elevation={3} sx={{ padding: 4, margin: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Retour
        </Button>

        <Typography variant="h4" gutterBottom mt={2} textAlign="center">
          {editMode ? "Modifier le Conducteur" : "Détails du Conducteur"}
        </Typography>

        <Grid container direction="column" alignItems="center" spacing={1} mb={2}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="upload-photo"
            style={{ display: "none" }}
            disabled={!editMode}
          />
          <label htmlFor="upload-photo">
            <Avatar
              src={avatarSrc}
              sx={{ width: 120, height: 120, mb: 1, cursor: editMode ? "pointer" : "default" }}
            >
              <PersonIcon sx={{ fontSize: 50 }} />
            </Avatar>
          </label>
          {editMode && (
            <Typography variant="caption" color="text.secondary">
              Cliquez pour changer la photo
            </Typography>
          )}
        </Grid>

        <Grid container spacing={2}>
          {["nom", "prenom", "telephone", "age"].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
              />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} mt={3}>
          <Grid item>
            {editMode ? (
              <>
                <Button variant="contained" color="success" onClick={handleSave}>
                  Enregistrer
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setFormData(conducteur);
                    setEditMode(false);
                    setImageFile(null);
                  }}
                  sx={{ ml: 2 }}
                >
                  Annuler
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                Modifier
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </DashboardLayout>
  );
};

export default ConducteurDetails;
