import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();
  const [customerOrders, setCustomerOrders] = useState({});
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [allFood, setAllFoods] = useState([]);
  const [data, setdata] = useState([]);
  const apiURL = "https://api.ramsnesthomestay.com/api";
  // const [orderStatus, setOrderStatus] = useState("startCooking");
  // const customerOrders = {};

  useEffect(() => {
    getAllOrderDetails();
    getAllFoods();
    getcustomer();
  }, []);

  const getAllOrderDetails = async () => {
    try {
      const res = await axios.get(
        `https://api.ramsnesthomestay.com/api/orders/getparticularcustomerbookingdetails/${id}`
      );
      if (res.status === 200 && res.data?.particulatUser) {
        setCustomerOrders(res.data.particulatUser);
        console.log("customerOrders", res.data.particulatUser);
        const dishes = res.data.particulatUser.selectedDishes || [];
        // console.log("dishes", dishes);
        const dishesWithTotalPrice = dishes.map((dish) => ({
          ...dish,
          totalPrice: dish.price * dish.count,
        }));
        // console.log("dishesWithTotalPrice", dishesWithTotalPrice);
        setSelectedDishes(dishesWithTotalPrice);
      } else {
        console.error("Invalid response structure:", res.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const getcustomer = async () => {
    try {
      const response = await axios.get(`${apiURL}/orders/getcustomerbooking`);

      if (response.status === 200) {
        console.log("all customers", response.data);
        console.log("id", id);
        setdata(response.data.customerDetails);
      }
    } catch (error) {
      console.warn(error);
      alert("Can't able to fetch ");
      // setdatacondition(true);
      return error;
    }
  };

  const getAllFoods = async () => {
    let res = await axios.get(
      "https://api.ramsnesthomestay.com/api/getallfood"
    );
    if ((res.status = 200)) {
      // console.log("food response", res.data);
      setAllFoods(res.data?.foods);
    }
  };
  // const totalAmount = selectedDishes.reduce(
  //   (acc, items) => acc + parseInt(items.price) * parseInt(items.count),
  //   0
  // );
  const mergedArray = selectedDishes.map((item) => {
    const matchedFood = allFood.find((food) => food.foodname === item.name);

    return {
      name: item.name,
      price: item.price,
      count: item.count,
      _id: item._id,
      totalPrice: item.totalPrice,
      foodimage: matchedFood ? matchedFood.foodimage : null,
    };
  });
  // console.log("mergedArray", mergedArray);

  const startCooking = async () => {
    try {
      const response = await fetch(
        `https://api.ramsnesthomestay.com/api/orders/startcooking/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ foodStatus: "startCooking" }),
        }
      );
      if (response.status === 200) {
        alert("Your Order is being prepared!");
        getAllOrderDetails();
        // window.location.reload();
        // setOrderStatus("readyToServe");
      } else {
        console.error(
          "Error starting cooking"
          // , response.error
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onReadyToServe = async () => {
    try {
      const response = await fetch(
        `https://api.ramsnesthomestay.com/api/orders/readytoserve/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ foodStatus: "readyToServe" }),
        }
      );
      if (response.status === 200) {
        alert("Order Is Ready To Serve!");
        getAllOrderDetails();
        // window.location.reload();
        // setOrderStatus("delivered");
      } else {
        console.error(
          "Error starting cooking"
          // , response.error
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const DeliveredCooking = async () => {
    try {
      const response = await fetch(
        `https://api.ramsnesthomestay.com/api/orders/delivereddish/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ foodStatus: "delivered" }),
        }
      );
      if (response.status === 200) {
        alert("Order Delivered Successfully");
        getAllOrderDetails();
        // window.location.reload();
        // setOrderStatus("deliveredSuccessfully");
      } else {
        console.error(
          "Error starting cooking"
          // , response.error
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredData = data.filter((entry) => entry.selectedDishes.length > 0);

  const findingCustomer = id;
  const findingIndex = filteredData.findIndex(
    (item) => item._id === findingCustomer
  );

  const generatingOrder = () => {
    if (findingIndex != -1) {
      return findingIndex + 1;
    } else {
      return 0;
    }
  };
  const orderID = generatingOrder();

  return (
    <div className="container">
      <div className="mt-5">
        <div className="orderdetails-head">Order Id : #{orderID} </div>
        <div className="customer-order-sde">{customerOrders.guestName} </div>
        <div className="customer-order-sde">{customerOrders.mobileNumber} </div>
        <div className="customer-order-sde">
          Table {customerOrders.selectedTable} - {customerOrders.noOfPerson}{" "}
          Person{" "}
        </div>

        {/* <br /> */}
        <div className="row me-0 mt-2">
          <div
            className="mb-4"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {customerOrders.foodStatus !== "readyToServe" &&
              customerOrders.foodStatus !== "delivered" &&
              customerOrders.foodStatus !== "startCooking" && (
                <div
                  style={{
                    fontSize: "17px",
                    border: "1px solid #fc8019",
                    backgroundColor: "transparent",
                    color: "#fc8019",
                    borderRadius: "6px",
                    padding: "7px 7px",
                    cursor: "pointer",
                  }}
                  onClick={startCooking}
                >
                  <i class="fa-solid fa-flag"></i> Start Cooking
                </div>
              )}

            {customerOrders.foodStatus === "startCooking" && (
              <div
                style={{
                  fontSize: "17px",
                  border: "1px solid #fc8019",
                  backgroundColor: "transparent",
                  color: "#fc8019",
                  borderRadius: "6px",
                  padding: "7px 7px",
                  cursor: "pointer",
                }}
                onClick={onReadyToServe}
              >
                <i class="fa-solid fa-bell-concierge"></i> Make It Ready To
                Serve
              </div>
            )}

            {customerOrders.foodStatus === "readyToServe" && (
              <div
                style={{
                  fontSize: "17px",
                  border: "1px solid #fc8019",
                  backgroundColor: "transparent",
                  color: "#fc8019",
                  borderRadius: "6px",
                  padding: "7px 7px",
                  cursor: "pointer",
                }}
                onClick={DeliveredCooking}
              >
                <i class="fa-solid fa-champagne-glasses"></i> Food Is On
                Delivery
              </div>
            )}
            {customerOrders.foodStatus === "delivered" && (
              <p style={{ color: "green", fontSize: "20px" }}>
                <i class="fa-solid fa-drumstick-bite"></i> Order Delivered
                Successfully!
              </p>
            )}
          </div>
          {mergedArray.map((items, index) => (
            <div className="col-md-4 ">
              <div className="mb-4" key={index}>
                <div class="order-menu">
                  <div
                    class="d-flex mb-2"
                    // style={{ justifyContent: "space-evenly" }}
                  >
                    <div className="d-flex " style={{ justifyContent: "end" }}>
                      <img
                        class="me-2"
                        src={`https://api.ramsnesthomestay.com/food/${items.foodimage}`}
                        alt=""
                      />
                    </div>
                    <div class="order-items mt-2 col-md-4">
                      <h6 class="font-w500 text-nowrap mb-0">
                        <div style={{ fontSize: "18px" }}>{items.name} </div>
                      </h6>
                      <p class="mb-0" style={{ fontSize: "13px" }}>
                        x{items.count}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
