import { Link } from "react-router-dom";
import CategoryNavigator from "../CategoryComponent/CategoryNavigator";
import { API_BASE_URL } from "../config";

const ProductCard = (product) => {
  const descriptionToShow = (description, maxLength) => {
    if (!description) return "";
    if (description.length <= maxLength) {
      return description;
    } else {
      const truncatedText = description.substring(0, maxLength);
      return truncatedText + "...";
    }
  };

  const brandDarkBlue = "#09172A";

  return (
      <div className="col">
        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white">

          {/* Contenedor de Imagen con object-fit: contain para que se vea completa */}
          <div
              className="bg-white d-flex align-items-center justify-content-center p-3 border-bottom"
              style={{ height: "210px", overflow: "hidden" }}
          >
            <img
                src={`${API_BASE_URL}/api/product/` + product.item.image1}
                className="w-100 h-100"
                style={{ objectFit: "contain", objectPosition: "center" }}
                alt={product.item.name}
            />
          </div>

          {/* Cuerpo de la Card */}
          <div className="card-body d-flex flex-column justify-content-between p-3">
            <div>
              {/* Categoría Sutil */}
              <div className="mb-2">
              <span className="badge bg-light text-secondary border fw-normal px-2 py-1" style={{ fontSize: "0.75rem" }}>
                <CategoryNavigator
                    item={{
                      id: product.item.category.id,
                      name: product.item.category.name,
                    }}
                />
              </span>
              </div>

              {/* Nombre del Producto Destacado */}
              <h5
                  className="fw-bold text-dark mb-1 fs-6"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {product.item.name}
              </h5>

              {/* Descripción Breve */}
              <p className="card-text text-muted small mb-3 lh-sm">
                {descriptionToShow(product.item.description, 55)}
              </p>
            </div>
          </div>

          {/* Footer con Precio y CTA */}
          <div className="card-footer bg-white border-top-0 pt-0 pb-3 px-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-secondary" style={{ fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase" }}>
                  Precio Base
                </div>
                <div className="fw-bold text-dark fs-5">
                  Q{product.item.price}
                </div>
              </div>

              <Link
                  to={`/product/${product.item.id}/category/${product.item.category.id}`}
                  className="btn btn-sm fw-bold px-3 py-2 text-white rounded-3 shadow-sm"
                  style={{ backgroundColor: brandDarkBlue, borderColor: brandDarkBlue }}
              >
                Iniciar Oferta
              </Link>
            </div>
          </div>

        </div>
      </div>
  );
};

export default ProductCard;
