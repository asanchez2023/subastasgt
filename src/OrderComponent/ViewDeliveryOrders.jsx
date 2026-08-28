import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../config";

const ViewDeliveryOrders = () => {
  const deliveryPerson = JSON.parse(sessionStorage.getItem("active-delivery"));
  const [orders, setOrders] = useState([]);

  const delivery_jwtToken = sessionStorage.getItem("jwtToken");

  const [deliveryUpdateRequest, setDeliveryUpdateRequest] = useState({
    orderId: "",
    deliveryStatus: "",
    deliveryTime: "",
    deliveryDate: "",
    deliveryId: deliveryPerson?.id || "",
  });

  const [deliveryStatus, setDeliveryStatus] = useState([]);
  const [deliveryTime, setDeliveryTime] = useState([]);

  const handleInput = (e) => {
    setDeliveryUpdateRequest({
      ...deliveryUpdateRequest,
      [e.target.name]: e.target.value,
    });
  };

  const [orderId, setOrderId] = useState("");
  const [tempOrderId, setTempOrderId] = useState("");
  const [assignOrderId, setAssignOrderId] = useState("");

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    if (!deliveryPerson) return;

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

    const getAllDeliveryStatus = async () => {
      let allStatus = await retrieveAllDeliveryStatus();
      if (allStatus) {
        setDeliveryStatus(allStatus);
      }
    };

    const getAllDeliveryTiming = async () => {
      let allTiming = await retrieveAllDeliveryTiming();
      if (allTiming) {
        setDeliveryTime(allTiming);
      }
    };

    getAllOrders();
    getAllDeliveryStatus();
    getAllDeliveryTiming();
  }, [orderId]);

  const retrieveAllorders = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/api/order/fetch/delivery-wise?deliveryPersonId=` +
        deliveryPerson.id,
        {
          headers: {
            Authorization: "Bearer " + delivery_jwtToken,
          },
        }
    );
    return response.data;
  };

  const retrieveAllDeliveryStatus = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/api/order/fetch/delivery-status/all`
    );
    return response.data;
  };

  const retrieveAllDeliveryTiming = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/api/order/fetch/delivery-time/all`
    );
    return response.data;
  };

  const retrieveOrdersById = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/api/order/fetch?orderId=` + orderId
    );
    return response.data;
  };

  const searchOrderById = (e) => {
    e.preventDefault();
    setOrderId(tempOrderId);
  };

  const updateDelivery = (orderId) => {
    setAssignOrderId(orderId);
    handleShow();
  };

  const updateOrderStatus = (orderId, e) => {
    e.preventDefault();
    deliveryUpdateRequest.orderId = assignOrderId;

    fetch(`${API_BASE_URL}/api/order/update/delivery-status`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + delivery_jwtToken,
      },
      body: JSON.stringify(deliveryUpdateRequest),
    })
        .then((result) => {
          result.json().then((res) => {
            if (res.success) {
              toast.success(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
              });
              setTimeout(() => {
                window.location.reload(true);
              }, 2000);
            } else {
              toast.error(res.responseMessage || "Error en el servidor", {
                position: "top-center",
                autoClose: 1000,
              });
              setTimeout(() => {
                window.location.reload(true);
              }, 2000);
            }
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error en el servidor", {
            position: "top-center",
            autoClose: 1000,
          });
          setTimeout(() => {
            window.location.reload(true);
          }, 1000);
        });
  };

  const brandDarkBlue = "#09172A";

  return (
      <div className="container-fluid px-4 py-3">
        {/* Título Principal Limpio */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2
                className="fw-bold text-dark m-0 fs-2"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Órdenes de Entrega
            </h2>
            <p className="text-muted small m-0">
              Gestiona el estado y seguimiento de tus despachos asignados
            </p>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="card shadow-sm border-0 rounded-4 bg-white overflow-hidden mb-5">
          <div className="p-4 border-bottom bg-light">
            <form className="row g-2 align-items-center">
              <div className="col-auto flex-grow-1" style={{ maxWidth: "350px" }}>
                <input
                    type="text"
                    className="form-control shadow-none"
                    placeholder="Ingrese ID de Orden..."
                    onChange={(e) => setTempOrderId(e.target.value)}
                    value={tempOrderId}
                />
              </div>
              <div className="col-auto">
                <button
                    type="submit"
                    className="btn fw-bold px-4 text-white shadow-sm"
                    style={{ backgroundColor: brandDarkBlue, borderColor: brandDarkBlue }}
                    onClick={searchOrderById}
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive m-0">
              <table className="table table-hover align-middle mb-0 text-dark">
                <thead className="table-light text-uppercase fs-7 text-secondary border-bottom">
                <tr>
                  <th scope="col" className="py-3 px-4">Orden & Producto</th>
                  <th scope="col" className="py-3 px-3">Cliente</th>
                  <th scope="col" className="py-3 px-3 text-end">Precio Total</th>
                  <th scope="col" className="py-3 px-3">Entrega</th>
                  <th scope="col" className="py-3 px-3">Dirección de Entrega</th>
                  <th scope="col" className="py-3 px-4 text-center">Estado / Acción</th>
                </tr>
                </thead>
                <tbody>
                {orders && orders.length > 0 ? (
                    orders.map((order) => {
                      const isDelivered = order.status === "Delivered";

                      return (
                          <tr key={order.orderId}>
                            {/* 1. Orden & Producto (ID Completo y sin recortar) */}
                            <td className="py-3 px-4">
                              <div className="d-flex align-items-center gap-3">
                                <div
                                    className="bg-light border rounded-3 p-1 d-flex align-items-center justify-content-center"
                                    style={{ width: "55px", height: "55px", flexShrink: 0 }}
                                >
                                  <img
                                      src={`${API_BASE_URL}/api/product/` + order.product.image1}
                                      alt="product"
                                      className="w-100 h-100"
                                      style={{ objectFit: "contain" }}
                                  />
                                </div>
                                <div>
                                  <div className="fw-bold text-dark fs-6">
                                    {order.product.name}
                                  </div>
                                  <div className="text-muted font-monospace text-break" style={{ fontSize: "0.75rem", maxWidth: "220px" }}>
                                    #{order.orderId}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* 2. Cliente */}
                            <td className="py-3 px-3 fw-medium">
                              {order.user?.firstName} {order.user?.lastName || ""}
                            </td>

                            {/* 3. Precio Total */}
                            <td className="py-3 px-3 text-end fw-bold text-dark">
                              Q{order.productOffer?.amount || order.product?.price}
                            </td>

                            {/* 4. Entrega */}
                            <td className="py-3 px-3">
                              {order.deliveryDate ? (
                                  <div className="small fw-medium text-dark">
                                    <div>{order.deliveryDate}</div>
                                    <div className="text-muted">{order.deliveryTime}</div>
                                  </div>
                              ) : (
                                  <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1">
                              Procesando
                            </span>
                              )}
                            </td>

                            {/* 5. Dirección de Entrega (En lugar del teléfono del repartidor) */}
                            <td className="py-3 px-3">
                              <div className="small text-dark fw-medium" style={{ maxWidth: "220px" }}>
                                {order.address ? (
                                    <>
                                      <div>{order.address.street}, {order.address.city}</div>
                                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                                        {order.address.pincode}
                                      </div>
                                    </>
                                ) : (
                                    <span className="text-muted fst-italic">Dirección no especificada</span>
                                )}
                              </div>
                            </td>

                            {/* 6. Estado / Acción */}
                            <td className="py-3 px-4 text-center">
                              {isDelivered ? (
                                  <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-bold rounded-pill">
                              Entregado
                            </span>
                              ) : (
                                  <div className="d-flex align-items-center justify-content-center gap-2">
                              <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1">
                                {order.status}
                              </span>
                                    <button
                                        className="btn btn-sm fw-semibold text-white px-3 rounded-2 shadow-sm"
                                        style={{ backgroundColor: brandDarkBlue, borderColor: brandDarkBlue }}
                                        onClick={() => updateDelivery(order.orderId)}
                                    >
                                      Actualizar
                                    </button>
                                  </div>
                              )}
                            </td>
                          </tr>
                      );
                    })
                ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-5">
                        No se encontraron órdenes de entrega.
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal de Actualización */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton className="border-bottom-0 pb-0">
            <Modal.Title className="fw-bold text-dark fs-5">
              Actualizar Estado de Entrega
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <form>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">
                  ID de Orden
                </label>
                <input
                    type="text"
                    className="form-control bg-light font-monospace"
                    value={assignOrderId}
                    disabled
                />
              </div>

              <div className="mb-3">
                <label htmlFor="deliveryDate" className="form-label text-secondary small fw-bold">
                  Fecha de Entrega
                </label>
                <input
                    type="date"
                    className="form-control shadow-none"
                    id="deliveryDate"
                    name="deliveryDate"
                    onChange={handleInput}
                    value={deliveryUpdateRequest.deliveryDate}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">
                  Hora de Entrega
                </label>
                <select
                    name="deliveryTime"
                    onChange={handleInput}
                    className="form-control shadow-none"
                >
                  <option value="">Seleccione Horario</option>
                  {deliveryTime.map((time, idx) => (
                      <option key={idx} value={time}>
                        {time}
                      </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary small fw-bold">
                  Estado de Entrega
                </label>
                <select
                    name="deliveryStatus"
                    onChange={handleInput}
                    className="form-control shadow-none"
                >
                  <option value="">Seleccione Estado</option>
                  {deliveryStatus.map((status, idx) => (
                      <option key={idx} value={status}>
                        {status}
                      </option>
                  ))}
                </select>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <Button variant="light" className="border px-4" onClick={handleClose}>
                  Cancelar
                </Button>
                <button
                    type="button"
                    onClick={(e) => updateOrderStatus(assignOrderId, e)}
                    className="btn text-white px-4 fw-bold shadow-sm"
                    style={{ backgroundColor: brandDarkBlue, borderColor: brandDarkBlue }}
                >
                  Guardar Cambios
                </button>
              </div>
              <ToastContainer />
            </form>
          </Modal.Body>
        </Modal>
      </div>
  );
};

export default ViewDeliveryOrders;
