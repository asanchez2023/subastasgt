import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const MyWallet = () => {
  let navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("active-customer"));

  // Estado para el saldo actual
  const [walletAmount, setWalletAmount] = useState(user?.walletAmount || 0);

  // Estados del formulario unificado
  const [paymentRequest, setPaymentRequest] = useState({
    userId: user ? user.id : "",
    amount: "",
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Detectar marca de tarjeta de forma automática según los primeros dígitos
  const getCardBrand = (number) => {
    const cleanNum = number.replace(/\D/g, "");
    if (cleanNum.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(cleanNum) || /^2[2-7]/.test(cleanNum)) return "MASTERCARD";
    if (cleanNum.startsWith("34") || cleanNum.startsWith("37")) return "AMEX";
    return "CARD";
  };

  const cardBrand = getCardBrand(paymentRequest.cardNumber);

  // Formatear número de tarjeta para que se vea espaciado en la tarjeta gráfica
  const formatCardNumberDisplay = (number) => {
    const clean = number.replace(/\D/g, "").padEnd(16, "•");
    const parts = clean.match(/.{1,4}/g) || ["••••", "••••", "••••", "••••"];
    return parts.join(" ");
  };

  const handleInput = (e) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16);
    }
    if (name === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4);
    }
    if (name === "amount") {
      value = value.replace(/[^0-9.]/g, "");
    }

    setPaymentRequest({ ...paymentRequest, [name]: value });
  };

  // Botones rápidos de pill para montos
  const handleQuickAmount = (val) => {
    setPaymentRequest({ ...paymentRequest, amount: val.toString() });
  };

  useEffect(() => {
    const getMyWallet = async () => {
      try {
        const response = await axios.get(
            `${API_BASE_URL}/api/user/fetch/user-id?userId=` + user.id
        );
        if (response.data && response.data.users && response.data.users[0]) {
          setWalletAmount(response.data.users[0].walletAmount);
        }
      } catch (error) {
        console.error("Error al obtener billetera", error);
      }
    };

    if (user) {
      getMyWallet();
    }
  }, []);

  const processPayment = (e) => {
    e.preventDefault();

    if (!paymentRequest.amount || parseFloat(paymentRequest.amount) <= 0) {
      toast.warning("Por favor ingresa un monto válido.", { position: "top-center" });
      return;
    }

    if (paymentRequest.cardNumber.length < 13) {
      toast.warning("Ingresa un número de tarjeta válido.", { position: "top-center" });
      return;
    }

    fetch(`${API_BASE_URL}/api/user/authorize/payment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequest),
    })
        .then((result) => {
          result.json().then((res) => {
            if (res.success) {
              if (res.redirectTo) {
                window.location.href = res.redirectTo;
              } else {
                toast.success("¡Transacción procesada con éxito!", { position: "top-center" });
                setTimeout(() => window.location.reload(), 1500);
              }
            } else {
              toast.error(res.responseMessage || "Error en la pasarela de pago", { position: "top-center" });
            }
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error en el servidor", { position: "top-center" });
        });
  };

  return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">

            <div className="card shadow-sm border-0 rounded-4 bg-white p-4 p-md-5">

              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                  <h2 className="fw-bold text-dark fs-3 m-0" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    Mi Billetera
                  </h2>
                  <p className="text-muted small m-0">Gestiona tus fondos y métodos de pago de forma segura</p>
                </div>
                <div className="text-end">
                  <span className="text-muted small d-block">Saldo disponible</span>
                  <span className="fs-4 fw-bold text-success">
                        Q{Number(walletAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>

                </div>
              </div>

              {(() => {
                if (document.URL.indexOf("cancel") !== -1) {
                  toast.error("Proceso de pago cancelado", { position: "top-center" });
                }
              })()}

              <form onSubmit={processPayment}>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">
                    PASO 1: MONTO A AÑADIR
                  </label>
                  <div className="input-group mb-2">
                    <span className="input-group-text bg-light fw-bold text-dark border-end-0">Q</span>
                    <input
                        type="text"
                        className="form-control shadow-none border-start-0 ps-0"
                        name="amount"
                        placeholder="0.00"
                        value={paymentRequest.amount}
                        onChange={handleInput}
                        required
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <span className="text-muted small align-self-center me-1">Rápido:</span>
                    {[100, 500, 1000, 2500].map((val) => (
                        <button
                            key={val}
                            type="button"
                            className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1"
                            style={{ fontSize: "0.8rem" }}
                            onClick={() => handleQuickAmount(val)}
                        >
                          +Q{val}
                        </button>
                    ))}
                  </div>
                </div>

                {/* Sección 2: La Tarjeta de Crédito Interactiva con tamaño fijo/proporcional */}
                <div className="mb-4 text-center">
                  <label className="form-label small fw-bold text-secondary mb-2 d-block text-start">
                    PASO 2: VISTA PREVIA DE LA TARJETA
                  </label>

                  <div
                      className="p-4 rounded-4 text-white shadow position-relative overflow-hidden text-start mx-auto"
                      style={{
                        background: "linear-gradient(135deg, #09172A 0%, #1e3c72 100% )",
                        width: "100%",
                        maxWidth: "360px", // Ancho fijo perfecto estilo tarjeta real
                        height: "210px",     // Proporción ideal de tarjeta bancaria (1.58:1)
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                  >
                    {/* Detalles decorativos de chip y marca */}
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="bg-warning rounded-2" style={{ width: "40px", height: "30px", opacity: 0.85 }}></div>
                      <span className="fw-bold tracking-wider fs-5" style={{ letterSpacing: "2px" }}>
                      {cardBrand}
                    </span>
                    </div>

                    {/* Número de tarjeta animado en vivo */}
                    <div className="font-monospace fs-5 text-center my-2" style={{ letterSpacing: "2px" }}>
                      {formatCardNumberDisplay(paymentRequest.cardNumber)}
                    </div>

                    {/* Nombre y Expiración en vivo */}
                    <div className="d-flex justify-content-between align-items-end mt-2" style={{ fontSize: "0.85rem" }}>
                      <div>
                        <span className="d-block text-white-50" style={{ fontSize: "0.6rem" }}>TITULAR</span>
                        <span className="fw-semibold text-uppercase text-truncate d-inline-block" style={{ maxWidth: "210px" }}>
                        {paymentRequest.cardHolderName || "NOMBRE DEL TITULAR"}
                      </span>
                      </div>
                      <div>
                        <span className="d-block text-white-50" style={{ fontSize: "0.6rem" }}>EXPIRA</span>
                        <span className="fw-semibold">{paymentRequest.expiryDate || "MM/AA"}</span>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label small fw-bold text-secondary">
                    NÚMERO DE TARJETA (SANDBOX)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">💳</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        className="form-control shadow-none border-start-0"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="4012 0000 0000 0000"
                        maxLength="16"
                        value={paymentRequest.cardNumber}
                        onChange={handleInput}
                        required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="expiryDate" className="form-label small fw-bold text-secondary">
                      EXPIRACIÓN (MM/AA)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">📅</span>
                      <input
                          type="text"
                          className="form-control shadow-none border-start-0"
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="12/28"
                          value={paymentRequest.expiryDate}
                          onChange={handleInput}
                          required
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="cvv" className="form-label small fw-bold text-secondary d-flex justify-content-between">
                      <span>CVV</span>
                      <span className="text-muted fw-normal" style={{ fontSize: "0.75rem" }}>3 dígitos atrás</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">🔒</span>
                      <input
                          type="text"
                          inputMode="numeric"
                          className="form-control shadow-none border-start-0"
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          maxLength="4"
                          value={paymentRequest.cvv}
                          onChange={handleInput}
                          required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="cardHolderName" className="form-label small fw-bold text-secondary">
                    NOMBRE EN LA TARJETA
                  </label>
                  <input
                      type="text"
                      className="form-control shadow-none"
                      id="cardHolderName"
                      name="cardHolderName"
                      placeholder="Ej. Adolfo Pérez"
                      value={paymentRequest.cardHolderName}
                      onChange={handleInput}
                      required
                  />
                </div>

                <div className="mt-4">
                  <button
                      type="submit"
                      className="btn text-white w-100 py-3 fw-bold shadow-sm rounded-3 d-flex align-items-center justify-content-center gap-2"
                      style={{ backgroundColor: "#09172A", fontSize: "1rem" }}
                  >
                    <span>🔒</span> Pagar y recargar saldo
                  </button>
                </div>

                <ToastContainer />
              </form>

            </div>
          </div>
        </div>
      </div>
  );
};

export default MyWallet;
