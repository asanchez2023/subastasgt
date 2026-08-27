import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const UserLoginForm = () => {
  const navigate = useNavigate();

  const [loginRequest, setLoginRequest] = useState({
    emailId: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleUserInput = (e) => {
    setLoginRequest({ ...loginRequest, [e.target.name]: e.target.value });
  };

  const loginAction = async (e) => {
    e.preventDefault();

    if (!loginRequest.emailId || !loginRequest.password) {
      toast.error("Por favor, ingresa correo y contraseña.", { position: "top-center" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
      });

      const res = await response.json();

      if (res.success && res.jwtToken) {
        // Guardar Token
        sessionStorage.setItem("jwtToken", res.jwtToken);

        // Definir la clave según el rol que devolvió el backend
        const role = res.user.role;
        let userKey = "active-customer";

        if (role === "Admin") {
          userKey = "active-admin";
        } else if (role === "Delivery") {
          userKey = "active-delivery";
        } else if (role === "Customer") {
          userKey = "active-customer";
        }

        // Almacenar el objeto usuario en la clave correspondiente
        sessionStorage.setItem(userKey, JSON.stringify(res.user));

        toast.success(res.responseMessage || "¡Inicio de sesión exitoso!", {
          position: "top-center",
          autoClose: 1000,
        });

        setTimeout(() => {
          navigate("/home");
          window.location.reload(); // Forzar la actualización del Header
        }, 1000);
      } else {
        toast.error(res.responseMessage || "Credenciales incorrectas", {
          position: "top-center",
          autoClose: 1500,
        });
      }
    } catch (error) {
      console.error("Error en la solicitud de login:", error);
      toast.error("Error de conexión con el servidor", {
        position: "top-center",
        autoClose: 1500,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="mt-5 d-flex align-items-center justify-content-center">
        <div className="card border-0 shadow-lg" style={{ width: "24rem", borderRadius: "1rem" }}>
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <h4 className="fw-bold text-dark">Inicio de Sesión</h4>
              <p className="text-muted small">Ingresa tus datos para acceder</p>
            </div>

            <form onSubmit={loginAction}>
              <div className="mb-3 text-start">
                <label htmlFor="emailId" className="form-label fw-semibold">
                  Correo Electrónico
                </label>
                <input
                    type="email"
                    className="form-control py-2"
                    id="emailId"
                    name="emailId"
                    placeholder="ejemplo@correo.com"
                    onChange={handleUserInput}
                    value={loginRequest.emailId}
                    required
                />
              </div>

              <div className="mb-4 text-start">
                <label htmlFor="password" className="form-label fw-semibold">
                  Contraseña
                </label>
                <input
                    type="password"
                    className="form-control py-2"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    onChange={handleUserInput}
                    value={loginRequest.password}
                    autoComplete="current-password"
                    required
                />
              </div>

              <div className="d-grid gap-2">
                <button
                    type="submit"
                    className="btn btn-primary py-2 fw-semibold"
                    disabled={isLoading}
                >
                  {isLoading ? "Ingresando..." : "Iniciar Sesión"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer />
      </div>
  );
};

export default UserLoginForm;
