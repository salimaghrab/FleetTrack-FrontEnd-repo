// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlatformSettings from "./components/PlatformSettings";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
// Overview page components
import Header from "layouts/profile/components/Header";

function Overview() {
  // 🧠 Récupère les données utilisateur depuis le localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  const params = useParams();
  const isSettingsRoute = location.pathname.startsWith("/PlatformSettings");
  const conducteurInfo = user
    ? {
        nom: user.conducteur.nom,
        prenom: user.conducteur.prenom,
        email: user.email,
        téléphone: user.conducteur.telephone,
        âge: user.conducteur.age,
      }
    : {};

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={5} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }}>
            <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
            {showSettings ? (
              <PlatformSettings />
            ) : (
              <ProfileInfoCard
                title="Détails du conducteur"
                description="Voici les informations personnelles enregistrées."
                info={conducteurInfo}
                social={[
                  { link: "https://www.facebook.com/", icon: <FacebookIcon />, color: "facebook" },
                ]}
                action={{
                  route: "/PlatformSettings/:id",
                  tooltip: "Modifier le profil",
                  onClick: () => setShowSettings(true),
                }}
                shadow={false}
              />
            )}

            <Divider orientation="vertical" sx={{ mx: 0 }} />
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
