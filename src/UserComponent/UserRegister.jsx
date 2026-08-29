import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

// Listado oficial de los 22 departamentos de Guatemala
const departamentosGuatemala = [
  "Alta Verapaz",
  "Baja Verapaz",
  "Chimaltenango",
  "Chiquimula",
  "El Progreso",
  "Escuintla",
  "Guatemala",
  "Huehuetenango",
  "Izabal",
  "Jalapa",
  "Jutiapa",
  "Petén",
  "Quetzaltenango",
  "Quiché",
  "Retalhuleu",
  "Sacatepéquez",
  "San Marcos",
  "Santa Rosa",
  "Sololá",
  "Suchitepéquez",
  "Totonicapán",
  "Zacapa"
];

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
    let { name, value } = e.target;

    // Si es el campo de teléfono, filtramos para permitir solo números y un máximo de 8 dígitos
    if (name === "phoneNo") {
      value = value.replace(/\D/g, "").slice(0, 8);
    }

    setUser({ ...user, [name]: value });
  };

  const saveUser = (e) => {
    e.preventDefault();

    // 1. Validación estricta de correo electrónico con RegEx
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.emailId)) {
      toast.warning("Por favor, ingresa un correo electrónico válido.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // 2. Validación estricta de teléfono (exactamente 8 dígitos)
    if (user.phoneNo.length !== 8) {
      toast.warning("El número de teléfono debe tener exactamente 8 dígitos.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // 3. Validación de contraseña (mínimo 6 caracteres)
    if (user.password.length < 6) {
      toast.warning("La contraseña debe tener al menos 6 caracteres.", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

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

                {/* Fila 2: Correo electrónico | Teléfono */}
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
                    NÚMERO DE TELÉFONO (8 dígitos)
                  </label>
                  <input
                      type="text"
                      inputMode="numeric"
                      className="form-control shadow-none"
                      id="phoneNo"
                      name="phoneNo"
                      placeholder="Ej. 5123-4567"
                      maxLength="8"
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
                  <select
                      className="form-select shadow-none"
                      id="city"
                      name="city"
                      onChange={handleUserInput}
                      value={user.city}
                      required
                  >
                    <option value="" disabled>
                      Selecciona un departamento...
                    </option>
                    {departamentosGuatemala.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                    ))}
                  </select>
                </div>

                {/* Fila 4: Dirección */}
                <div className="col-12 text-dark">
                  <label htmlFor="street" className="form-label small fw-bold text-secondary">
                    DIRECCIÓN (Municipio, Zona, Calle y No. de Casa)
                  </label>
                  <textarea
                      className="form-control shadow-none"
                      id="street"
                      name="street"
                      rows="2"
                      placeholder="Ej. Mixco, Zona 4, 10 calle 4-50"
                      onChange={handleUserInput}
                      value={user.street}
                      required
                  />
                </div>

                {/* Fila 5: Contraseña Aislada con botón ver/ocultar y validación */}
                <div className="col-12 text-dark">
                  <label htmlFor="password" className="form-label small fw-bold text-secondary">
                    CONTRASEÑA (Mínimo 6 caracteres)
                  </label>
                  <div className="input-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control shadow-none border-end-0"
                        id="password"
                        name="password"
                        placeholder="Mínimo 6 caracteres"
                        minLength="6"
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
