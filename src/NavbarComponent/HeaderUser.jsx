import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderUser = () => {
  let navigate = useNavigate();

    const userLogout = () => {
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
          to="/seller/order/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Pedidos</b>
        </Link>
      </li>
      <li class="nav-item">
        <Link
          to="/seller/delivery/register"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Registrar Repartidor</b>
        </Link>
      </li>
      <li class="nav-item">
        <Link
          to="/seller/delivery-person/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Repartidores</b>
        </Link>
      </li>
      <li class="nav-item">
        <Link to="/product/add" class="nav-link active" aria-current="page">
          <b className="text-color">Agregar Producto</b>
        </Link>
      </li>
      <li class="nav-item">
        <Link
          to="/seller/product/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Mis Productos</b>
        </Link>
      </li>
      <li class="nav-item">
        <Link
          to="/customer/bid/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Mis Ofertas</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link to="/customer/order" class="nav-link active" aria-current="page">
          <b className="text-color">Mis Órdenes</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link to="/customer/wallet" class="nav-link active" aria-current="page">
          <b className="text-color">Billetera</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to=""
          class="nav-link active"
          aria-current="page"
          onClick={userLogout}
        >
          <b className="text-color">Cerrar Sesión</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default HeaderUser;
