import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const UserRegister = () => {
  const navigate = useNavigate();

  const seller = JSON.parse(sessionStorage.getItem("active-customer"));

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    phoneNo: "",
    street: "",
    city: "",
    pincode: "",
    role: "",
  });

  // Estado para alternar visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (document.URL.indexOf("customer") != -1) {
      setUser((prev) => ({ ...prev, role: "Customer" }));
    } else if (document.URL.indexOf("delivery") != -1) {
      setUser((prev) => ({ ...prev, role: "Delivery" }));
    }
  }, []);

  const handleUserInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveUser = (e) => {
    e.preventDefault();

    if (user.role === "Delivery" && seller) {
      user.sellerId = seller.id;
    }

    fetch(`${API_BASE_URL}/api/user/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
        .then((result) => {
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
                navigate("/user/login");
              }, 1000);
            } else {
              toast.error(res.responseMessage || "Error en el servidor", {
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
              }, 1000);
            }
          });
        })
        .catch((error) => {
          console.error(error);
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
          }, 1000);
        });
  };

  const brandDarkBlue = "#09172A";

  return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-sm border-0 rounded-4 bg-white p-4 p-md-5">

              {/* Título Limpio y Directo */}
              <div className="mb-4 text-center">
                <h2 className="fw-bold text-dark fs-2" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                  Crear una cuenta
                </h2>
                <p className="text-muted small m-0">
                  Ingresa tus datos para registrarte en la plataforma
                </p>
              </div>

              <form className="row g-3" onSubmit={saveUser}>

                {/* Fila 1: Nombre | Apellido */}
                <div className="col-md-6 text-dark">
                  <label htmlFor="firstName" className="form-label small fw-bold text-secondary">
                    NOMBRE
                  </label>
                  <input
                      type="text"
                      className="form-control shadow-none"
                      id="firstName"
                      name="firstName"
                      placeholder="Ej. Juan"
                      onChange={handleUserInput}
                      value={user.firstName}
                      required
                  />
                </div>

                <div className="col-md-6 text-dark">
                  <label htmlFor="lastName" className="form-label small fw-bold text-secondary">
                    APELLIDO
                  </label>
                  <input
                      type="text"
                      className="form-control shadow-none"
                      id="lastName"
                      name="lastName"
                      placeholder="Ej. Pérez"
                      onChange={handleUserInput}
                      value={user.lastName}
                      required
                  />
                </div>

                {/* Fila 2: Correo electrónico | Teléfono (Tipo tel sin flechas) */}
                <div className="col-md-6 text-dark">
                  <label htmlFor="emailId" className="form-label small fw-bold text-secondary">
                    CORREO ELECTRÓNICO
                  </label>
                  <input
                      type="email"
                      className="form-control shadow-none"
                      id="emailId"
                      name="emailId"
                      placeholder="correo@ejemplo.com"
                      onChange={handleUserInput}
                      value={user.emailId}
                      required
                  />
                </div>

                <div className="col-md-6 text-dark">
                  <label htmlFor="phoneNo" className="form-label small fw-bold text-secondary">
                    NÚMERO DE TELÉFONO
                  </label>
                  <input
                      type="tel"
                      className="form-control shadow-none"
                      id="phoneNo"
                      name="phoneNo"
                      placeholder="+502 0000-0000"
                      onChange={handleUserInput}
                      value={user.phoneNo}
                      required
                  />
                </div>

                {/* Fila 3: Departamento */}
                <div className="col-md-6 text-dark">
                  <label htmlFor="city" className="form-label small fw-bold text-secondary">
                    DEPARTAMENTO
                  </label>
                  <input
                      type="text"
                      className="form-control shadow-none"
                      id="city"
                      name="city"
                      placeholder="Ej. Guatemala"
                      onChange={handleUserInput}
                      value={user.city}
                      required
                  />
                </div>

                {/* Fila 4: Dirección (Abarcando ancho completo) */}
                <div className="col-12 text-dark">
                  <label htmlFor="street" className="form-label small fw-bold text-secondary">
                    DIRECCIÓN
                  </label>
                  <textarea
                      className="form-control shadow-none"
                      id="street"
                      name="street"
                      rows="2"
                      placeholder="Ej. 10 calle 4-50 zona 10"
                      onChange={handleUserInput}
                      value={user.street}
                      required
                  />
                </div>

                {/* Fila 5: Contraseña Aislada con botón ver/ocultar */}
                <div className="col-12 text-dark">
                  <label htmlFor="password" className="form-label small fw-bold text-secondary">
                    CONTRASEÑA
                  </label>
                  <div className="input-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control shadow-none border-end-0"
                        id="password"
                        name="password"
                        placeholder="Mínimo 6 caracteres"
                        onChange={handleUserInput}
                        value={user.password}
                        required
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary border-start-0 bg-white text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}>
                        {showPassword ? " 🙈" : " 👁️"}
                      </i>
                    </button>
                  </div>
                </div>

                {/* Botón de Acción Profesional (Ancho Completo) */}
                <div className="col-12 mt-4">
                  <button
                      type="submit"
                      className="btn text-white w-100 py-2.5 fw-bold shadow-sm rounded-3"
                      style={{ backgroundColor: brandDarkBlue, borderColor: brandDarkBlue, fontSize: "1rem" }}
                  >
                    Registrar Ahora
                  </button>
                </div>

                <ToastContainer />
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserRegister;
