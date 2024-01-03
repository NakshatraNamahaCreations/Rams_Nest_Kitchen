import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screen/Login";
import Customerorder from "./Screen/Customerorder";
import Customerinvoice from "./Screen/Customerinvoice";
import OrderDetails from "./Screen/OrderDetails";

function App() {
  const admin = JSON.parse(sessionStorage.getItem("admin"));

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/customerorder" element={<Customerorder />}></Route>
          <Route
            path="/print-invoice/:id"
            element={<Customerinvoice />}
          ></Route>
          <Route path="/orderdetails/:id" element={<OrderDetails />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
