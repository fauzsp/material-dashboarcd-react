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

import { useState, useEffect, useMemo, Fragment } from "react";

// react-router components
import { Router, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import SignIn from "layouts/authentication/sign-in";
import Dashboard from "layouts/dashboard";
import Basic from "layouts/tables/basic";
import Pro from "layouts/tables/Pro";
import Business from "layouts/tables/business";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import * as common from "./assets/js/helpers/common";
import "./styles.scss";
// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import axios from "axios";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

//Security Encryption
require("./assets/js/security/handle_encryption");
// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setUserLoginRequest, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";


// intercepting request to encrypt request data
axios.interceptors.request.use(function (config) {
	var current_user = common.getCurrentUser();

	if ((config.url.indexOf("https") == -1, config.url.indexOf("http") == -1)) {
		var url = config.url;
		//removing first slash if any
		if (url.indexOf("/") === 0) {
			url = url.substring(1);
		}

		config.url = process.env.REACT_APP_API_URL + "/" + url;

		config.headers.Authorization = "Bearer dummy_token";
		//window.old_user is available temprarily after logout, to make some apis work after logout like end call apis
		config.headers.token = current_user.login_token || (window.old_user ? window.old_user.login_token : "");
		console.log("encryption done");
	}

	return config;
});

//intercepting response
axios.interceptors.response.use(function (response) {

	if (response && response.data.meta && response.data.meta.code == "401") {
		localStorage.clear();
		document.location.reload();
	}

	return response;
});

function routeComponent() {
  return (
      <Fragment>
        <Routes>
          <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path='/dashboard' key="dashboard" element={<Dashboard />}/>
            <Route exact path='/tables/basic-members' key="tables-basic-members" element={<Basic />} />
            <Route exact path='/tables/pro-members' key="tables-pro-members" element={<Pro />} />
            <Route exact path='/tables/business-members' key="tables-business-members" element={<Business />} />
          </Route>
          <Route path="*" element={<Dashboard />} />
          <Route path='/sign-in' element={<SignIn/>} key="sign-in"/>
        </Routes>
      </Fragment>
  )
}
export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const auth = common.getCurrentUser();
  let navigate = useNavigate();
  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {

      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);
  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
          return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });
    useEffect(() => {
    if(auth) {
      setUserLoginRequest(dispatch, auth);
        return navigate("/dashboard")
      }
    }, [])
    
  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Material Dashboard 2"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        {routeComponent()}
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Material Dashboard 2"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      {routeComponent()}
    </ThemeProvider>
  );
}
