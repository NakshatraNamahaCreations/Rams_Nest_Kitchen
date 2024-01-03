import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import OrdersHeader from "./OrdersHeader";
import moment from "moment";
import "./customerorder.css";

function Customers() {
  const [data, setdata] = useState([]);
  const { SearchBar, ClearSearchButton } = Search;
  const { ExportCSVButton } = CSVExport;
  const apiURL = "https://api.ramsnesthomestay.com/api";
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
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

  // const allDishes = data.flatMap((entry) => entry.selectedDishes);
  // console.log("allDishes", allDishes);

  // const uniqueDishes = [...new Set(allDishes)];

  // console.log("uniqueDishes", uniqueDishes);

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
  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const options = {
    paginationSize: 4,
    pageStartIndex: 0,

    firstPageText: "First",
    prePageText: "Back",
    nextPageText: "Next",
    lastPageText: "Last",
    nextPageTitle: "First page",
    prePageTitle: "Pre page",
    firstPageTitle: "Next page",
    lastPageTitle: "Last page",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: "5",
        value: 5,
      },
      {
        text: "10",
        value: 10,
      },
      {
        text: "All",
        value: data.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const columns = [
    {
      dataField: "_id",
      text: "Order Id",
      sort: true,
      width: "100px",
    },
    {
      dataField: "guestName",
      text: "Customer name",
      sort: true,
    },
    // {
    //   dataField: "paymentmethod",
    //   text: "Payment Method",
    // },

    {
      dataField: "mobileNumber",
      text: "Mobile Number",
    },
    {
      dataField: "",
      text: "Placed On",
      formatter: (cell, row) => {
        return <span>{moment(row.createdAt).format("lll")}</span>;
      },
    },
    {
      dataField: "selectedTable",
      text: "Table No",
    },
    {
      dataField: "",
      text: "Status",
      formatter: (cell, row) => {
        return (
          <div>
            Pending
            {/* {row.status === "inprocess" ? (
              <p style={{ background: "red", color: "white" }}>{row.status}</p>
            ) : (
              <p style={{ background: "#198754", color: "white" }}>
                {row.status}
              </p>
            )} */}
          </div>
        );
      },
    },
    {
      dataField: "",
      text: "Action",
      formatter: (cell, row) => {
        const navigateToOrderDetails = () => {
          // Use the navigation logic here
          // For example, use react-router-dom's `useNavigate` hook
          navigate(`/orderdetails/${row._id}`);
        };

        return (
          <div>
            <div onClick={navigateToOrderDetails}>
              <i
                title="View"
                style={{ color: "#3c8dbc" }}
                className="fa-solid fa-eye"
              ></i>
            </div>{" "}
            /{" "}
            <Link to="/customerinvoice" state={{ data: row }}>
              <i
                className="fa-solid fa-file-invoice"
                style={{ color: "#3c8dbc" }}
                title="Invoice"
              ></i>
            </Link>
          </div>
        );
      },
    },
    // {
    //   dataField: "",
    //   text: "Action",
    //   formatter: (cell, row) => {
    //     const navigateToOrderDetails = () => {
    //       // Use the navigation logic here
    //       // For example, use react-router-dom's `useNavigate` hook
    //       navigate(`/orderdetails/${row._id}`);
    //     };
    //     return (
    //       <div>
    //         <div>
    //           <i
    //             title="View"
    //             style={{ color: "#3c8dbc" }}
    //             class="fa-solid fa-eye"
    //             onClick={navigateToOrderDetails(row._id)}
    //           >
    //             {" "}
    //           </i>
    //         </div>{" "}
    //         /{" "}
    //         <Link to="/customerinvoice" state={{ data: row }}>
    //           <i
    //             class="fa-solid fa-file-invoice"
    //             style={{ color: "#3c8dbc" }}
    //             title="Invoice"
    //           ></i>
    //         </Link>
    //         {/* <button
    //           data-bs-toggle="modal"
    //           data-bs-target="#exampleModal"
    //           class="btn btn-secondary"
    //           style={{ marginTop: "5px" }}
    //         >
    //           Update
    //         </button> */}
    //         <div
    //           class="modal fade"
    //           id="exampleModal"
    //           tabindex="-1"
    //           aria-labelledby="exampleModalLabel"
    //           aria-hidden="true"
    //         >
    //           <div class="modal-dialog">
    //             <div class="modal-content">
    //               <div class="modal-header">
    //                 <h5 class="modal-title" id="exampleModalLabel">
    //                   Food delivered
    //                 </h5>
    //                 <button
    //                   type="button"
    //                   class="btn-close"
    //                   data-bs-dismiss="modal"
    //                   aria-label="Close"
    //                 ></button>
    //               </div>
    //               <div class="modal-body">Food is delivered</div>
    //               <div class="modal-footer">
    //                 <button
    //                   type="button"
    //                   class="btn btn-secondary"
    //                   data-bs-dismiss="modal"
    //                 >
    //                   No
    //                 </button>
    //                 <button
    //                   type="button"
    //                   class="btn btn-primary"
    //                   onClick={() => update(row)}
    //                 >
    //                   Yes{" "}
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   },
    // },
  ];

  return (
    <div>
      <OrdersHeader />
      <div className="row me-0">
        {/* <div className="col-md-2">
          <Sidebar />
        </div> */}

        <div style={{ padding: "0px 27px 0px 35px" }}>
          <h4>Order List</h4>
          <ToolkitProvider
            keyField="id"
            data={filteredData}
            columns={columns}
            search
            exportCSV={{
              fileName: "customerorder.csv",
              blobType: "text/csv;charset=ansi",
            }}
          >
            {(props) => (
              <div>
                <span className="pr-5 mr-auto">
                  <ExportCSVButton
                    className="btn-outline-success"
                    {...props.csvProps}
                  >
                    Download
                  </ExportCSVButton>
                </span>
                <span className="pl-5 ms-3 me-5 mt-5">
                  <SearchBar className="form-control " {...props.searchProps} />
                </span>
                <ClearSearchButton
                  className="btn-outline-info"
                  {...props.searchProps}
                />
                <br />
                <br />
                {/* <hr /> */}
                <div>
                  <BootstrapTable
                    keyField="customer"
                    responsive
                    hover
                    columns={columns}
                    data={data}
                    pagination={paginationFactory(options)}
                    {...props.baseProps}
                  />
                </div>
              </div>
            )}
          </ToolkitProvider>
        </div>
      </div>
    </div>
  );
}

export default Customers;
