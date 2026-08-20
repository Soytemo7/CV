import {
  useContext
} from "react";

import { AuthContext } from "../../context/AuthContext.jsx";
import "../../styles/private/security.css";

function Security() {

  const {
    logoutAll
  } = useContext(AuthContext);
  


  return (

    <div className="private-page-container">

      <div className="private-page-header">

        <span className="private-page-eyebrow">
          Seguridad
        </span>

        <h1>
          Seguridad de la cuenta
        </h1>

        <p>
          Administra los dispositivos, accesos y sesiones
          asociadas a tu cuenta.
        </p>

      </div>


      <section className="private-card">

        <div className="private-card-header">

          <div className="private-card-icon">
            <i className="bi bi-shield-check" />
          </div>

          <div>

            <h2>
              Opciones de seguridad
            </h2>

            <p>
              Administra la seguridad de tu cuenta.
            </p>

          </div>

        </div>


        <div className="private-security-grid">

          <div className="private-security-item">

            <i className="bi bi-laptop" />

            <div>

              <strong>
                Dispositivos
              </strong>

              <span>
                Consulta los dispositivos desde los
                que has iniciado sesión.
              </span>

            </div>

          </div>


          <div className="private-security-item">

            <i className="bi bi-clock-history" />

            <div>

              <strong>
                Historial de accesos
              </strong>

              <span>
                Consulta los últimos accesos registrados.
              </span>

            </div>

          </div>


          <div className="private-security-item">

            <i className="bi bi-bell" />

            <div>

              <strong>
                Alertas de seguridad
              </strong>

              <span>
                Consulta las alertas generadas por
                nuevos dispositivos.
              </span>

            </div>

          </div>


          <div className="private-security-item">

            <i className="bi bi-shield-lock" />

            <div>

              <strong>
                Sesiones activas
              </strong>

              <span>
                Administra las sesiones activas de tu cuenta.
              </span>

            </div>

          </div>

        </div>


        <div className="private-security-action">

          <button
            type="button"
            className="private-danger-button"
            onClick={logoutAll}
          >

            <i className="bi bi-shield-x" />

            Cerrar todas las sesiones

          </button>

        </div>

      </section>

    </div>

  );

}


export default Security