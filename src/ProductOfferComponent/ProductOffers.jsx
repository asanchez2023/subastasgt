import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductOffers = () => {
  const [offers, setOffers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State variable to trigger re-fetching

  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const { productId } = useParams();

  const retrieveAllOffers = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/product/offer/fetch/product?productId=" +
        productId
    );
    return response.data;
  };

  useEffect(() => {
    const getAllOffers = async () => {
      const allOffers = await retrieveAllOffers();
      if (allOffers) {
        const sortedOffers = allOffers.offers.sort((a, b) => b.amount - a.amount);
        setOffers(sortedOffers);
      }
    };

    getAllOffers();

    // Set an interval to update the refreshTrigger every 5 seconds
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1); // Increment the trigger
    }, 1000); // Adjust the interval as needed

    return () => clearInterval(interval); // Cleanup on unmount
  }, [refreshTrigger]); // Re-run effect when refreshTrigger changes

  return (
    <div
      className="list-group form-card border-color"
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
        {offers.map((offer) => {
          return (
            <div className="list-group-item list-group-item-action text-color custom-bg" key={offer.id}>
              <b className="text-color1">
                {(() => {
                  if (offer.product.status === "Sold") {
                    if (offer.status === "Won") {
                      return (
                        <div>
                          {admin
                            ? offer.user.firstName + " " + offer.user.lastName
                            : "Anonymous User"}{" "}
                          <span className="text-success">[WON]</span>
                        </div>
                      );
                    }
                  }
                  return <div>Usuario Anónimo</div>;
                })()}
              </b>
              <p> Q{offer.amount}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductOffers;