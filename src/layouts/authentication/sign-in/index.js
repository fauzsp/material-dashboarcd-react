/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import {SigninAction} from "components/Samples/index";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import {
  useMaterialUIController,
  setMiniSidenav,
  setUserLoginRequest,
  setWhiteSidenav,
} from "context";



function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [controller, dispatch] = useMaterialUIController();
  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  const { miniSidenav, userAuth } = controller;
  let navigate = useNavigate();



  const emailEntered = (e) => {
    e.target.setCustomValidity("");
    setEmail(e.target.value);
  };
  const passwordEntered = (e) => {
		e.target.setCustomValidity("");
		setPassword(e.target.value);
	};
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleSubmit = () => {
    signin({email, password})
  }
  const signin = (user) => {
   const actionResp = SigninAction(user);
      actionResp.then((resp) => {
      if(resp) {
        setUserLoginRequest(dispatch, resp);
        return navigate("/dashboard")
      }
   }).catch((error) => {
    console.log(error);
    return error;
  });
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ mt: 1, mb: 2 }}
          >
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              >
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
        <pre>{userAuth.first_name} hello</pre>

          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                autoFocus
                value={email}
                required
                placeholder="Enter your email"
                onChange={emailEntered}
                type="email"
                label="Email"
                fullWidth
                onInvalid={(e) =>
                  e.target.setCustomValidity(
                    "Please fill out Email Address field"
                  )
                }
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                value={password}
                placeholder="Enter your password"
                required
                onChange={passwordEntered}
                id="password"
                onInvalid={(e) =>
                  e.target.setCustomValidity("Please fill out Password field")
                }
                type="password"
                label="Password"
                fullWidth
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                onClick={(e) => handleSubmit(e)}
                variant="gradient"
                color="info"
                fullWidth
              >
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
