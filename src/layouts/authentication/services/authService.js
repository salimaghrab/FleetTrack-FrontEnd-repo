import axios from "axios";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`/api/User/login`, { email, password });

    console.log("📡 Réponse complète de l'API:", response);

    const { token, user } = response.data;

    console.log("🛠 Données extraites:", { token, user });

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id); // Store user ID

      // Store user object directly for immediate access
      localStorage.setItem("user", JSON.stringify(user));

      console.log("✅ User data stored:", user);
    }

    return response.data;
  } catch (error) {
    console.error("❌ Erreur de connexion:", error);
    throw error.response?.data?.message || "Erreur lors de la connexion";
  }
};

export const register = async (formData) => {
  const response = await fetch("/api/conducteurs/add-with-user", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erreur du backend :", errorData);
    throw new Error(errorData.message || "Erreur lors de l'inscription !");
  }

  return await response.json();
};
