import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div>
      <div class="container my-5">
        <footer class="text-center text-lg-start text-color site-footer">
          <div class="container-fluid p-4 pb-0">
            <section class="">
              <div class="row">
                <div class="col-lg-4 col-md-6 mb-4 mb-md-0">
                  <h5 class="text-uppercase text-color">
                    PLATAFORMA DE SUBASTAS EN LINEA
                  </h5>

                  <p>
                  Bienvenido a nuestro centro de subastas en línea, donde los vendedores se anuncian,
                  los compradores ofertan y se desarrollan emocionantes subastas. Explore, participe
                  y oferte con inteligencia para vivir experiencias inigualables.
                  </p>
                </div>

                <div class="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 class="text-uppercase text-color-4">Alexander Sánchez</h5>

                  
                </div>

                <div class="col-lg-2 col-md-6 mb-4 mb-md-0">
                  <h5 class="text-uppercase text-color-4">sanchezalexanderv@gmail.com</h5>

                 
                </div>

               

                
              </div>
            </section>

            <hr class="mb-4" />

            <section class="">
              <p class="d-flex justify-content-center align-items-center">
                <span class="me-3 text-color">Inicia Sesión Aquí</span>
                <Link to="/user/login" class="active">
                  <button
                    type="button"
                    class="btn btn-outline-light btn-rounded bg-color custom-bg-text"
                  >
                    Iniciar Sesión
                  </button>
                </Link>
              </p>
            </section>

            <hr class="mb-4" />
          </div>

         
        </footer>
      </div>
    </div>
  );
};

export default Footer;
