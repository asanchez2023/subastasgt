import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../config";

const ViewSellerOrders = () => {
  const seller = JSON.parse(sessionStorage.getItem("active-customer"));
  const seller_jwtToken = sessionStorage.getItem("jwtToken");

  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [tempOrderId, setTempOrderId] = useState("");

  const [assignOrderId, setAssignOrderId] = useState("");
  const [deliveryPersonId, setDeliveryPersonId] = useState("");
  const [allDelivery, setAllDelivery] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const getAllOrders = async () => {
      let allOrders;
      if (orderId) {
        allOrders = await retrieveOrdersById();
      } else {
        allOrders = await retrieveAllorders();
      }

      if (allOrders) {
        setOrders(allOrders.orders || []);
      }
    };

    const getAllUsers = async () => {
      const allUsers = await retrieveAllUser();
      if (allUsers) {
        setAllDelivery(allUsers.users || []);
      }
    };

    getAllOrders();
    getAllUsers();
  }, [orderId]);

  const retrieveAllorders = async () => {
    const jwtToken = sessionStorage.getItem("jwtToken");
    const response = await axios.get(
        `${API_BASE_URL}/api/order/fetch/seller-wise?sellerId=${seller.id}`,
        {
          headers: {
            Authorization: "Bearer " + jwtToken,
          },
        }
    );
    return response.data;
  };

  const retrieveAllUser = async () => {
    const jwtToken = sessionStorage.getItem("jwtToken");
    const response = await axios.get(
        `${API_BASE_URL}/api/user/fetch/seller/delivery-person?sellerId=${seller.id}`,
        {
          headers: {
            Authorization: "Bearer " + jwtToken,
          },
        }
    );
    return response.data;
  };

  const retrieveOrdersById = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/api/order/fetch?orderId=${orderId}`
    );
    return response.data;
  };

  const searchOrderById = (e) => {
    e.preventDefault();
    setOrderId(tempOrderId);
  };

  const assignDelivery = (orderId) => {
    setAssignOrderId(orderId);
    handleShow();
  };

  const assignToDelivery = (e) => {
    e.preventDefault();
    if (!deliveryPersonId) {
      toast.error("Seleccione un repartidor", { position: "top-center" });
      return;
    }

    let data = {
      orderId: assignOrderId,
      deliveryId: parseInt(deliveryPersonId, 10),
    };

    fetch(`${API_BASE_URL}/api/order/assign/delivery-person`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + seller_jwtToken,
      },
      body: JSON.stringify(data),
    })
        .then((result) => {
          result.json().then((res) => {
            if (res.success) {
              toast.success(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
              });
              handleClose();
              setTimeout(() => {
                window.location.reload(true);
              }, 1000);
            } else {
              toast.error(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
              });
            }
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error en el servidor", { position: "top-center", autoClose: 1000 });
        });
  };

  const renderStatusBadge = (status) => {
    const styles = {
      Delivered: "bg-success-subtle text-success",
      Processing: "bg-warning-subtle text-warning-emphasis",
      "On the Way": "bg-primary-subtle text-primary",
      Cancelled: "bg-danger-subtle text-danger",
    };

    return (
        <span
            className={`badge rounded-pill fw-semibold px-3 py-1 border-0 ${
                styles[status] || "bg-secondary-subtle text-secondary"
            }`}
            style={{ fontSize: "0.75rem" }}
        >
        {status || "Pending"}
      </span>
    );
  };

  return (
      <div className="container-fluid py-4 px-4 bg-light" style={{ minHeight: "100vh" }}>
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">

          {/* Header con título y buscador por ID */}
          <div className="card-header bg-white border-bottom py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <h4 className="m-0 fw-bold text-dark fs-5">Ventas y Pedidos</h4>

            <form className="d-flex align-items-center gap-2" onSubmit={searchOrderById}>
              <div className="input-group input-group-sm" style={{ width: "240px" }}>
              <span className="input-group-text bg-white border-end-0 border-light-subtle text-muted">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </span>
                <input
                    type="text"
                    className="form-control border-start-0 border-light-subtle shadow-none"
                    placeholder="Buscar por ID de Orden..."
                    onChange={(e) => setTempOrderId(e.target.value)}
                    value={tempOrderId}
                />
              </div>
              <button type="submit" className="btn btn-sm btn-dark px-3">
                Buscar
              </button>
              {orderId && (
                  <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setOrderId("");
                        setTempOrderId("");
                      }}
                  >
                    Limpiar
                  </button>
              )}
            </form>
          </div>

          {/* Tabla Reducida de 7 Columnas */}
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                <tr className="bg-light text-secondary text-uppercase" style={{ fontSize: "0.72rem", letterSpacing: "0.6px" }}>
                  <th scope="col" className="ps-4 py-3 border-0 font-semibold">Orden</th>
                  <th scope="col" className="py-3 border-0 font-semibold">Producto</th>
                  <th scope="col" className="py-3 border-0 font-semibold">Cliente</th>
                  <th scope="col" className="text-end py-3 border-0 font-semibold">Monto</th>
                  <th scope="col" className="text-center py-3 border-0 font-semibold">Estado</th>
                  <th scope="col" className="py-3 border-0 font-semibold">Repartidor / Entrega</th>
                  <th scope="col" className="text-end pe-4 py-3 border-0 font-semibold">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-5">
                        No se encontraron registros de ventas.
                      </td>
                    </tr>
                ) : (
                    orders.map((order) => (
                        <tr key={order.orderId} className="border-bottom border-light-subtle">

                          {/* ID de Orden */}
                          <td className="ps-4 py-3 font-monospace fw-bold text-dark" style={{ fontSize: "0.85rem" }}>
                            #{order.orderId}
                          </td>

                          {/* Media Object (Imagen + Nombre + Categoría) */}
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

                          {/* Cliente */}
                          <td className="py-3">
                            <div className="fw-medium text-dark" style={{ fontSize: "0.875rem" }}>
                              {order.user?.firstName} {order.user?.lastName || ""}
                            </div>
                            <div className="text-muted small">{order.user?.emailId || ""}</div>
                          </td>

                          {/* Monto Final */}
                          <td className="py-3 text-end font-monospace fw-bold text-dark" style={{ fontSize: "0.875rem" }}>
                            Q{(order.productOffer?.amount || order.product?.price || 0).toLocaleString()}
                          </td>

                          {/* Estado */}
                          <td className="py-3 text-center">
                            {renderStatusBadge(order.status)}
                          </td>

                          {/* Repartidor + Fecha / Horario */}
                          <td className="py-3">
                            {order.deliveryPerson ? (
                                <div>
                                  <div className="fw-medium text-dark" style={{ fontSize: "0.85rem" }}>
                                    {order.deliveryPerson.firstName} {order.deliveryPerson.lastName || ""}
                                  </div>
                                  <div className="text-muted small">
                                    {order.deliveryPerson.phoneNo}
                                  </div>
                                  {order.deliveryDate && (
                                      <div className="text-secondary small mt-1" style={{ fontSize: "0.75rem" }}>
                                        🕒 {order.deliveryDate} {order.deliveryTime || ""}
                                      </div>
                                  )}
                                </div>
                            ) : (
                                <span className="text-muted small fst-italic">Sin repartidor</span>
                            )}
                          </td>

                          {/* Acciones */}
                          <td className="py-3 text-end pe-4">
                            {!order.deliveryPerson ? (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary fw-medium"
                                    onClick={() => assignDelivery(order.orderId)}
                                    style={{ fontSize: "0.8rem" }}
                                >
                                  Asignar Repartidor
                                </button>
                            ) : (
                                <span className="badge bg-light text-secondary border font-weight-normal px-2 py-1">
                            Asignado
                          </span>
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

        {/* Modal de Asignación Rediseñado */}
        <Modal show={showModal} onHide={handleClose} centered borderless>
          <Modal.Header closeButton className="border-bottom-0 pb-0">
            <Modal.Title className="fs-5 fw-bold text-dark">
              Asignar Repartidor
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-3">
            <div className="mb-3">
              <label className="form-label small text-muted fw-semibold">ID de Orden</label>
              <input type="text" className="form-control bg-light border-0 fw-bold font-monospace" value={`#${assignOrderId}`} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label small text-muted fw-semibold">Seleccionar Repartidor</label>
              <select
                  name="deliveryPersonId"
                  onChange={(e) => setDeliveryPersonId(e.target.value)}
                  className="form-select border-light-subtle shadow-none"
              >
                <option value="">Seleccione un repartidor...</option>
                {allDelivery.map((delivery) => (
                    <option key={delivery.id} value={delivery.id}>
                      {delivery.firstName} {delivery.lastName} ({delivery.phoneNo})
                    </option>
                ))}
              </select>
            </div>
            <ToastContainer />
          </Modal.Body>
          <Modal.Footer className="border-top-0 pt-0">
            <Button variant="light" onClick={handleClose} className="btn-sm px-3">
              Cancelar
            </Button>
            <Button variant="primary" onClick={assignToDelivery} className="btn-sm px-3">
              Confirmar Asignación
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
};

export default ViewSellerOrders;
