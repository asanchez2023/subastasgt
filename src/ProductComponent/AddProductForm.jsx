import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const AddProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [selectedImage1, setSelectImage1] = useState(null);
  const [selectedImage2, setSelectImage2] = useState(null);
  const [selectedImage3, setSelectImage3] = useState(null);

  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [preview3, setPreview3] = useState(null);

  const seller = JSON.parse(sessionStorage.getItem("active-customer"));
  const seller_jwtToken = sessionStorage.getItem("jwtToken"); // <--- Cambiado de "customer-jwtToken" a "jwtToken"


  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    sellerId: "",
    endDate: "",
  });

  const retrieveAllCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/category/fetch/all`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    const getAllCategories = async () => {
      const resCategory = await retrieveAllCategories();
      if (resCategory) {
        setCategories(resCategory.categories || []);
      }
    };
    getAllCategories();
  }, []);

  const handleInput = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (file, setImageState, setPreviewState) => {
    if (file) {
      setImageState(file);
      setPreviewState(URL.createObjectURL(file));
    }
  };

  const saveProduct = (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("jwtToken"); // <--- Clave correcta según la captura

    if (!seller || !token) {
      toast.error("Sesión inválida o token no encontrado", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    const formattedEndDate = new Date(endDate).getTime();

    formData.append("image1", selectedImage1);
    formData.append("image2", selectedImage2);
    formData.append("image3", selectedImage3);
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("categoryId", product.categoryId);
    formData.append("sellerId", seller.id);
    formData.append("endDate", formattedEndDate);

    axios
        .post(`${API_BASE_URL}/api/product/add`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          let response = resp.data;
          if (response.success) {
            toast.success(response.responseMessage || "Producto registrado exitosamente", {
              position: "top-center",
              autoClose: 1000,
            });
            setTimeout(() => {
              navigate("/home");
            }, 1500);
          } else {
            toast.error(response.responseMessage || "Error al guardar el producto", {
              position: "top-center",
              autoClose: 1000,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error en el servidor al intentar registrar el producto", {
            position: "top-center",
            autoClose: 1000,
          });
        });
  };



  const brandDarkBlue = "#09172A";

  // Dropzone interactivo
  const ImageDropzone = ({ label, preview, setFile, setPreview }) => (
      <div className="col-md-4">
        <label className="form-label fw-semibold text-dark small">{label}</label>
        <label
            className="d-flex flex-column align-items-center justify-content-center border rounded-3 bg-light overflow-hidden"
            style={{
              height: "140px",
              cursor: "pointer",
              borderStyle: preview ? "solid" : "dashed",
              borderColor: "#cbd5e1",
              borderWidth: "2px"
            }}
        >
          {preview ? (
              <img
                  src={preview}
                  alt="Vista previa"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
              />
          ) : (
              <div className="text-secondary text-center px-2">
                <svg width="28" height="28" fill="currentColor" className="mb-2 text-primary opacity-75" viewBox="0 0 16 16">
                  <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                  <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                </svg>
                <div className="small fw-medium">Haz clic para subir</div>
              </div>
          )}
          <input
              className="position-absolute opacity-0"
              style={{ width: "1px", height: "1px", zIndex: -1 }}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0], setFile, setPreview)}
              required={!preview}
          />
        </label>
      </div>
  );

  return (
      <div className="container py-4">
        <ToastContainer />
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 col-xl-8">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

              {/* Header */}
              <div
                  className="card-header text-white text-center py-3"
                  style={{ backgroundColor: brandDarkBlue }}
              >
                <h4 className="m-0 fw-bold fs-5">Publicar Nuevo Producto</h4>
                <p className="m-0 text-white opacity-75 small">Ingresa la información para iniciar la subasta</p>
              </div>

              <div className="card-body p-4 p-md-5 bg-white">
                <form onSubmit={saveProduct}>

                  {/* SECCIÓN 1: Detalles Generales */}
                  <div className="mb-4">
                    <h6 className="text-uppercase text-secondary fw-bolder mb-3" style={{ fontSize: "0.8rem", letterSpacing: "0.8px", color: "#475569" }}>
                      1. Detalles del Producto
                    </h6>

                    <div className="row g-3">
                      <div className="col-12">
                        <label htmlFor="name" className="form-label fw-semibold text-dark small">
                          Nombre del Producto *
                        </label>
                        <input
                            type="text"
                            className="form-control form-control-lg border-light-subtle shadow-none fs-6"
                            id="name"
                            name="name"
                            placeholder="Ej. Laptop Gaming Asus ROG Strix..."
                            onChange={handleInput}
                            value={product.name}
                            required
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="description" className="form-label fw-semibold text-dark small">
                          Descripción Detallada *
                        </label>
                        <textarea
                            className="form-control border-light-subtle shadow-none fs-6"
                            id="description"
                            name="description"
                            rows="3"
                            maxLength={1000}
                            placeholder="Especifica el estado, detalles técnicos, accesorios incluidos..."
                            onChange={handleInput}
                            value={product.description}
                            required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark small">Categoría *</label>
                        <select
                            name="categoryId"
                            onChange={handleInput}
                            className="form-select border-light-subtle shadow-none fs-6"
                            value={product.categoryId}
                            required
                        >
                          <option value="">Seleccione Categoría</option>
                          {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="quantity" className="form-label fw-semibold text-dark small">
                          Cantidad Disponible *
                        </label>
                        <input
                            type="number"
                            min="1"
                            className="form-control border-light-subtle shadow-none fs-6"
                            id="quantity"
                            name="quantity"
                            placeholder="1"
                            onChange={handleInput}
                            value={product.quantity}
                            required
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="my-4 text-light-subtle" />

                  {/* SECCIÓN 2: Precio y Tiempo de Subasta */}
                  <div className="mb-4">
                    <h6 className="text-uppercase text-secondary fw-bolder mb-3" style={{ fontSize: "0.8rem", letterSpacing: "0.8px", color: "#475569" }}>
                      2. Precio y Expiración
                    </h6>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="price" className="form-label fw-semibold text-dark small">
                          Precio Base / Inicial (Q) *
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0 text-muted">Q</span>
                          <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="form-control border-start-0 border-light-subtle shadow-none fs-6"
                              id="price"
                              name="price"
                              placeholder="0.00"
                              onChange={handleInput}
                              value={product.price}
                              required
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="endDate" className="form-label fw-semibold text-dark small">
                          Fecha y Hora de Cierre *
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control border-light-subtle shadow-none fs-6"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="my-4 text-light-subtle" />

                  {/* SECCIÓN 3: Galería de Imágenes */}
                  <div className="mb-4">
                    <h6 className="text-uppercase text-secondary fw-bolder mb-3" style={{ fontSize: "0.8rem", letterSpacing: "0.8px", color: "#475569" }}>
                      3. Fotografías del Producto (Mínimo 3)
                    </h6>

                    <div className="row g-3">
                      <ImageDropzone
                          label="Imagen Principal *"
                          preview={preview1}
                          setFile={setSelectImage1}
                          setPreview={setPreview1}
                      />
                      <ImageDropzone
                          label="Imagen Secundaria 1 *"
                          preview={preview2}
                          setFile={setSelectImage2}
                          setPreview={setPreview2}
                      />
                      <ImageDropzone
                          label="Imagen Secundaria 2 *"
                          preview={preview3}
                          setFile={setSelectImage3}
                          setPreview={setPreview3}
                      />
                    </div>
                  </div>

                  {/* Botones de Acción: Guardar + Cancelar */}
                  <div className="mt-5 d-flex flex-column gap-2">
                    <button
                        type="submit"
                        className="btn btn-lg w-100 fw-bold shadow-sm rounded-3 py-2-5 fs-6 text-white"
                        style={{ backgroundColor: brandDarkBlue, borderColor: brandDarkBlue }}
                    >
                      Publicar Producto en Subasta
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-link text-decoration-none text-secondary fw-medium py-1 fs-6"
                    >
                      Cancelar
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AddProductForm;
