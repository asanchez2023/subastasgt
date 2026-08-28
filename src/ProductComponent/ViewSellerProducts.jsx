import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

const ViewSellerProducts = () => {
  const seller = JSON.parse(sessionStorage.getItem("active-customer"));
  const seller_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const statusOptions = ["Available", "Deactivated", "Sold", "UnSold"];
  const [allProducts, setAllProducts] = useState([]);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const getAllProducts = async () => {
      const data = await retrieveAllProducts();
      if (data) {
        setAllProducts(data.products);
      }
    };

    getAllProducts();
  }, [status]);

  const retrieveAllProducts = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/api/product/fetch/seller-wise?sellerId=${seller.id}&status=${status}`
    );
    return response.data;
  };

  const deleteProduct = (productId, e) => {
    e.preventDefault();
    fetch(
        `${API_BASE_URL}/api/product/delete?productId=${productId}&sellerId=${seller.id}`,
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
              toast.success(res.responseMessage, { position: "top-center", autoClose: 1000 });
              setTimeout(() => window.location.reload(true), 1000);
            } else {
              toast.error(res.responseMessage, { position: "top-center", autoClose: 1000 });
            }
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error en el servidor", { position: "top-center", autoClose: 1000 });
        });
  };

  const updateProduct = (product) => {
    navigate("/seller/product/update", { state: product });
  };

  // Badges Estandarizados (Mismo padding, alto y peso)
  const renderStatusBadge = (productStatus) => {
    const styles = {
      Sold: "bg-success-subtle text-success border-0",
      Available: "bg-primary-subtle text-primary border-0",
      Deactivated: "bg-secondary-subtle text-secondary border-0",
      UnSold: "bg-warning-subtle text-warning-emphasis border-0",
    };

    return (
        <span
            className={`badge rounded-pill fw-semibold px-3 py-1 ${
                styles[productStatus] || "bg-light text-dark"
            }`}
            style={{ fontSize: "0.75rem" }}
        >
        {productStatus}
      </span>
    );
  };

  // Corrección visual de tipografía/erratas
  const sanitizeCategoryName = (name) => {
    if (!name) return "";
    return name.replace("Activiadades", "Actividades");
  };

  const filteredProducts = allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="container-fluid py-4 px-4 bg-light" style={{ minHeight: "100vh" }}>
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">

          {/* Header con Buscador e Icono + Selector */}
          <div className="card-header bg-white border-bottom py-3 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <h4 className="m-0 fw-bold text-dark fs-5">Mis Productos</h4>

            <div className="d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0" style={{ maxWidth: "500px" }}>

              {/* Input con Icono de Lupa */}
              <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0 border-light-subtle text-muted">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </span>
                <input
                    type="text"
                    className="form-control border-start-0 border-light-subtle shadow-none"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Selector de Estado */}
              <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-select form-select-sm border-light-subtle shadow-none w-auto"
                  style={{ fontSize: "0.85rem" }}
              >
                <option value="">Todos</option>
                {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla */}
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                <tr className="bg-light text-secondary text-uppercase" style={{ fontSize: "0.72rem", letterSpacing: "0.6px" }}>
                  <th scope="col" className="ps-4 py-3 border-0 font-semibold">Producto</th>
                  <th scope="col" className="py-3 border-0 font-semibold">Categoría</th>
                  <th scope="col" className="text-center py-3 border-0 font-semibold">Stock</th>
                  <th scope="col" className="text-end py-3 border-0 font-semibold">Precio</th>
                  <th scope="col" className="text-center py-3 border-0 font-semibold">Estado</th>
                  <th scope="col" className="text-end pe-4 py-3 border-0"></th>
                </tr>
                </thead>
                <tbody>
                {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-5">
                        No se encontraron productos registrados.
                      </td>
                    </tr>
                ) : (
                    filteredProducts.map((product) => (
                        <tr key={product.id} className="border-bottom border-light-subtle">

                          {/* Media Object */}
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                  className="rounded-3 border bg-white p-1 d-flex align-items-center justify-content-center flex-shrink-0"
                                  style={{ width: "44px", height: "44px" }}
                              >
                                <img
                                    src={`${API_BASE_URL}/api/product/` + product.image1}
                                    alt={product.name}
                                    className="w-100 h-100 object-fit-contain"
                                />
                              </div>
                              <div className="fw-medium text-dark" style={{ fontSize: "0.9rem" }}>
                                {product.name}
                              </div>
                            </div>
                          </td>

                          {/* Categoría limpia */}
                          <td className="py-3 text-secondary small">
                            {sanitizeCategoryName(product.category?.name)}
                          </td>

                          {/* Stock */}
                          <td className="py-3 text-center text-dark font-monospace fw-medium" style={{ fontSize: "0.875rem" }}>
                            {product.quantity}
                          </td>

                          {/* Precio */}
                          <td className="py-3 text-end fw-bold text-dark font-monospace" style={{ fontSize: "0.875rem" }}>
                            {product.price ? `Q${product.price.toLocaleString()}` : "-"}
                          </td>

                          {/* Estado */}
                          <td className="py-3 text-center">
                            {renderStatusBadge(product.status)}
                          </td>

                          {/* Menú de 3 puntos */}
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
                                {product.status !== "Sold" && product.status !== "Deactivated" && (
                                    <li>
                                      <button
                                          onClick={() => updateProduct(product)}
                                          className="dropdown-item py-2"
                                      >
                                        Editar producto
                                      </button>
                                    </li>
                                )}
                                {product.status === "Available" && (
                                    <li>
                                      <button
                                          onClick={(e) => deleteProduct(product.id, e)}
                                          className="dropdown-item py-2 text-danger"
                                      >
                                        Eliminar producto
                                      </button>
                                    </li>
                                )}
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

export default ViewSellerProducts;
