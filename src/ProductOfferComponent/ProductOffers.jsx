import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

const POLL_MS = 2000;

const sameOffers = (prev, next) =>
    prev.length === next.length &&
    prev.every(
        (offer, i) =>
            offer.id === next[i].id &&
            offer.amount === next[i].amount &&
            offer.status === next[i].status
    );

const ProductOffers = () => {
  const [offers, setOffers] = useState([]);
  const { productId } = useParams();

  let admin = null;
  try {
    admin = JSON.parse(sessionStorage.getItem("active-admin"));
  } catch {
    admin = null;
  }

  useEffect(() => {
    if (!productId) return;

    const controller = new AbortController();
    let inFlight = false;

    const loadOffers = async () => {
      if (inFlight || document.hidden) return;
      inFlight = true;
      try {
        const { data } = await axios.get(
            `${API_BASE_URL}/api/product/offer/fetch/product`,
            { params: { productId }, signal: controller.signal }
        );
        const next = [...(data?.offers ?? [])].sort(
            (a, b) => b.amount - a.amount
        );
        setOffers((prev) => (sameOffers(prev, next) ? prev : next));
      } catch (err) {
        if (!axios.isCancel(err) && err.code !== "ERR_CANCELED") {
          console.error("Failed to load product offers", err);
        }
      } finally {
        inFlight = false;
      }
    };

    const onVisibilityChange = () => {
      if (!document.hidden) loadOffers();
    };

    loadOffers();
    const interval = setInterval(loadOffers, POLL_MS);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [productId]);

  const offerLabel = (offer) => {
    if (offer.product?.status === "Sold" && offer.status === "Won") {
      return (
          <div>
            {admin
                ? `${offer.user.firstName} ${offer.user.lastName}`
                : "Usuario Anónimo"}{" "}
            <span className="text-success fw-bold">[GANADOR]</span>
          </div>
      );
    }
    return <div>Usuario Anónimo</div>;
  };

  return (
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden h-fit">
        {/* Encabezado Limpio (Sin Banner Azul) */}
        <div className="card-header bg-white border-bottom py-3 px-4">
          <h6 className="m-0 fw-bold text-dark d-flex align-items-center gap-2">
            <span>💰</span> Ofertas del Producto
          </h6>
        </div>

        {/* Lista de Ofertas con Scroll Adaptativo */}
        <div
            className="list-group list-group-flush"
            style={{
              maxHeight: "35rem",
              overflowY: "auto",
            }}
        >
          {offers && offers.length > 0 ? (
              offers.map((offer, index) => {
                const isWinning = index === 0;

                return (
                    <div
                        className={`list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-bottom ${
                            isWinning ? "bg-emerald-subtle bg-opacity-10" : "bg-white"
                        }`}
                        key={offer.id}
                        style={{
                          backgroundColor: isWinning ? "#f0fdf4" : "transparent",
                        }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <span className="fs-5">{isWinning ? "👑" : "👤"}</span>
                        <div>
                          <div className="fw-semibold text-dark fs-6 m-0">
                            {offerLabel(offer)}
                          </div>
                          {isWinning && (
                              <span className="text-success fw-bold small">
                        Ganando subasta
                      </span>
                          )}
                        </div>
                      </div>

                      <span
                          className={`badge px-3 py-2 fs-6 rounded-pill ${
                              isWinning
                                  ? "bg-success text-white fw-bold shadow-sm"
                                  : "bg-light text-secondary border fw-normal"
                          }`}
                      >
                  Q{offer.amount}
                </span>
                    </div>
                );
              })
          ) : (
              <div className="text-center text-muted p-5">
                <p className="m-0 fw-medium">Sin ofertas aún</p>
                <small className="text-secondary">¡Sé el primero en ofertar!</small>
              </div>
          )}
        </div>
      </div>
  );
};

export default ProductOffers;
