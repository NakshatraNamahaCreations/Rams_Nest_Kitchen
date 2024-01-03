import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();
  const [customerOrders, setCustomerOrders] = useState({});
  const [selectedDishes, setSelectedDishes] = useState([]);
  // const customerOrders = {};

  useEffect(() => {
    getAllOrderDetails();
  }, []);

  const getAllOrderDetails = async () => {
    try {
      const res = await axios.get(
        `https://api.ramsnesthomestay.com/api/orders/getparticularcustomerbookingdetails/${id}`
      );
      if (res.status === 200 && res.data?.particulatUser) {
        setCustomerOrders(res.data.particulatUser);
        const dishes = res.data.particulatUser.selectedDishes || [];
        console.log("dishes", dishes);
        setSelectedDishes(dishes);
      } else {
        console.error("Invalid response structure:", res.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  return (
    <div className="container">
      <div className="mt-5">
        <h5 className="orderdetails-head">Order Id : #{id.slice(-5)} </h5>
        <br />
        <div className="row">
          {selectedDishes.map((items, index) => (
            <div className="col-md-3 col-12 mt-3">
              <div class="card-body-roder px-3">
                <div class="text-center">
                  <h4 style={{ fontSize: "18px" }}>Dish #{index + 1} </h4>
                  <p>Nov 11, 2022 , 18:38 PM</p>
                </div>
                <hr />
                <div class="order-menu">
                  <h6 class="font-w600">Order Menu</h6>
                  <div class="d-flex align-items-center mb-2">
                    <img class="me-2" src="/pic-1.jpg" alt="" />
                    <div class="order-items">
                      <h6 class="font-w500 text-nowrap mb-0">
                        <div style={{ fontSize: "13px" }}>{items.name} </div>
                      </h6>
                      <p class="mb-0" style={{ fontSize: "13px" }}>
                        x{items.count}
                      </p>
                      <h6 class="" style={{ fontSize: "13px" }}>
                        {items.price.toFixed(2)}
                      </h6>
                    </div>
                  </div>

                  <hr />
                  <div class="d-flex align-items-center justify-content-between mb-4">
                    <h4 class="mb-0">Total</h4>
                    <h4 class="mb-0 text-primary">$202.00</h4>
                  </div>
                  <a
                    href="javascript:void(0);"
                    class="btn btn-outline-success bgl-success btn-block"
                  >
                    Completed
                  </a>
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
