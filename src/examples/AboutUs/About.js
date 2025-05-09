import React from "react";
import Slider from "react-slick";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import images1 from "assets/images/fleet1.jpg";
import images2 from "assets/images/fleet2.jpg";
import images3 from "assets/images/fleet3.jpg";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import PageLayout from "examples/LayoutContainers/PageLayout"; // 👈 new layout here

const images = [images1, images2, images3];

function About() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <PageLayout>
      <Card sx={{ padding: 4 }}>
        <MDTypography variant="h4" fontWeight="medium" textAlign="center" color="info" mb={3}>
          À propos de notre solution
        </MDTypography>

        <MDBox mb={4}>
          <Slider {...sliderSettings}>
            {images.map((src, index) => (
              <MDBox key={index}>
                <img
                  src={src}
                  alt={`slide-${index}`}
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </MDBox>
            ))}
          </Slider>
        </MDBox>

        <MDTypography variant="body1" color="text" textAlign="center" mb={4}>
          Notre solution connectée permet une surveillance intelligente, une traçabilité
          transparente et une maintenance optimisée grâce à l IoT.
        </MDTypography>

        <MDBox mb={4}>
          <MDTypography variant="h5" fontWeight="bold" mb={2}>
            Fonctionnalités
          </MDTypography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <MDTypography variant="h6">📡 Surveillance</MDTypography>
              <MDTypography variant="body2">Capteurs en temps réel</MDTypography>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDTypography variant="h6">🔧 Maintenance</MDTypography>
              <MDTypography variant="body2">Prédiction des pannes</MDTypography>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDTypography variant="h6">📊 Visualisation</MDTypography>
              <MDTypography variant="body2">Interface intuitive</MDTypography>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </PageLayout>
  );
}

export default About;
