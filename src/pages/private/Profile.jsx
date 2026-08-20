import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext.jsx";

import "../../styles/private/profile.css";


function Profile() {

  const {
    user
  } = useContext(AuthContext);


  return (

    <div className="private-page-container">

      <div className="private-page-header">

        <span className="private-page-eyebrow">
          Cuenta
        </span>

        <h1>
          Mi perfil
        </h1>

        <p>
          Consulta la información asociada a tu cuenta.
        </p>

      </div>


      <section className="private-card">

        <div className="private-card-header">

          <div className="private-card-icon">
            <i className="bi bi-person-circle" />
          </div>

          <div>

            <h2>
              Información de la cuenta
            </h2>

            <p>
              Datos registrados en tu cuenta.
            </p>

          </div>

        </div>


        <div className="private-info-grid">

          <div className="private-info-item">

            <span>
              Nombre
            </span>

            <strong>
              {user?.name || "Sin nombre"}
            </strong>

          </div>


          <div className="private-info-item">

            <span>
              Correo electrónico
            </span>

            <strong>
              {user?.email || "Sin correo"}
            </strong>

          </div>


          <div className="private-info-item">

            <span>
              Identificador
            </span>

            <strong>
              {user?.uid || "No disponible"}
            </strong>

          </div>


          <div className="private-info-item">

            <span>
              Estado
            </span>

            <strong className="private-status">
              <i className="bi bi-check-circle-fill" />
              Cuenta activa
            </strong>

          </div>

        </div>

      </section>

    </div>

  );

}


export default Profile;