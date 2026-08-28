import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

const ViewSellerDeliveryPerson = () => {
  const [allDelivery, setAllDelivery] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const seller = JSON.parse(sessionStorage.getItem("active-customer"));
  const seller_jwtToken = sessionStorage.getItem("customer-jwtToken");

  useEffect(() => {
    const getAllUsers = async () => {
      const allUsers = await retrieveAllUser();
      if (allUsers) {
        setAllDelivery(allUsers.users || []);
      }
    };

    getAllUsers();
  }, []);

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

  const deleteDelivery = (userId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este repartidor?")) return;

    fetch(
        `${API_BASE_URL}/api/user/delete/seller/delivery-person?deliveryId=${userId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + seller_jwtToken,
          },
        }
    )
        .then((result) => {
          result.json().then((res) => {
            if (res.success) {
              toast.success(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
              });
              setAllDelivery((prev) => prev.filter((d) => d.id !== userId));
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
          toast.error("Error en el servidor", {
            position: "top-center",
            autoClose: 1000,
          });
        });
  };

  // Generar iniciales para el avatar
  const getInitials = (firstName = "", lastName = "") => {
    const f = firstName.charAt(0).toUpperCase();
    const l = lastName.charAt(0).toUpperCase();
    return `${f}${l}` || "DP";
  };

  // Filtro en cliente
  const filteredDelivery = allDelivery.filter((person) => {
    const fullName = `${person.firstName} ${person.lastName}`.toLowerCase();
    const email = (person.emailId || "").toLowerCase();
    const phone = (person.phoneNo || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    return fullName.includes(term) || email.includes(term) || phone.includes(term);
  });

  return (
      <div className="container-fluid py-4 px-4 bg-light" style={{ minHeight: "100vh" }}>
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">

          {/* Header con Buscador */}
          <div className="card-header bg-white border-bottom py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <h4 className="m-0 fw-bold text-dark fs-5">Repartidores</h4>

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
                    placeholder="Buscar repartidor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabla Limpia */}
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                <tr className="bg-light text-secondary text-uppercase" style={{ fontSize: "0.72rem", letterSpacing: "0.6px" }}>
                  <th scope="col" className="ps-4 py-3 border-0 font-semibold">Repartidor</th>
                  <th scope="col" className="py-3 border-0 font-semibold">Contacto</th>
                  <th scope="col" className="py-3 border-0 font-semibold">Dirección</th>
                  <th scope="col" className="text-end pe-4 py-3 border-0"></th>
                </tr>
                </thead>
                <tbody>
                {filteredDelivery.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-5">
                        No se encontraron repartidores registrados.
                      </td>
                    </tr>
                ) : (
                    filteredDelivery.map((delivery) => (
                        <tr key={delivery.id} className="border-bottom border-light-subtle">

                          {/* Media Object: Avatar + Nombre */}
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                  className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                                  style={{ width: "40px", height: "40px", fontSize: "0.85rem" }}
                              >
                                {getInitials(delivery.firstName, delivery.lastName)}
                              </div>
                              <div>
                                <div className="fw-medium text-dark" style={{ fontSize: "0.875rem" }}>
                                  {delivery.firstName} {delivery.lastName}
                                </div>
                                <div className="text-muted small">ID: #{delivery.id}</div>
                              </div>
                            </div>
                          </td>

                          {/* Contacto: Email + Teléfono */}
                          <td className="py-3">
                            <div className="text-dark small fw-medium">{delivery.emailId}</div>
                            <div className="text-muted small">{delivery.phoneNo}</div>
                          </td>

                          {/* Dirección Formateada */}
                          <td className="py-3">
                            {delivery.address ? (
                                <div>
                                  <div className="text-dark small" style={{ fontSize: "0.85rem" }}>
                                    {delivery.address.street}
                                  </div>
                                  <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                                    {delivery.address.city} {delivery.address.pincode ? `• ${delivery.address.pincode}` : ""}
                                  </div>
                                </div>
                            ) : (
                                <span className="text-muted small fst-italic">Sin dirección registrada</span>
                            )}
                          </td>

                          {/* Acciones */}
                          <td className="py-3 text-end pe-4">
                            <div className="dropdown">
                              <button
                                  className="btn btn-sm btn-icon btn-light border-0 shadow-none rounded-circle text-muted"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  style={{ width: "30px", height: "30px", padding: 0 }}
                              >
                                <span className="fw-bold fs-6">⋮</span>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 small">
                                <li>
                                  <button
                                      onClick={() => deleteDelivery(delivery.id)}
                                      className="dropdown-item py-2 text-danger"
                                  >
                                    Eliminar repartidor
                                  </button>
                                </li>
                              </ul>
                            </div>
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

export default ViewSellerDeliveryPerson;
