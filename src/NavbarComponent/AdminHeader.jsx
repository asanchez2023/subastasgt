import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminHeader = () => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-admin"));
  console.log(user);

  const adminLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-admin");
    sessionStorage.removeItem("admin-jwtToken");
    window.location.reload(true);
    setTimeout(() => {
      navigate("/home");
    }, 2000); // Redirect after 3 seconds
  };
  return (
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      <li class="nav-item">
        <Link
          to="/user/admin/register"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Registrar Administrador</b>
        </Link>
      </li>
      <li class="nav-item">
        <Link to="/category/add" class="nav-link active" aria-current="page">
          <b className="text-color"> Agregar Categoría</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link to="/admin/order/all" class="nav-link active" aria-current="page">
          <b className="text-color">Órdenes</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to="/admin/product/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Productos</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to="/admin/category/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Categorías</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to="/admin/delivery-person/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Envíos</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to="/admin/customer/all"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Ver usuarios</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link
          to=""
          class="nav-link active"
          aria-current="page"
          onClick={adminLogout}
        >
          <b className="text-color">Cerrar Sesión</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default AdminHeader;
