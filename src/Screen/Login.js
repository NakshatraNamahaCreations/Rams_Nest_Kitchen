import axios from "axios";
import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";

import Modal from "react-bootstrap/Modal";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const signup = async (e) => {
    e.preventDefault();
    if (!email || !password || !cpassword) {
      alert("Please enter the email and password");
    } else if (password !== cpassword) {
      alert("password doesn't match");
    } else {
      try {
        const config = {
          url: "https://api.ramsnesthomestay.com/api/adminsignup",
          method: "post",
          headers: { "content-type": "application/json" },
          data: {
            email: email,
            password: password,
            cpassword: cpassword,
          },
        };
        await axios(config).then(function (response) {
          if (response.status === 200) {
            alert("Account created successful");
            window.location.assign("/customerorder");
          }
        });
      } catch (error) {
        console.log(error.response);
        if (error.response) {
          alert(error.response.data.error);
        }
      }
    }
  };

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("please enter the email and password");
    } else {
      try {
        const config = {
          url: "https://api.ramsnesthomestay.com/api/adminsignin",
          method: "POST",
          headers: { "content-type": "application/json" },
          data: {
            email: email,
            password: password,
          },
        };
        let res = await axios(config);
        console.log(res.data);
        if (res.status === 200) {
          alert("Login successful");
          window.location.assign("/customerorder");
          sessionStorage.setItem("admin", JSON.stringify(res.data.admin));
          return res;
        } else {
          alert("Email or Mobile Already Exist");
          alert(res.data.error);
        }
      } catch (error) {
        console.log(error.response);
        if (error.response) {
          alert(error.response.data.error);
        }
      }
    }
  };

  return (
    <div>
      <div className="loginform">
        <div className="d-lg-flex justify-content-lg-around">
          <card
            style={{
              border: "1px solid lightgray",
              padding: "30px",
              background: "aliceblue",
              borderRadius: "10px",
            }}
          >
            <div className="center">
              <img src="logo.png" width="100px" />
              <h4>Admin Login</h4>
            </div>
            <form>
              <div className="adlogin">
                <label>Email</label>
                <input
                  type="email"
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>
              <div className="adlogin">
                <label>Password</label>
                <input
                  type="password"
                  onChange={(e) => setpassword(e.target.value)}
                />
              </div>

              <Button
                onClick={login}
                style={{ width: "100%", marginTop: "30px" }}
              >
                Login
              </Button>
              {/* <div className="pointer" style={{ textAlign: "center" }}>
                <p onClick={handleShow}>
                  <b>Sign up</b>
                </p>
              </div> */}

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Admin Sign up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="adlogin">
                    <label>Email</label>
                    <input
                      type="email"
                      onChange={(e) => setemail(e.target.value)}
                    />
                  </div>
                  <div className="adlogin">
                    <label>Create Password</label>
                    <input
                      type="password"
                      onChange={(e) => setpassword(e.target.value)}
                    />
                  </div>
                  <div className="adlogin">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      onChange={(e) => setcpassword(e.target.value)}
                    />
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={signup}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </form>
          </card>
        </div>
      </div>
    </div>
  );
}

export default Login;
