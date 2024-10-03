import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const admin = JSON.parse(sessionStorage.getItem("active-admin"));

  const { productId } = useParams();

  const retrieveAllOffers = async () => {
    const response = await axios.get(
      "http://3.234.108.139:8080/api/product/offer/fetch/product?productId=" +
        productId
    );
    return response.data;
  };

  const getAllOffers = async () => {
    setLoading(true);
    const alloffers = await retrieveAllOffers();
    if (alloffers) {
      setOffers(alloffers.offers);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllOffers();
    const intervalId = setInterval(() => {
      getAllOffers();
    }, 5000); // Actualiza cada 5 segundos

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      class="list-group form-card border-color"
      style={{
        height: "31rem",
      }}
    >
      <div class="list-group-item list-group-item-action bg-color custom-bg-text text-center">
        <b>Ofertas de Producto</b>
      </div>
      <div
        style={{
          overflowY: "auto",
        }}
      >
        {loading ? (
          <p>Cargando...</p>
        ) : (
          offers.map((offer) => {
            return (
              <div class="list-group-item list-group-item-action text-color custom-bg">
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
          })
        )}
      </div>
    </div>
  );
};

export default ProductOffers;
