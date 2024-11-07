import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const MyBids = () => {
  let navigate = useNavigate();
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const [myOffers, setMyOffers] = useState([]);

  useEffect(() => {
    const getMyOffers = async () => {
      const offers = await retrieveMyOffers();
      if (offers) {
        setMyOffers(offers.offers);
      }
    };

    getMyOffers();
  }, []);

  const retrieveMyOffers = async () => {
    const response = await axios.get(
      "http://3.234.108.139:8080/api/product/offer/fetch/user?userId=" + user.id
    );
    console.log(response.data);
    return response.data;
  };

  const deleteProductOffer = (offerId, e) => {
    fetch("http://3.234.108.139:8080/api/product/offer/id?offerId=" + offerId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + customer_jwtToken,
      },
    }).then((result) => {
      result.json().then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, {
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
          }, 2000); // Redirect after 3 seconds
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
          }, 2000); // Redirect after 3 seconds
        } else {
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
          }, 2000); // Redirect after 3 seconds
        }
      });
    });
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 custom-bg border-color"
        style={{
          height: "45rem",
        }}
      >
        <div
          className="card-header text-center bg-color custom-bg-text"
          style={{
            borderRadius: "1em",
            height: "50px",
          }}
        >
          <h2>Mis Ofertas</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="table-responsive">
            <table className="table table-hover custom-bg-text text-center">
              <thead className="bg-color table-bordered border-color">
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Seller</th>
                  <th scope="col">Precio de Venta</th>

                  <th scope="col">Monto de Oferta</th>
                  <th scope="col">Fecha de Oferta</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody className="text-color">
                {myOffers.map((myOffer) => {
                  return (
                    <tr>
                      <td>
                        <img
                          src={
                            "http://3.234.108.139:8080/api/product/" +
                            myOffer.product.image1
                          }
                          class="img-fluid"
                          alt="product_pic"
                          style={{
                            maxWidth: "90px",
                          }}
                        />
                      </td>
                      <td>
                        <b>{myOffer.product.name}</b>
                      </td>
                      <td>
                        <b>
                          {myOffer.product.seller.firstName +
                            " " +
                            myOffer.product.seller.lastName}
                        </b>
                      </td>
                      <td>
                        <b>{myOffer.product.price}</b>
                      </td>
                      <td>
                        <b>{myOffer.amount}</b>
                      </td>
                      <td>
                        <b>{formatDateFromEpoch(myOffer.dateTime)}</b>
                      </td>
                      <td>
                        <b>{myOffer.status}</b>
                      </td>
                      <td>
                        {(() => {
                          if (myOffer.status === "Active") {
                            return (
                              <button
                                className="btn bg-color custom-bg-text btn-sm"
                                onClick={() => deleteProductOffer(myOffer.id)}
                              >
                                Cancelar Oferta
                              </button>
                            );
                          }
                        })()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBids;
