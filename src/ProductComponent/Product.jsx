import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductCarousel from "./ProductCarousel";
import ProductOffers from "../ProductOfferComponent/ProductOffers";

const Product = () => {
  const { productId, categoryId } = useParams();

  let navigate = useNavigate();

  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const [fetchedCustomer, setFetchedCustomer] = useState({});

  let user = JSON.parse(sessionStorage.getItem("active-customer"));

  const [amount, setAmount] = useState("");

  const [products, setProducts] = useState([]);

  const [product, setProduct] = useState({
    seller: {
      firstName: "",
    },
  });

  const retrieveProduct = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/product/fetch?productId=" + productId
    );

    return response.data;
  };

  const retrieveCustomer = async (customerId) => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/user-id?userId=" + customerId
    );

    return response.data;
  };

  useEffect(() => {
    const getCustomer = async () => {
      let retrievedCustomers;
      if (user) {
        retrievedCustomers = await retrieveCustomer(user.id);
      }
      if (retrievedCustomers) {
        setFetchedCustomer(retrievedCustomers.users[0]);
      }
    };

    const getProduct = async () => {
      const retrievedProduct = await retrieveProduct();

      setProduct(retrievedProduct.products[0]);
    };

    const getProductsByCategory = async () => {
      const allProducts = await retrieveProductsByCategory();
      if (allProducts) {
        setProducts(allProducts.products);
      }
    };

    getCustomer();
    getProduct();
    getProductsByCategory();
  }, [productId]);

  const retrieveProductsByCategory = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/product/fetch/category-wise?categoryId=" +
        categoryId
    );
    console.log(response.data);
    return response.data;
  };

  const saveProductOffer = (amount, e) => {
    fetch("http://localhost:8080/api/product/offer/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + customer_jwtToken,
      },
      body: JSON.stringify({
        amount: amount,
        userId: user.id,
        productId: productId,
      }),
    }).then((result) => {
      result.json().then((res) => {
        if (res.success) {
          toast.success(res.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            navigate("/customer/bid/all");
          }, 2000); // Redirect after 3 seconds
        } else if (!res.success) {
          toast.error(res.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            window.location.reload(true);
          }, 2000); // Redirect after 3 seconds
        } else {
          toast.error("Error en el servidor", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            window.location.reload(true);
          }, 2000); // Redirect after 3 seconds
        }
      });
    });
  };

  const addproductOffer = (e) => {
    e.preventDefault();
    if (user == null) {
      toast.error("Inicie sesión como cliente para ofertar por cualquier producto", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (product.seller.id === user.id) {
      toast.error("No puedes ofertar en tu propio producto!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (amount > fetchedCustomer.walletAmount) {
      toast.error("Fondos insuficientes en tu billetera!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      saveProductOffer(amount);
      setAmount("");
    }
  };

  const sellerProductPage = () => {
    console.log(product.seller.firstName);
    navigate(
      `/product/seller/${product.seller.id}/${product.seller.firstName}`,
      {
        state: product.seller,
      }
    );
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  return (
    <div className="container-fluid">
      <div class="row">
        <div class="col-sm-3 mt-2 admin">
          <div class="card form-card custom-bg shadow-lg">
            <ProductCarousel
              item={{
                image1: product.image1,
                image2: product.image2,
                image3: product.image3,
              }}
            />
          </div>
        </div>
        <div class="col-sm-6 mt-2">
          <div class="card form-card custom-bg shadow-lg">
            <div
              className="card-header bg-color custom-bg-text "
              style={{
                borderRadius: "1em",
                height: "50px",
              }}
            >
              <h3 class="card-title">{product.name}</h3>
            </div>

            <div class="card-body text-left text-color">
              <div class="text-left mt-3">
                <h3>Descripción :</h3>
                <h5 class="card-text">{product.description}</h5>
              </div>
            </div>
            <div class="d-flex justify-content-between text-color ms-3 me-3">
              <div class="">
                <h3>Expiración de Subasta:</h3>
                <h4 class="card-text">
                  {formatDateFromEpoch(product.endDate)}
                </h4>
              </div>
              <div class="">
                <div>
              {/*  <h3>Estado:</h3> */}  
                </div>
             {/*   <h4 class="card-text">{product.status}</h4> */}
              </div>
            </div>

            <div class="card-body text-left text-color">
              <div class="text-left mt-3">
                <h3>Detalles del Vendedor:</h3>
              </div>

              <div className="d-flex justify-content-left">
                <h4 class="card-text">
                  <b className="text-color" onClick={sellerProductPage}>
                    Nombre: {product.seller.firstName + " "}
                  </b>
                </h4>
                <h4 class="card-text ms-4">
                  Contact: {product.seller.emailId + " "}
                </h4>
              </div>
            </div>

            <div class="card-footer custom-bg">
              <div className="d-flex justify-content-between">
                <div className="text-center text-color">
                  <h3>
                    <span>
                      <h4>Precio de Entrada : Q{product.price}</h4>
                    </span>
                  </h3>
                </div>
                <div className="text-color">
                  <p class="ml-2">
                    {(() => {
                      if (product.quantity > 0) {
                        return <b>Existencias : {product.quantity}</b>;
                      } else {
                        return (
                          <b className="text-danger">Existencias : Out Of Stock!!!</b>
                        );
                      }
                    })()}
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <div>
                  <form class="row g-3" onSubmit={addproductOffer}>
                    <div class="col-auto">
                      <input
                        type="number"
                        class="form-control"
                        placeholder="Ingrese Monto a Ofertar..."
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}
                        required
                      />
                    </div>
                    <div class="col-auto">
                      <input
                        type="submit"
                        className="btn bg-color custom-bg-text mb-3"
                        value="Ofertar"
                      />
                      <ToastContainer />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-3 mt-2">
          <ProductOffers />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-12">
          <h2>Productos Relacionados:</h2>
          <div className="row row-cols-1 row-cols-md-4 g-4">
            {products.map((product) => {
              return <ProductCard item={product} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
