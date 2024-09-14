import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const MyWallet = () => {
  let navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");
  const [walletAmount, setWalletAmount] = useState(user.walletAmount);

  const [walletRequest, setWalletRequest] = useState({
    id: user.id,
    wallet: "",
  });

  const [fetchUserWallet, setFetchUserWallet] = useState({});

  walletRequest.userId = user.id;

  const handleInput = (e) => {
    setWalletRequest({ ...walletRequest, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const getMyWallet = async () => {
      const userResponse = await retrieveMyWallet();
      if (userResponse) {
        setFetchUserWallet(userResponse.users[0]);
        setWalletAmount(userResponse.users[0].walletAmount);
      }
    };

    getMyWallet();
  }, []);

  const retrieveMyWallet = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/user-id?userId=" + user.id
    );

    return response.data;
  };

  const addMoneyInWallet = (e) => {
    fetch("http://localhost:8080/api/user/authorize/payment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(walletRequest),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            let redirect = res.redirectTo;

            // Redirect the user to the specified URL
            window.location.href = redirect;
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
              window.location.reload(true);
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
          window.location.reload(true);
        }, 1000); // Redirect after 3 seconds
      });
    e.preventDefault();
  };

  return (
    <div>
      <div className="mt-2 mb-4 d-flex aligns-items-center justify-content-center">
        {(() => {
          if (document.URL.indexOf("cancel") != -1) {
            toast.error("Wallet Update Cancel!!!", {
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
            }, 5000); // Redirect after 3 seconds
          }
        })()}

        <div className="card form-card custom-bg" style={{ width: "25rem" }}>
          <div
            className="card-header bg-color text-center custom-bg-text mb-3"
            style={{
              borderRadius: "1em",
              height: "50px",
            }}
          >
            <h3>Mi Billetera</h3>
          </div>
          <h4 className="ms-3 text-color text-center">
            Saldo: Q{walletAmount}
          </h4>

          <hr />

          <div
            className="card-header bg-color text-center custom-bg-text"
            style={{
              borderRadius: "1em",
              height: "50px",
            }}
          >
            <h4 className="card-title">Añadir Dinero a Billetera</h4>
          </div>
          <div className="card-body">
            <form>
              <div className="mb-3 text-color">
                <label for="emailId" class="form-label">
                  <b>Monto</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="walletAmount"
                  onChange={handleInput}
                  value={walletRequest.walletAmount}
                  required
                />
              </div>
              <div className="d-flex aligns-items-center justify-content-center mb-2">
                <button
                  type="submit"
                  className="btn bg-color custom-bg-text"
                  onClick={addMoneyInWallet}
                >
                  Añadir
                </button>
                <ToastContainer />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWallet;
