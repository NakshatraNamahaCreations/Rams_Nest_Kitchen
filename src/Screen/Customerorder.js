import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import OrdersHeader from "./OrdersHeader";
import moment from "moment";
import "./customerorder.css";
import DataTable from "react-data-table-component";

function Customers() {
  const navigate = useNavigate();
  // const history = useHistory();
  const [data, setdata] = useState([]);
  const [pending, setPending] = useState(true);
  const apiURL = "https://api.ramsnesthomestay.com/api";
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    getcustomer();
  }, []);

  const getcustomer = async () => {
    try {
      const response = await axios.get(`${apiURL}/orders/getcustomerbooking`);

      if (response.status === 200) {
        console.log("all orders", response.data);
        setdata(response.data.customerDetails);
      }
    } catch (error) {
      console.warn(error);
      alert("Can't able  to fetch ");
      // setdatacondition(true);
      return error;
    }
  };

  const navigateToOrderDetailsPage = (id) => {
    navigate(`/orderdetails/${id}`);
    // window.location.assign = "orderdetails/" + id;
  };

  const filteredData = data.filter((entry) => entry.selectedDishes.length > 0);
  console.log("filteredData", filteredData);

  const update = async (data) => {
    axios({
      method: "post",
      url: "https://api.ramsnesthomestay.com/api/updatestatus/" + data._id,
    })
      .then(function (response) {
        //handle success
        alert("food delivered successfulluy");
        console.log(response);
        window.location.reload();
      })
      .catch(function (error) {
        //handle error
        console.log(error.response.data);
      });
  };
  // const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV(data)} />, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setdata(data);
      setPending(false);
    }, 100);
    return () => clearTimeout(timeout);
  }, [filteredData]);

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  const columns = [
    {
      name: "Order Id",
      selector: (row) => `#${row._id.slice(-5)}`,
      sortable: true,
    },
    {
      name: "Guest Name",
      selector: (row) => row.guestName,
      sortable: true,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobileNumber,
      sortable: true,
    },
    {
      name: "Order Date",
      selector: (row) => moment(row.updatedAt).format("lll"),
      sortable: true,
    },
    {
      name: "Table Number",
      selector: (row) => row.selectedTable,
      sortable: true,
    },
    {
      name: "Number Of Guest",
      selector: (row) => row.noOfPerson,
      sortable: true,
    },
    {
      name: "Action",
      sortable: true,
      cell: (row) => (
        <div>
          <Link to={`/orderdetails/${row._id}`}>
            <i
              className="fa-solid fa-eye"
              style={{ color: "#3c8dbc", cursor: "pointer" }}
              title="Order Details"
            ></i>
          </Link>
        </div>
      ),
    },
    {
      name: "Status",
      sortable: true,
      cell: (row) => (
        <div>
          {row.foodStatus === "delivered"
            ? "Order Delivered"
            : row.foodStatus === "startCooking"
            ? "Preparing Orders"
            : row.foodStatus === "readyToServe"
            ? "Ready To Serve"
            : "Order Received"}
        </div>
      ),
    },
  ];

  // const handleRowClicked = (row) => {
  //   // If you want to do something when a row is clicked
  //   // For example, navigate to another page
  //   // history.push(`/orderdetails/${row._id}`);
  //   // navigate(`/orderdetails/${row._id}`);
  //   navigate("/orderdetails");
  // };

  return (
    <div>
      <OrdersHeader />
      <div className="row me-0">
        {/* <div className="col-md-2">
          <Sidebar />
        </div> */}

        <div style={{ padding: "0px 27px 0px 35px" }}>
          <h4 className="text-center mb-3 mt-3">Kitchen Orders</h4>
          <div>
            <DataTable
              columns={columns}
              data={filteredData}
              //  actions={actionsMemo}
              progressPending={pending}
              pagination
              paginationComponentOptions={paginationComponentOptions}
              // onRowClicked={handleRowClicked}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;
