import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const PaypalResponse = () => {
  let navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const paymentId = params.get("paymentId");
  const PayerID = params.get("PayerID");
  const token = params.get("token");

  console.log(paymentId);
  console.log(PayerID);
  console.log(token);

  useEffect(() => {
    fetch("http://localhost:8080/api/user/execute/payment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId: paymentId,
        payerId: PayerID,
        token: token,
      }),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              navigate("/customer/wallet");
            }, 1000); // Redirect after 3 seconds
          } else if (!res.success) {
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setTimeout(() => {
              navigate("/customer/wallet");
            }, 1000); // Redirect after 3 seconds
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error en el servidor", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/customer/wallet");
        }, 1000); // Redirect after 3 seconds
      });
  }, []);

  return (
    <div>
      <div className="mt-2 mb-4 d-flex aligns-items-center justify-content-center">
        <div className="text-success">Payment Processing........</div>
      </div>
    </div>
  );
};

export default PaypalResponse;
