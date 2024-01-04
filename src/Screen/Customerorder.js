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
  const [searchName, setSearchName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    getcustomer();
  }, []);

  const getcustomer = async () => {
    try {
      const response = await axios.get(`${apiURL}/orders/getcustomerbooking`);

      if (response.status === 200) {
        console.log("all orders", response.data);
        setdata(response.data.customerDetails.reverse());
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

  const filteredData = data.filter((entry) => entry.selectedDishes.length > 0);
  console.log("filteredData", filteredData);

  const generatingOrder = (row) => {
    const findingCustomer = row._id;
    const findingIndex = filteredData.findIndex(
      (item) => item._id === findingCustomer
    );
    const orderId = filteredData.length - findingIndex;
    return `#${orderId} `;
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setdata(data);
      setPending(false);
    }, 100);
    return () => clearTimeout(timeout);
  }, [filteredData]);

  const paginationComponentOptions = {
    rowsPerPageText: "Rows per page",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    // selectAllRowsItemText: "",
  };

  const columns = [
    {
      name: "Sr.No",
      selector: (index, row) => row + 1,
      sortable: true,
    },
    {
      name: "Order Id",
      selector: (row) => generatingOrder(row),
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
      name: "Status",
      sortable: true,
      cell: (row) => (
        <div>
          {row.foodStatus === "delivered" ? (
            <div style={{ color: "green", fontWeight: 600 }}>
              Order Delivered
            </div>
          ) : row.foodStatus === "startCooking" ? (
            <div style={{ color: "#ffc107", fontWeight: 600 }}>
              Preparing Orders
            </div>
          ) : row.foodStatus === "readyToServe" ? (
            <div style={{ color: "#0d6efd", fontWeight: 600 }}>
              Ready To Serve
            </div>
          ) : (
            <div style={{ color: "#d63384", fontWeight: 600 }}>
              Order Received
            </div>
          )}
        </div>
      ),
    },
    {
      name: "View Dishes",
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
  ];
  // search by name filter function input
  useEffect(() => {
    // Filter data based on the searchName and selectedStatus
    const updatedFilteredData = data.filter(
      (entry) =>
        entry.selectedDishes.length > 0 &&
        entry.guestName.toLowerCase().includes(searchName.toLowerCase()) &&
        (selectedStatus === "" || entry.foodStatus === selectedStatus)
    );
    setSearchResults(updatedFilteredData);
  }, [searchName, selectedStatus, data]);

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const statusOptions = [
    { label: "All", value: "" },
    // { label: "Order Received", value: "received" },
    { label: "Preparing Orders", value: "startCooking" },
    { label: "Ready To Serve", value: "readyToServe" },
    { label: "Order Delivered", value: "delivered" },
  ];

  // sort by dorpdow
  const currentDate = new Date();
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
          <div className="d-flex" style={{ justifyContent: "right" }}>
            <h6> {moment(currentDate).format("MMMM Do YYYY")}</h6>
          </div>
          <h4 className="text-center mb-3 mt-3">Kitchen Orders</h4>
          <div
            className="d-flex"
            style={{ justifyContent: "flex-end", alignItems: "center" }}
          >
            {/* <p>Sort by </p> */}
            <select
              className="px-2 py-2"
              style={{
                border: "1px solid #0000006e",
                borderRadius: "5px",
              }}
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              className="ms-2 px-2 py-2"
              placeholder="Search by guest name"
              style={{
                border: "1px solid #0000006e",
                borderRadius: "5px",
                width: "25%",
              }}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>{" "}
          <br />
          <div>
            <DataTable
              columns={columns}
              data={searchResults}
              progressPending={pending}
              pagination
              paginationComponentOptions={paginationComponentOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;
