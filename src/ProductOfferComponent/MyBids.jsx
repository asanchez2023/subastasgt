import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../config";

const MyBids = () => {
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");
  const user = JSON.parse(sessionStorage.getItem("active-customer"));
  const [myOffers, setMyOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getMyOffers = async () => {
      const offers = await retrieveMyOffers();
      if (offers) {
        setMyOffers(offers.offers || []);
      }
    };

    getMyOffers();
  }, []);

  const retrieveMyOffers = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/api/product/offer/fetch/user?userId=${user.id}`
    );
    return response.data;
  };

  const deleteProductOffer = (offerId) => {
    if (!window.confirm("¿Deseas cancelar esta oferta?")) return;

    fetch(`${API_BASE_URL}/api/product/offer/id?offerId=${offerId}`, {
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
          });
          // Actualización defensiva en caliente del estado local
          setMyOffers((prev) => prev.filter((offer) => offer.id !== offerId));
        } else {
          toast.error(res.responseMessage, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      });
    }).catch((error) => {
      console.error(error);
      toast.error("Error en el servidor", { position: "top-center", autoClose: 1000 });
    });
  };

  const formatDateFromEpoch = (epochTime) => {
    if (!epochTime) return "-";
    const date = new Date(Number(epochTime));
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatusBadge = (status) => {
    const styles = {
      Active: "bg-primary-subtle text-primary border-0",
      Won: "bg-success-subtle text-success border-0",
      Winning: "bg-info-subtle text-info-emphasis border-0",
      Lost: "bg-danger-subtle text-danger border-0",
      Cancelled: "bg-secondary-subtle text-secondary border-0",
    };

    return (
        <span
            className={`badge rounded-pill fw-semibold px-3 py-1 ${
                styles[status] || "bg-light text-dark"
            }`}
            style={{ fontSize: "0.75rem" }}
        >
        {status || "Active"}
      </span>
    );
  };

  const filteredOffers = myOffers.filter((offer) => {
    const productName = (offer.product?.name || "").toLowerCase();
    const sellerName = `${offer.product?.seller?.firstName || ""} ${offer.product?.seller?.lastName || ""}`.toLowerCase();
    const term = searchTerm.toLowerCase();

    return productName.includes(term) || sellerName.includes(term);
  });

  return (
      <div className="container-fluid py-4 px-4 bg-light" style={{ minHeight: "100vh" }}>
        <ToastContainer />
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">

          {/* Header con Buscador */}
          <div className="card-header bg-white border-bottom py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <h4 className="m-0 fw-bold text-dark fs-5">Mis Ofertas</h4>

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
                    placeholder="Buscar por producto o vendedor..."
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
                  <th scope="col" className="ps-4 py-3 border-0 font-semibold">Producto</th>
                  <th scope="col" className="py-3 border-0 font-semibold">Vendedor</th>
                  <th scope="col" className="text-end py-3 border-0 font-semibold">Oferta Realizada</th>
                  <th scope="col" className="py-3 border-0 font-semibold text-center">Fecha</th>
                  <th scope="col" className="text-center py-3 border-0 font-semibold">Estado</th>
                  <th scope="col" className="text-end pe-4 py-3 border-0"></th>
                </tr>
                </thead>
                <tbody>
                {filteredOffers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-5">
                        No se encontraron ofertas registradas.
                      </td>
                    </tr>
                ) : (
                    filteredOffers.map((myOffer) => (
                        <tr key={myOffer.id} className="border-bottom border-light-subtle">

                          {/* Media Object: Imagen + Nombre */}
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                  className="rounded-3 border bg-white p-1 d-flex align-items-center justify-content-center flex-shrink-0"
                                  style={{ width: "44px", height: "44px" }}
                              >
                                <img
                                    src={`${API_BASE_URL}/api/product/` + myOffer.product?.image1}
                                    alt={myOffer.product?.name}
                                    className="w-100 h-100 object-fit-contain"
                                />
                              </div>
                              <div>
                                <div className="fw-medium text-dark" style={{ fontSize: "0.875rem" }}>
                                  {myOffer.product?.name}
                                </div>
                                <div className="text-muted small">
                                  Precio Base: <span className="font-monospace">Q{myOffer.product?.price ? myOffer.product.price.toLocaleString() : "-"}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Vendedor */}
                          <td className="py-3">
                            <div className="fw-medium text-dark" style={{ fontSize: "0.85rem" }}>
                              {myOffer.product?.seller?.firstName} {myOffer.product?.seller?.lastName || ""}
                            </div>
                          </td>

                          {/* Monto de Oferta */}
                          <td className="py-3 text-end font-monospace fw-bold text-dark" style={{ fontSize: "0.875rem" }}>
                            Q{myOffer.amount ? myOffer.amount.toLocaleString() : "-"}
                          </td>

                          {/* Fecha de Oferta */}
                          <td className="py-3 text-center text-secondary small" style={{ fontSize: "0.8rem" }}>
                            {formatDateFromEpoch(myOffer.dateTime)}
                          </td>

                          {/* Estado */}
                          <td className="py-3 text-center">
                            {renderStatusBadge(myOffer.status)}
                          </td>

                          {/* Acciones */}
                          <td className="py-3 text-end pe-4">
                            {myOffer.status === "Active" ? (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger fw-medium"
                                    onClick={() => deleteProductOffer(myOffer.id)}
                                    style={{ fontSize: "0.8rem" }}
                                >
                                  Cancelar Oferta
                                </button>
                            ) : (
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
                                      <span className="dropdown-item text-muted disabled">Sin acciones</span>
                                    </li>
                                  </ul>
                                </div>
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

export default MyBids;
