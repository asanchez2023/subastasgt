import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

const ViewAllOrders = () => {
  const [orders, setOrders] = useState([]);

  const [orderId, setOrderId] = useState("");
  const [tempOrderId, setTempOrderId] = useState("");

  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");

  useEffect(() => {
    const getAllOrders = async () => {
      let allOrders;
      if (orderId) {
        allOrders = await retrieveOrdersById();
      } else {
        allOrders = await retrieveAllorders();
      }

      if (allOrders) {
        setOrders(allOrders.orders);
      }
    };

    getAllOrders();
  }, [orderId]);

  const retrieveAllorders = async () => {
    const response = await axios.get(
      "http://54.90.239.187:8080/api/order/fetch/all",
      {
        headers: {
          Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
        },
      }
    );
    console.log(response.data);
    return response.data;
  };

  const retrieveOrdersById = async () => {
    const response = await axios.get(
      "http://54.90.239.187:8080/api/order/fetch?orderId=" + orderId
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  const searchOrderById = (e) => {
    e.preventDefault();
    setOrderId(tempOrderId);
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 custom-bg shadow-lg"
        style={{
          height: "40rem",
        }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{
            borderRadius: "1em",
            height: "50px",
          }}
        >
          <h2>Todas las Ordenes</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <form class="row g-3">
            <div class="col-auto">
              <input
                type="text"
                class="form-control"
                id="inputPassword2"
                placeholder="Ingrese ID de Orden..."
                onChange={(e) => setTempOrderId(e.target.value)}
                value={tempOrderId}
              />
            </div>
            <div class="col-auto">
              <button
                type="submit"
                class="btn bg-color custom-bg-text mb-3"
                onClick={searchOrderById}
              >
                Buscar
              </button>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">ID de Orden</th>
                  <th scope="col">Producto</th>
                  <th scope="col">Nombre de Producto</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Vendedor</th>
                  <th scope="col">Precio de Venta</th>
                  <th scope="col">Precio Ganador</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Cliente</th>

                  <th scope="col">Estado de Orden</th>
                  <th scope="col">Repartidor</th>
                  <th scope="col">Contacto de Repartidor</th>
                  <th scope="col">Tiempo de Entrega</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  return (
                    <tr>
                      <td>
                        <b>{order.orderId}</b>
                      </td>
                      <td>
                        <img
                          src={
                            "http://54.90.239.187:8080/api/product/" +
                            order.product.image1
                          }
                          class="img-fluid"
                          alt="product_pic"
                          style={{
                            maxWidth: "90px",
                          }}
                        />
                      </td>
                      <td>
                        <b>{order.product.name}</b>
                      </td>
                      <td>
                        <b>{order.product.category.name}</b>
                      </td>
                      <td>
                        <b>{order.product.seller.firstName}</b>
                      </td>
                      <td>
                        <b>{order.product.price}</b>
                      </td>
                      <td>
                        <b>{order.productOffer.amount}</b>
                      </td>
                      <td>
                        <b>{order.quantity}</b>
                      </td>
                      <td>
                        <b>{order.user.firstName}</b>
                      </td>
                      <td>
                        <b>{order.status}</b>
                      </td>
                      <td>
                        {(() => {
                          if (order.deliveryPerson) {
                            return <b>{order.deliveryPerson.firstName}</b>;
                          } else {
                            return <b className="text-danger">Pending</b>;
                          }
                        })()}
                      </td>
                      <td>
                        {(() => {
                          if (order.deliveryPerson) {
                            return <b>{order.deliveryPerson.phoneNo}</b>;
                          } else {
                            return <b className="text-danger">Pending</b>;
                          }
                        })()}
                      </td>
                      <td>
                        {(() => {
                          if (order.deliveryDate) {
                            return (
                              <b>
                                {order.deliveryDate + " " + order.deliveryTime}
                              </b>
                            );
                          } else {
                            return <b className="text-danger">Pending</b>;
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

export default ViewAllOrders;
