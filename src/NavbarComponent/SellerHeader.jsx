import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SellerHeader = () => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-seller"));
  console.log(user);

  const sellerLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-seller");
    sessionStorage.removeItem("seller-jwtToken");
    window.location.reload(true);
    setTimeout(() => {
      navigate("/home");
    }, 2000); // Redirect after 3 seconds
  };
  return (
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      <li class="nav-item">
        <Link
          to="/seller/order/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Ventas</b>
        </Link>
      </li>
      <li class="nav-item">
        <Link
          to="/seller/delivery/register"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Register Delivery</b>
        </Link>
      </li>
      <li class="nav-item">
        <Link
          to="/seller/delivery-person/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">View Delivery Persons</b>
        </Link>
      </li>
      <li class="nav-item">
        <Link to="/product/add" class="nav-link active" aria-current="page">
          <b className="text-color">Add Product</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to="/seller/product/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">View My Products</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to=""
          class="nav-link active"
          aria-current="page"
          onClick={sellerLogout}
        >
          <b className="text-color">Logout</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default SellerHeader;
