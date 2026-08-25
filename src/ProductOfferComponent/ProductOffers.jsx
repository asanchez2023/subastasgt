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
            : "Anonymous User"}{" "}
          <span className="text-success">[WON]</span>
        </div>
      );
    }
    return <div>Usuario Anónimo</div>;
  };

  return (
    <div
      className="list-group form-card border-color offers-panel"
      style={{
        height: "31rem",
      }}
    >
      <div className="list-group-item list-group-item-action bg-color custom-bg-text text-center">
        <b>Ofertas de Producto</b>
      </div>
      <div
        style={{
          overflowY: "auto",
        }}
      >
        {offers.map((offer) => (
          <div
            className="list-group-item list-group-item-action text-color custom-bg"
            key={offer.id}
          >
            <b className="text-color1">{offerLabel(offer)}</b>
            <p> Q{offer.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductOffers;
