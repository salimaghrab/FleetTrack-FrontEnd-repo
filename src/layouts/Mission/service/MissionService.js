import axios from "axios";

const API_URL = "/api/Mission"; // Remplace par l'URL de ton API backend
const CONDUCTEUR_API_URL = "/api/conducteurs/all";
const MAPBOX_API_KEY =
  "sk.eyJ1IjoibWVkc2xpbWFuNCIsImEiOiJjbTg2Z2ZjZ2cwNHEzMmtzMnZzYzE0aGtlIn0.obpueI9f1mwDMRFBav8gRQ"; // Mets ta clé API ici

// 🔹 Lister mission
export const fetchAllMissions = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    const missions = response.data;

    return missions.map((mission) => ({
      ...mission,
      conducteurNom: mission.conducteur
        ? `${mission.conducteur.nom} ${mission.conducteur.prenom}`
        : "Non assigné",
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des missions :", error);
    throw error;
  }
};

// 🔹 Ajouter une mission
export const ajouterMission = async (mission) => {
  try {
    console.log("Données envoyées :", JSON.stringify(mission));
    const response = await fetch(`${API_URL}/ajouter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mission),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur API: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans ajouterMission:", error);
    throw error;
  }
};

// 🔹 Convertir une adresse en coordonnées
export const getCoordsFromAddress = async (adresse, separator = ",") => {
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
    return `${longitude}${separator}${latitude}`;
  } catch (error) {
    console.error("Erreur de géocodage :", error);
    return null;
  }
};

// 🔹 More robust coordinate handling
export const getAddressFromCoords = async (longitude, latitude) => {
  try {
    console.log("getAddressFromCoords input:", { longitude, latitude });

    // If no coordinates provided, return early
    if (!longitude) {
      console.log("No coordinates provided");
      return "Adresse inconnue";
    }

    let lon, lat;

    // Case 1: Single string containing both coordinates
    if (typeof longitude === "string" && !latitude) {
      console.log("Processing single string coordinate");

      // Try different formats
      if (longitude.includes(",")) {
        // Format: "10.639814,35.824359"
        [lon, lat] = longitude.split(",").map(parseFloat);
      } else if (longitude.match(/\d+\.\d+\.\d+\.\d+/)) {
        // Format: "10.639814.35.824359"
        const parts = longitude.split(",");
        if (parts.length >= 4) {
          lon = parseFloat(`${parts[0]}.${parts[1]}`);
          lat = parseFloat(`${parts[2]}.${parts[3]}`);
        }
      } else if (longitude.includes(" ")) {
        // Format: "10.639814 35.824359"
        [lon, lat] = longitude.split(" ").map(parseFloat);
      } else if (longitude.includes(".")) {
        // Last attempt - split by last period
        const lastDotIndex = longitude.lastIndexOf(".");
        lon = parseFloat(longitude.substring(0, lastDotIndex));
        lat = parseFloat(longitude.substring(lastDotIndex + 1));
      }
    }
    // Case 2: Separate longitude and latitude parameters
    else {
      lon = parseFloat(longitude);
      lat = parseFloat(latitude);
    }

    console.log("Parsed coordinates:", { lon, lat });

    // Validate parsed coordinates
    if (isNaN(lon) || isNaN(lat)) {
      console.log("Invalid coordinates after parsing");
      return "Adresse inconnue";
    }

    // Check if coordinates are within valid ranges
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
      console.log("Coordinates out of valid range");
      return "Adresse inconnue (hors limites)";
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_API_KEY}`;
    console.log(`Making API request with coordinates: ${lon},${lat}`);

    const response = await fetch(url);
    if (!response.ok) {
      console.log(`API response not OK: ${response.status}`);
      return "Erreur API";
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      console.log("No features found in API response");
      return "Lieu non identifié";
    }

    return data.features[0].place_name;
  } catch (error) {
    console.error("Erreur de reverse géocodage:", error);
    return "Adresse inconnue";
  }
};

// 🔹 Aide pour le parsing de coordonnées compactes
const parseCoords = (coordString) => {
  // Check if the string contains at least one separator
  if (!coordString.includes(",")) {
    throw new Error("Format de coordonnées invalide");
  }

  // Split the string by the last period to separate longitude and latitude
  const lastDotIndex = coordString.lastIndexOf(".");
  const longitude = coordString.substring(0, lastDotIndex);
  const latitude = coordString.substring(lastDotIndex + 1);

  // Parse as floats and validate
  const parsedLon = parseFloat(longitude);
  const parsedLat = parseFloat(latitude);

  if (isNaN(parsedLon) || isNaN(parsedLat)) {
    throw new Error("Format de coordonnées invalide");
  }

  return {
    longitude: parsedLon,
    latitude: parsedLat,
  };
};

// 🔹 Récupérer la liste des conducteurs
export const getAllConducteurs = async () => {
  try {
    const response = await fetch(CONDUCTEUR_API_URL);
    if (!response.ok) throw new Error("Erreur lors de la récupération des conducteurs");
    return await response.json();
  } catch (error) {
    console.error("Erreur dans getAllConducteurs:", error);
    throw error;
  }
};

// 🔹 Assigner un conducteur à une mission
export const assignerConducteurMission = async (missionId, conducteurId) => {
  if (!missionId || !conducteurId) {
    console.error("Mission ID et Conducteur ID sont requis");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${missionId}/assigner-conducteur/${conducteurId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Erreur lors de l'assignation du conducteur");

    return await response.json();
  } catch (error) {
    console.error("Erreur dans assignerConducteurMission:", error);
    throw error;
  }
};
export const modifierMission = async (mission) => {
  try {
    console.log("Données pour modification:", JSON.stringify(mission));

    // Process coordinates if needed
    if (
      mission.coordinates &&
      typeof mission.coordinates === "string" &&
      mission.coordinates.includes(".")
    ) {
      const coords = mission.coordinates.split(",");
      if (coords.length >= 4) {
        mission.longitude = parseFloat(coords[0] + "." + coords[1]);
        mission.latitude = parseFloat(coords[2] + "." + coords[3]);
      }
    }

    const response = await fetch(`${API_URL}/modifier`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mission),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erreur API: ${errorMessage}`);
    }

    return "Mission modifiée avec succès.";
  } catch (error) {
    console.error("Erreur dans modifierMission:", error);
    throw error;
  }
};
