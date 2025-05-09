import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import typography from "assets/theme/base/typography";

function Footer() {
  const { size } = typography;

  return (
    <MDBox width="100%" display="flex" justifyContent="center" alignItems="center" px={1.5} py={2}>
      <MDBox component="ul" display="flex" alignItems="center" listStyle="none" p={0} m={0}>
        <MDBox component="li" px={2} lineHeight={1}>
          <Link href="https://www.safire.qa" target="_blank" rel="noreferrer">
            <MDTypography variant="button" fontWeight="regular" color="text" fontSize={size.sm}>
              About Us
            </MDTypography>
          </Link>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default Footer;
