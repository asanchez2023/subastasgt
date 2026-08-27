import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeliveryHeader = () => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-delivery"));
  console.log(user);

  const deliveryLogout = () => {
    toast.success("Sesión Finalizada", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // 1. Limpiar todas las claves de sesión
    sessionStorage.clear();

    // 2. Redirigir de inmediato redirigiendo toda la ventana a /home
    window.location.href = "/home";
  };
  return (
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      <li class="nav-item">
        <Link
          to="/delivery-person/order/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Mis Órdenes de Entrega</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to=""
          class="nav-link active"
          aria-current="page"
          onClick={deliveryLogout}
        >
          <b className="text-color">Cerrar Sesión</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default DeliveryHeader;
