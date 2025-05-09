// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Mission from "layouts/Mission";
import AddMission from "layouts/Mission/data/AddMission";
import Camions from "layouts/camions";
import TrackingPage from "layouts/camions/TrackingPage";
import ConducteurDetails from "layouts/tables/data/ConducteurDetails";
import Unauthorized from "layouts/authentication/services/Unauthorized";
import PlatformSettings from "layouts/profile/components/PlatformSettings";
// @mui icons
import Icon from "@mui/material/Icon";
import EditMission from "layouts/Mission/data/EditMission";
import CamionAdd from "layouts/camions/data/CamionAdd";
import CamionEdit from "layouts/camions/data/CamionEdit";
import About from "examples/AboutUs/About";

const routes = [
  {
    type: "redirect",
    name: "Home",
    key: "home",
    route: "/",
    component: <SignIn />,
  },
  {
    type: "none",
    name: "Unauthorized",
    key: "unauthorized",
    route: "/unauthorized",
    component: <Unauthorized />,
  },
  {
    type: "redirect",
    name: "about",
    key: "about",
    route: "/about",
    component: <About />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Utilisateurs",
    key: "tables",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Mission",
    key: "mission",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/mission",
    component: <Mission />,
  },
  {
    type: "none",
    name: "Add Mission",
    key: "add-mission",
    route: "/missions/new",
    component: <AddMission />,
  },
  {
    type: "none",
    name: "Edit Mission",
    key: "Edit-Mission",
    route: "/mission/modifier/:id",
    component: <EditMission />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">badge</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "none",
    name: "profile setting",
    key: "profile-details",
    route: "/PlatformSettings/:id",
    component: <PlatformSettings />,
  },
  {
    type: "none",
    name: "Détails Conducteur",
    key: "conducteur-details",
    route: "/conducteurs/:id",
    component: <ConducteurDetails />,
  },
  {
    type: "collapse",
    name: "Camions",
    key: "camions",
    icon: <Icon fontSize="small">local_shipping</Icon>,
    route: "/camions",
    component: <Camions />,
  },
  {
    type: "none",
    name: "addcamion",
    key: "add camions",
    route: "/camions/ajouter",
    component: <CamionAdd />,
  },
  {
    type: "none",
    name: "Edit Camion",
    key: "edit-camion",
    route: "/camions/modifier/:id",
    component: <CamionEdit />,
  },
  {
    type: "none",
    name: "Tracking Camion",
    key: "tracking",
    route: "/camions/tracking/:id",
    component: <TrackingPage />,
  },
  /*{
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },*/
  {
    type: "none",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
