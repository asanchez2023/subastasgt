import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HeaderUser = () => {
    const user = JSON.parse(sessionStorage.getItem("active-customer")) || {};

    const userLogout = () => {
        toast.success("Sesión Finalizada", {
            position: "top-center",
            autoClose: 1000,
        });

        sessionStorage.clear();
        setTimeout(() => {
            window.location.href = "/home";
        }, 800);
    };

    const getInitials = () => {
        if (!user.firstName) return "UT";
        const f = user.firstName.charAt(0).toUpperCase();
        const l = user.lastName ? user.lastName.charAt(0).toUpperCase() : "";
        return `${f}${l}` || "UT";
    };

    return (
        <div className="d-flex align-items-center gap-3 ms-auto me-lg-4">
            <ToastContainer />

            {/* --- SECCIÓN DE GESTIÓN (DROPDOWN) --- */}
            <div className="dropdown">
                <button
                    className="btn btn-sm text-white dropdown-toggle border-0 fw-medium opacity-90 opacity-100-hover"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ fontSize: "0.9rem" }}
                >
                    Gestión
                </button>
                <ul className="dropdown-menu dropdown-menu-dark shadow-lg border-secondary rounded-3 mt-2 small">
                    <li>
                        <h6 className="dropdown-header text-uppercase text-muted" style={{ fontSize: "0.65rem" }}>
                            Vendedor & Envíos
                        </h6>
                    </li>
                    <li>
                        <Link to="/seller/order/all" className="dropdown-item py-2">
                            📦 Pedidos
                        </Link>
                    </li>
                    <li>
                        <Link to="/seller/delivery-person/all" className="dropdown-item py-2">
                            👥 Repartidores
                        </Link>
                    </li>
                    <li>
                        <Link to="/seller/delivery/register" className="dropdown-item py-2">
                            ➕ Registrar Repartidor
                        </Link>
                    </li>
                </ul>
            </div>

            {/* --- BOTÓN DESTACADO: AGREGAR PRODUCTO --- */}
            <Link
                to="/product/add"
                className="btn btn-sm btn-outline-light fw-medium px-3 py-1-5 rounded-pill d-flex align-items-center gap-1 shadow-sm"
                style={{ fontSize: "0.85rem" }}
            >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                <span>Agregar Producto</span>
            </Link>

            {/* --- AVATAR Y DROPDOWN DE PERFIL --- */}
            <div className="dropdown">
                <button
                    className="btn p-0 border-0 bg-transparent d-flex align-items-center gap-2 shadow-none"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <div
                        className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center border border-2 border-white shadow-sm"
                        style={{ width: "36px", height: "36px", fontSize: "0.85rem" }}
                    >
                        {getInitials()}
                    </div>
                </button>

                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border-secondary rounded-4 mt-2 p-2" style={{ minWidth: "210px" }}>
                    {/* Nombre / Correo */}
                    <li className="px-3 py-2 border-bottom border-secondary mb-1">
                        <div className="fw-bold text-white text-truncate" style={{ fontSize: "0.9rem" }}>
                            {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Mi Cuenta"}
                        </div>
                        <div className="text-muted small text-truncate" style={{ fontSize: "0.75rem" }}>
                            {user.emailId || user.email || "Usuario Activo"}
                        </div>
                    </li>

                    {/* Opciones Personales */}
                    <li>
                        <Link to="/customer/wallet" className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2">
                            <span>💳</span> Billetera
                        </Link>
                    </li>
                    <li>
                        <Link to="/customer/order" className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2">
                            <span>🛍️</span> Mis Órdenes
                        </Link>
                    </li>
                    <li>
                        <Link to="/customer/bid/all" className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2">
                            <span>🔨</span> Mis Ofertas
                        </Link>
                    </li>
                    <li>
                        <Link to="/seller/product/all" className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2">
                            <span>🏷️</span> Mis Productos
                        </Link>
                    </li>

                    <li><hr className="dropdown-divider border-secondary my-1" /></li>

                    {/* Cerrar Sesión */}
                    <li>
                        <button
                            onClick={userLogout}
                            className="dropdown-item rounded-2 py-2 text-danger fw-medium d-flex align-items-center gap-2"
                        >
                            <span>🚪</span> Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </div>

        </div>
    );
};

export default HeaderUser;
