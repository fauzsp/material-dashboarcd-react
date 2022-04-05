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

// @mui material components
import {useState, useMemo, useEffect} from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FilteredComponent from 'components/FilteredComponent';
import {
  useMaterialUIController,
  setMiniSidenav,
  setUserLoginRequest,
  setWhiteSidenav,
} from "context";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { UserTableData } from 'components/Samples';

import Footer from "examples/Footer";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import DataTable from 'react-data-table-component';

function Business() {
  const [tableData, setTableData] = useState([]);
  const [count, setCount] = useState(0);
  const [controller, dispatch] = useMaterialUIController();
  const { userAuth } = controller;
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const handleButtonClick = (id) => {
    tableData.forEach((data) => {
      if(data.id === id.id) {
        data.disable = !data.disable;
      }
      return data;
    })
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
    setTableData(tableData)
    setCount((count) => count + 1)
        Swal.fire(
          'Disabled',
          'The User has been deleted.',
          'success'
        )
      }
    })
	};
  const paginationComponentOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
};
  const columns =  [
    {
        name: 'Title',
        selector: row => row.user.first_name,
    },
    {
        name: 'Email',
        selector: row => row.user.email,
    },
    {
      name: 'Status',
      selector: row => row.status,
  },
    {
      name: 'Action',
      cell: (data) => <button onClick={() => handleButtonClick(data)}>{data.disable == true ? "Disable" : "Enable"}</button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
];

 
useEffect(() => {
  setTableData(tableData)
}, [count])
useEffect(() => {
  const token = userAuth.login_token;
  const actionResp = UserTableData(token, 3);
  actionResp.then((resp) => {
    const data = resp.data.data;
    setTableData(data)
    console.log(data)
  }).catch((error) => {
    console.log(error)
    return error;
  })
}, [])
const filteredItems = tableData.filter(
  item =>
    JSON.stringify(item)
      .toLowerCase()
      .indexOf(filterText.toLowerCase()) !== -1
);
const subHeaderComponent = useMemo(() => {
  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
  };

  return (
    <FilteredComponent
      onFilter={e => setFilterText(e.target.value)}
      onClear={handleClear}
      filterText={filterText}
    />
  );
}, [filterText, resetPaginationToggle]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Business Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
              <DataTable
              title="Business members data"
            columns={columns}
            data={filteredItems}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            subHeader
            subHeaderComponent={subHeaderComponent}
        />
              </MDBox>
            </Card>
          </Grid>
          {/* <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Projects Table 123
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> */}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Business;
