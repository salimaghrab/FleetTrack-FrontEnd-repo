import axios from "axios";

const API_URL = "/api/Camion/AvecConducteurs";
const ADD_CAMION_URL = "/api/Camion";
const MAPBOX_API_KEY =
  "sk.eyJ1IjoibWVkc2xpbWFuNCIsImEiOiJjbTg2Z2ZjZ2cwNHEzMmtzMnZzYzE0aGtlIn0.obpueI9f1mwDMRFBav8gRQ"; // Mets ta clé API ici

// 🔹 Récupérer les camions
export const fetchCamions = async () => {
  try {
    const { data } = await axios.get(API_URL);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des camions:", error);
    throw error;
  }
};

// 🔹 Convertir latitude/longitude en adresse
export const getAdresseFromCoords = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_API_KEY}`
    );
    const data = await response.json();

    if (data.features.length > 0) {
      return data.features[0].place_name;
    } else {
      throw new Error("Adresse introuvable");
    }
  } catch (error) {
    console.error("Erreur de géocodage Mapbox:", error);
    return "Adresse inconnue";
  }
};

// 🔹 Convertir une adresse en latitude/longitude
export const getCoordsFromAddress = async (adresse) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        adresse
      )}.json?access_token=${MAPBOX_API_KEY}`
    );

    const data = await response.json();
    if (data.features.length === 0) {
      throw new Error("Adresse non trouvée");
    }

    const [longitude, latitude] = data.features[0].center;
    return { latitude, longitude };
  } catch (error) {
    console.error("Erreur de géocodage :", error);
    return null;
  }
};

// 🔹 Ajouter un camion après géocodage
export const ajouterCamion = async (camion) => {
  const coords = await getCoordsFromAddress(camion.adresse);
  if (!coords) {
    alert("Adresse invalide, veuillez réessayer.");
    return;
  }

  const camionData = {
    Etat: camion.etat,
    Matricule: camion.matricule,
    latitude: coords.latitude,
    longitude: coords.longitude,
  };

  try {
    const response = await axios.post(ADD_CAMION_URL, camionData);
    alert("Camion ajouté avec succès !");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du camion:", error);
    alert("Échec de l'ajout du camion.");
  }
};
export const modifierCamion = async (camion) => {
  try {
    console.log("Données pour modification:", JSON.stringify(camion));

    const response = await fetch(`/api/Camion/${camion.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(camion),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur API: ${errorMessage}`);
    }

    return "Camion modifiée avec succès.";
  } catch (error) {
    console.error("Erreur dans modifierMission:", error);
    throw error;
  }
};

export const getNombreTotalConducteurs = async () => {
  try {
    const camions = await fetchCamions();

    let total = 0;
    camions.forEach((camion) => {
      if (camion.conducteurs && camion.conducteurs.length > 0) {
        total += camion.conducteurs.length;
      }
    });

    return total;
  } catch (error) {
    console.error("Erreur lors du comptage des conducteurs:", error);
    return 0;
  }
};
