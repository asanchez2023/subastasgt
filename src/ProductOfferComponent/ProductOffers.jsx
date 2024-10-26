import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductOffers = () => {
  const [offers, setOffers] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State variable to trigger re-fetching
  const [newOfferAmount, setNewOfferAmount] = useState(0); // State for new offer amount

  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const { productId } = useParams();

  const retrieveAllOffers = async () => {
    const response = await axios.get(
      "http://3.234.108.139:8080/api/product/offer/fetch/product?productId=" +
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

    // Set an interval to update the refreshTrigger every 2 seconds
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1); // Increment the trigger
    }, 2000); // Adjust the interval as needed

    return () => clearInterval(interval); // Cleanup on unmount
  }, [refreshTrigger]); // Re-run effect when refreshTrigger changes

  const handleNewOffer = () => {
    const lastBidAmount = offers.length > 0 ? offers[0].amount : 0; // Get the last bid amount

    if (newOfferAmount <= lastBidAmount) {
      alert(`Your offer must be higher than the last bid of Q${lastBidAmount}.`);
      return;
    }

    // Proceed to submit the new offer
    submitOffer(newOfferAmount);
  };

  const submitOffer = async (amount) => {
    try {
      // Here you would call your API to submit the new offer
      await axios.post("http://3.234.108.139:8080/api/product/offer/submit", { amount, productId });
      setNewOfferAmount(0); // Reset the input after successful submission
      setRefreshTrigger((prev) => prev + 1); // Trigger a refresh to get the updated offers
    } catch (error) {
      console.error("Error submitting the offer:", error);
      alert("There was an error submitting your offer. Please try again.");
    }
  };

  return (
    <div className="list-group form-card border-color" style={{ height: "31rem" }}>
      <div className="list-group-item list-group-item-action bg-color custom-bg-text text-center">
        <b>Ofertas de Producto</b>
      </div>
      <div style={{ overflowY: "auto" }}>
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
      <div className="list-group-item">
        <input
          type="number"
          value={newOfferAmount}
          onChange={(e) => setNewOfferAmount(parseFloat(e.target.value))}
          placeholder="Enter your offer"
        />
        <button onClick={handleNewOffer}>Submit Offer</button>
      </div>
    </div>
  );
};

export default ProductOffers;