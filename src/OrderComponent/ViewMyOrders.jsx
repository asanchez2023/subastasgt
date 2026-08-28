import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { API_BASE_URL } from "../config";

const ViewMyOrders = () => {
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getAllOrders = async () => {
      const allOrders = await retrieveCart();
      if (allOrders) {
        setOrders(allOrders.orders || []);
      }
    };

    getAllOrders();
  }, []);

  const retrieveCart = async () => {
    const jwtToken = sessionStorage.getItem("jwtToken");

    const response = await axios.get(
        `${API_BASE_URL}/api/order/fetch/user-wise?userId=${user.id}`,
        {
          headers: {
            Authorization: "Bearer " + jwtToken,
          },
        }
    );
    return response.data;
  };

  const renderStatusBadge = (status) => {
    const styles = {
      Delivered: "bg-success-subtle text-success border-0",
      Processing: "bg-warning-subtle text-warning-emphasis border-0",
      "On the Way": "bg-primary-subtle text-primary border-0",
      Cancelled: "bg-danger-subtle text-danger border-0",
      Pending: "bg-secondary-subtle text-secondary border-0",
    };

    return (
        <span
            className={`badge rounded-pill fw-semibold px-3 py-1 ${
                styles[status] || "bg-light text-dark"
            }`}
            style={{ fontSize: "0.75rem" }}
        >
        {status || "Pending"}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const productName = (order.product?.name || "").toLowerCase();
    const orderId = (order.orderId || "").toString();
    const sellerName = `${order.product?.seller?.firstName || ""} ${order.product?.seller?.lastName || ""}`.toLowerCase();
    const term = searchTerm.toLowerCase();

    return productName.includes(term) || orderId.includes(term) || sellerName.includes(term);
  });

  return (
      <div className="container-fluid py-4 px-4 bg-light" style={{ minHeight: "100vh" }}>
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">

          {/* Header con Buscador */}
          <div className="card-header bg-white border-bottom py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <h4 className="m-0 fw-bold text-dark fs-5">Mis Órdenes Compradas</h4>

            <div className="d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0" style={{ maxWidth: "320px" }}>
              <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0 border-light-subtle text-muted">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </span>
                <input
                    type="text"
                    className="form-control border-start-0 border-light-subtle shadow-none"
                    placeholder="Buscar por ID u orden..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabla Limpia (6 Columnas) */}
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                <tr className="bg-light text-secondary text-uppercase" style={{ fontSize: "0.72rem", letterSpacing: "0.6px" }}>
                  <th scope="col" className="ps-4 py-3 border-0 font-semibold">Orden</th>
                  <th scope="col" className="py-3 border-0 font-semibold">Producto</th>
                  <th scope="col" className="py-3 border-0 font-semibold">Vendedor</th>
                  <th scope="col" className="text-end py-3 border-0 font-semibold">Monto Pagado</th>
                  <th scope="col" className="text-center py-3 border-0 font-semibold">Estado</th>
                  <th scope="col" className="py-3 border-0 font-semibold pe-4">Detalles de Entrega</th>
                </tr>
                </thead>
                <tbody>
                {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-5">
                        No se encontraron órdenes registradas.
                      </td>
                    </tr>
                ) : (
                    filteredOrders.map((order) => (
                        <tr key={order.orderId} className="border-bottom border-light-subtle">

                          {/* ID de Orden */}
                          <td className="ps-4 py-3 font-monospace fw-bold text-dark" style={{ fontSize: "0.85rem" }}>
                            #{order.orderId}
                          </td>

                          {/* Media Object: Imagen + Nombre + Categoría */}
                          <td className="py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                  className="rounded-3 border bg-white p-1 d-flex align-items-center justify-content-center flex-shrink-0"
                                  style={{ width: "44px", height: "44px" }}
                              >
                                <img
                                    src={`${API_BASE_URL}/api/product/` + order.product?.image1}
                                    alt={order.product?.name}
                                    className="w-100 h-100 object-fit-contain"
                                />
                              </div>
                              <div>
                                <div className="fw-medium text-dark" style={{ fontSize: "0.875rem" }}>
                                  {order.product?.name}
                                </div>
                                <div className="text-muted small">
                                  Cant: <span className="fw-semibold text-dark">{order.quantity}</span> • {order.product?.category?.name}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Vendedor */}
                          <td className="py-3">
                            <div className="fw-medium text-dark" style={{ fontSize: "0.85rem" }}>
                              {order.product?.seller?.firstName} {order.product?.seller?.lastName || ""}
                            </div>
                          </td>

                          {/* Precio Ganador / Monto */}
                          <td className="py-3 text-end font-monospace fw-bold text-dark" style={{ fontSize: "0.875rem" }}>
                            Q{(order.productOffer?.amount || order.product?.price || 0).toLocaleString()}
                          </td>

                          {/* Estado */}
                          <td className="py-3 text-center">
                            {renderStatusBadge(order.status)}
                          </td>

                          {/* Repartidor + Teléfono + Hora de Entrega */}
                          <td className="py-3 pe-4">
                            {order.deliveryPerson ? (
                                <div>
                                  <div className="fw-medium text-dark" style={{ fontSize: "0.85rem" }}>
                                    👤 {order.deliveryPerson.firstName} {order.deliveryPerson.lastName || ""}
                                  </div>
                                  <div className="text-muted small">
                                    📞 {order.deliveryPerson.phoneNo}
                                  </div>
                                  {order.deliveryDate && (
                                      <div className="text-secondary small mt-1" style={{ fontSize: "0.75rem" }}>
                                        🕒 {order.deliveryDate} {order.deliveryTime || ""}
                                      </div>
                                  )}
                                </div>
                            ) : (
                                <span className="text-muted small fst-italic">Pendiente de asignación</span>
                            )}
                          </td>

                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
  );
};

export default ViewMyOrders;
