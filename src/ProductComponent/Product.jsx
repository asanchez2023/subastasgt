import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import ProductCard from "./ProductCard";
import ProductCarousel from "./ProductCarousel";
import ProductOffers from "../ProductOfferComponent/ProductOffers";
import { API_BASE_URL } from "../config";

// Componente para el contador regresivo en tiempo real
const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(Number(targetDate) || targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (!targetDate || difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
        <div className="alert alert-danger mb-0 py-2 text-center fw-bold rounded-3">
          Subasta Finalizada
        </div>
    );
  }

  const formatUnit = (val) => String(val).padStart(2, "0");

  return (
      <div className="bg-light border rounded-3 p-3">
        <div
            className="text-uppercase text-secondary fw-bold small mb-2"
            style={{ letterSpacing: "0.5px" }}
        >
          Tiempo Restante de Subasta
        </div>
        <div className="d-flex align-items-center gap-2 text-dark font-monospace fw-bold fs-4">
        <span className="bg-white border px-2 py-1 rounded shadow-sm">
          {formatUnit(timeLeft.days)}d
        </span>
          <span>:</span>
          <span className="bg-white border px-2 py-1 rounded shadow-sm">
          {formatUnit(timeLeft.hours)}h
        </span>
          <span>:</span>
          <span className="bg-white border px-2 py-1 rounded shadow-sm">
          {formatUnit(timeLeft.minutes)}m
        </span>
          <span>:</span>
          <span className="bg-white border px-2 py-1 rounded shadow-sm text-danger">
          {formatUnit(timeLeft.seconds)}s
        </span>
        </div>
      </div>
  );
};

const Product = () => {
  const { productId, categoryId } = useParams();
  let navigate = useNavigate();

  // Soporte universal para el JWT Token
  const customer_jwtToken =
      sessionStorage.getItem("jwtToken") ||
      sessionStorage.getItem("customer-jwtToken") ||
      sessionStorage.getItem("token");

  const [fetchedCustomer, setFetchedCustomer] = useState({});
  const user = JSON.parse(
      sessionStorage.getItem("active-customer") ||
      sessionStorage.getItem("active-user") ||
      "null"
  );

  const [amount, setAmount] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    seller: {
      firstName: "",
    },
  });

  const retrieveProduct = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/api/product/fetch?productId=` + productId
    );
    return response.data;
  };

  const retrieveCustomer = async (customerId) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/user/fetch/user-id?userId=` + customerId
    );
    return response.data;
  };

  const retrieveProductsByCategory = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/api/product/fetch/category-wise?categoryId=` + categoryId
    );
    return response.data;
  };

  useEffect(() => {
    const getCustomer = async () => {
      let retrievedCustomers;
      if (user && user.id) {
        retrievedCustomers = await retrieveCustomer(user.id);
      }
      if (retrievedCustomers && retrievedCustomers.users) {
        setFetchedCustomer(retrievedCustomers.users[0]);
      }
    };

    const getProduct = async () => {
      const retrievedProduct = await retrieveProduct();
      if (retrievedProduct && retrievedProduct.products) {
        setProduct(retrievedProduct.products[0]);
      }
    };

    const getProductsByCategory = async () => {
      if (categoryId) {
        const allProducts = await retrieveProductsByCategory();
        if (allProducts && allProducts.products) {
          setProducts(allProducts.products);
        }
      }
    };

    getCustomer();
    getProduct();
    getProductsByCategory();
  }, [productId, categoryId]);

  const saveProductOffer = (offerAmount) => {
    fetch(`${API_BASE_URL}/api/product/offer/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + customer_jwtToken,
      },
      body: JSON.stringify({
        amount: offerAmount,
        userId: user?.id,
        productId: productId,
      }),
    }).then((result) => {
      result.json().then((res) => {
        if (res.success) {
          toast.success(res.responseMessage || "Oferta realizada con éxito", {
            position: "top-center",
            autoClose: 1000,
          });

          setTimeout(() => {
            navigate("/customer/bid/all");
          }, 2000);
        } else {
          toast.error(res.responseMessage || "Error al procesar la oferta", {
            position: "top-center",
            autoClose: 1000,
          });
          setTimeout(() => {
            window.location.reload(true);
          }, 2000);
        }
      });
    });
  };

  const addproductOffer = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error(
          "Inicie sesión como cliente para ofertar por cualquier producto",
          {
            position: "top-center",
            autoClose: 1000,
          }
      );
    } else if (product.seller && product.seller.id === user.id) {
      toast.error("No puedes ofertar en tu propio producto!", {
        position: "top-center",
        autoClose: 1000,
      });
    } else if (
        fetchedCustomer.walletAmount &&
        Number(amount) > Number(fetchedCustomer.walletAmount)
    ) {
      toast.error("Fondos insuficientes en tu billetera!", {
        position: "top-center",
        autoClose: 1000,
      });
    } else {
      saveProductOffer(amount);
      setAmount("");
    }
  };

  const sellerProductPage = () => {
    if (product.seller && product.seller.id) {
      navigate(
          `/product/seller/${product.seller.id}/${product.seller.firstName}`,
          {
            state: product.seller,
          }
      );
    }
  };

  const brandDarkBlue = "#09172A";

  return (
      <div className="container-fluid px-4 py-3">
        <ToastContainer />
        <div className="row g-4">
          {/* Columna Izquierda: Galería/Carrusel */}
          <div className="col-lg-3 col-md-4">
            <div className="card form-card custom-bg shadow-lg p-2 border-0 rounded-4">
              <ProductCarousel
                  item={{
                    image1: product.image1,
                    image2: product.image2,
                    image3: product.image3,
                  }}
              />
            </div>
          </div>

          {/* Columna Central: Información del Producto */}
          <div className="col-lg-6 col-md-8">
            <div className="card form-card custom-bg shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-body p-4 text-color">

                {/* 1. Título Limpio (Sin Banner Azul Encajonado) */}
                <div className="mb-3">
                <span className="badge bg-light text-secondary border fw-semibold mb-2 px-2 py-1">
                  {product.category?.name || "Subasta Activa"}
                </span>
                  <h2
                      className="fw-bold text-dark m-0 fs-2"
                      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                  >
                    {product.name}
                  </h2>
                </div>

                {/* 2. Bloque CTA: Precio, Existencias y Formulario de Oferta */}
                <div className="bg-light p-3 rounded-4 border mb-4 shadow-sm">
                  <div className="d-flex justify-content-between align-items-baseline mb-3">
                    <div>
                      <div className="text-secondary small fw-medium">
                        Precio base
                      </div>
                      <div className="fs-3 fw-bold text-dark">
                        Q{product.price}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-secondary small fw-medium">
                        Disponibilidad
                      </div>
                      {product.quantity > 0 ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fw-bold">
                        {product.quantity} disponibles
                      </span>
                      ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fw-bold">
                        Agotado
                      </span>
                      )}
                    </div>
                  </div>

                  <form
                      onSubmit={addproductOffer}
                      className="row g-2 align-items-center"
                  >
                    <div className="col">
                      <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 fw-bold text-muted">
                        Q
                      </span>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control border-start-0 shadow-none fs-6 py-2"
                            placeholder="Ingrese Monto a Ofertar..."
                            onChange={(e) => setAmount(e.target.value)}
                            value={amount}
                            required
                        />
                      </div>
                    </div>
                    <div className="col-auto">
                      <button
                          type="submit"
                          className="btn fw-bold px-4 py-2 text-white rounded-3 shadow-sm"
                          style={{
                            backgroundColor: brandDarkBlue,
                            borderColor: brandDarkBlue,
                          }}
                      >
                        Ofertar
                      </button>
                    </div>
                  </form>
                </div>

                {/* 3. Temporizador de Expiración en Vivo */}
                <div className="mb-4">
                  <CountdownTimer targetDate={product.endDate} />
                </div>

                <hr className="my-4 opacity-25" />

                {/* 4. Descripción del Producto */}
                <div className="mb-4">
                  <h6
                      className="fw-bold text-uppercase text-secondary small mb-2"
                      style={{ letterSpacing: "0.5px" }}
                  >
                    Descripción:
                  </h6>
                  <p
                      className="card-text text-dark fs-6 lh-base m-0"
                      style={{ whiteSpace: "pre-line" }}
                  >
                    {product.description}
                  </p>
                </div>

                <hr className="my-4 opacity-25" />

                {/* 5. Tarjeta de Perfil del Vendedor */}
                <div>
                  <h6
                      className="fw-bold text-uppercase text-secondary small mb-3"
                      style={{ letterSpacing: "0.5px" }}
                  >
                    Detalles del Vendedor:
                  </h6>
                  <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 border">
                    <div className="d-flex align-items-center gap-3">
                      <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                          style={{
                            width: "42px",
                            height: "42px",
                            backgroundColor: brandDarkBlue,
                          }}
                      >
                        {product.seller?.firstName
                            ? product.seller.firstName.charAt(0).toUpperCase()
                            : "V"}
                      </div>
                      <div>
                        <div className="fw-bold text-dark leading-tight">
                          {product.seller?.firstName} {product.seller?.lastName || ""}
                        </div>
                        <div className="text-muted small d-flex align-items-center gap-1">
                          <svg
                              width="14"
                              height="14"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                          >
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.384L8 9.583l-1.326-.795-5.64 3.384A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                          </svg>
                          {product.seller?.emailId}
                        </div>
                      </div>
                    </div>
                    <button
                        type="button"
                        onClick={sellerProductPage}
                        className="btn btn-sm btn-outline-dark fw-semibold px-3 rounded-2"
                    >
                      Ver Perfil
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Columna Derecha: Ofertas */}
          <div className="col-lg-3 col-md-12">
            <ProductOffers />
          </div>
        </div>

        {/* Productos Relacionados */}
        <div className="row mt-4">
          <div className="col-md-12 text-color">
            <h3 className="fw-bold mb-3">Productos Relacionados:</h3>
            <div className="row row-cols-1 row-cols-md-4 g-4">
              {products.map((item) => (
                  <ProductCard key={item.id || item.name} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Product;
