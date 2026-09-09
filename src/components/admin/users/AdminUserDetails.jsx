/* ============================================================
   ADMIN USER DETAILS
   Detalle de usuario.
   ============================================================ */

import {
  useState
} from "react";


function AdminUserDetails({
  user,
  onClose,
  onPromote,
  onDemote,
  promoting
}) {

  /*
  ============================================================
  ESTADO
  ============================================================
  */

  const [
    showPromotionConfirm,
    setShowPromotionConfirm
  ] = useState(false);


  /*
  ============================================================
  FECHA
  ============================================================
  */

  const formatDate =
    (
      value
    ) => {

      if (
        !value
      ) {

        return "No disponible";

      }


      const date =
        new Date(
          value
        );


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return "No disponible";

      }


      return date.toLocaleString(
        "es-MX",
        {
          dateStyle:
            "medium",

          timeStyle:
            "short"
        }
      );

    };


  /*
  ============================================================
  TIPO DE CAMBIO
  ============================================================
  */

  const isAdmin =
    user?.role === "admin";


  /*
  ============================================================
  ABRIR CONFIRMACIÓN
  ============================================================
  */

  const handleOpenPromotionConfirm =
    () => {

      if (
        !user ||
        promoting
      ) {

        return;

      }


      setShowPromotionConfirm(
        true
      );

    };


  /*
  ============================================================
  CERRAR CONFIRMACIÓN
  ============================================================
  */

  const handleClosePromotionConfirm =
    () => {

      if (
        promoting
      ) {

        return;

      }


      setShowPromotionConfirm(
        false
      );

    };


  /*
  ============================================================
  CONFIRMAR CAMBIO DE ROL
  ============================================================
  */

  const handleConfirmPromotion =
    async () => {

      if (
        !user ||
        promoting
      ) {

        return;

      }


      let success =
        false;


      /*
      ========================================================
      ADMINISTRADOR → USUARIO
      ========================================================
      */

      if (
        isAdmin
      ) {

        success =
          await onDemote?.(
            user
          );

      }


      /*
      ========================================================
      USUARIO → ADMINISTRADOR
      ========================================================
      */

      else {

        success =
          await onPromote?.(
            user
          );

      }


      if (
        success
      ) {

        setShowPromotionConfirm(
          false
        );

      }

    };


  /*
  ============================================================
  RENDER
  ============================================================
  */

  return (

    <>

      {/* ======================================================
          OVERLAY
          ====================================================== */}

      <div
        className="
          admin-user-details-overlay
        "
        onClick={
          onClose
        }
        aria-hidden="true"
      ></div>


      {/* ======================================================
          PANEL
          ====================================================== */}

      <aside
        className="
          admin-user-details
        "
        aria-label="
          Información del usuario
        "
      >

        {/* ====================================================
            HEADER
            ==================================================== */}

        <div
          className="
            admin-user-details-header
          "
        >

          <div>

            <span>
              Administración
            </span>


            <h2>
              Información del usuario
            </h2>

          </div>


          <button
            type="button"
            className="
              admin-user-details-close
            "
            onClick={
              onClose
            }
            aria-label="
              Cerrar información
            "
          >

            <i
              className="
                bi
                bi-x-lg
              "
            ></i>

          </button>

        </div>


        {/* ====================================================
            PERFIL
            ==================================================== */}

        <div
          className="
            admin-user-details-profile
          "
        >

          <div
            className="
              admin-user-details-avatar
            "
          >

            {user.photoURL ? (

              <img
                src={
                  user.photoURL
                }
                alt={
                  `Foto de ${
                    user.name ||
                    "usuario"
                  }`
                }
              />

            ) : (

              <span>

                {(user.name || "U")
                  .charAt(0)
                  .toUpperCase()}

              </span>

            )}

          </div>


          <h3>
            {
              user.name ||
              "Sin nombre"
            }
          </h3>


          <p>
            {
              user.email ||
              "Sin correo"
            }
          </p>

        </div>


        {/* ====================================================
            INFORMACIÓN
            ==================================================== */}

        <div
          className="
            admin-user-details-info
          "
        >

          {/* ==================================================
              ROL
              ================================================== */}

          <div
            className="
              admin-user-details-item
            "
          >

            <span>
              Rol
            </span>


            <strong>

              {isAdmin
                ? "Administrador"
                : "Usuario"
              }

            </strong>


            {/* ==================================================
                CAMBIO DE ROL
                ================================================== */}

            <button
              type="button"
              className="
                admin-user-promote-button
              "
              onClick={
                handleOpenPromotionConfirm
              }
              disabled={
                promoting
              }
            >

              <span
                className="
                  admin-user-promote-button-icon
                "
              >

                <i
                  className={
                    isAdmin
                      ? "bi bi-person-dash"
                      : "bi bi-shield-check"
                  }
                ></i>

              </span>


              <span
                className="
                  admin-user-promote-button-content
                "
              >

                <strong>

                  {isAdmin
                    ? "Convertir en usuario"
                    : "Convertir en administrador"
                  }

                </strong>


                <small>

                  {isAdmin
                    ? "Revocar permisos administrativos"
                    : "Otorgar permisos administrativos"
                  }

                </small>

              </span>


              <i
                className="
                  bi
                  bi-chevron-right
                  admin-user-promote-button-arrow
                "
              ></i>

            </button>

          </div>


          {/* ==================================================
              ESTADO
              ================================================== */}

          <div
            className="
              admin-user-details-item
            "
          >

            <span>
              Estado
            </span>


            <strong
              className={
                user.disabled
                  ? "danger"
                  : "success"
              }
            >

              {user.disabled
                ? "Deshabilitado"
                : "Activo"
              }

            </strong>

          </div>


          {/* ==================================================
              CORREO
              ================================================== */}

          <div
            className="
              admin-user-details-item
            "
          >

            <span>
              Correo electrónico
            </span>


            <strong>

              {user.emailVerified
                ? "Verificado"
                : "Sin verificar"
              }

            </strong>

          </div>


          {/* ==================================================
              IDENTIFICADOR
              ================================================== */}

          <div
            className="
              admin-user-details-item
            "
          >

            <span>
              Identificador
            </span>


            <strong
              className="
                admin-user-details-uid
              "
            >

              {
                user.uid ||
                "No disponible"
              }

            </strong>

          </div>


          {/* ==================================================
              FECHA DE REGISTRO
              ================================================== */}

          <div
            className="
              admin-user-details-item
            "
          >

            <span>
              Fecha de registro
            </span>


            <strong>

              {formatDate(
                user.createdAt
              )}

            </strong>

          </div>


          {/* ==================================================
              ÚLTIMO ACCESO
              ================================================== */}

          <div
            className="
              admin-user-details-item
            "
          >

            <span>
              Último acceso
            </span>


            <strong>

              {formatDate(
                user.lastLoginAt
              )}

            </strong>

          </div>

        </div>


        {/* ====================================================
            FOOTER
            ==================================================== */}

        <div
          className="
            admin-user-details-footer
          "
        >

          <span>
            Identificación de cuenta
          </span>

        </div>

      </aside>


      {/* ======================================================
          MODAL DE CONFIRMACIÓN
          ====================================================== */}

      {showPromotionConfirm && (

        <div
          className="
            admin-promotion-modal-overlay
          "
          role="presentation"
          onClick={
            handleClosePromotionConfirm
          }
        >

          <div
            className="
              admin-promotion-modal
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="
              admin-promotion-title
            "
            onClick={
              event =>
                event.stopPropagation()
            }
          >

            {/* ==================================================
                ICONO
                ================================================== */}

            <div
              className="
                admin-promotion-modal-icon
              "
            >

              <i
                className={
                  isAdmin
                    ? "bi bi-person-dash"
                    : "bi bi-shield-lock"
                }
              ></i>

            </div>


            {/* ==================================================
                CONTENIDO
                ================================================== */}

            <div
              className="
                admin-promotion-modal-content
              "
            >

              <span
                className="
                  admin-promotion-modal-eyebrow
                "
              >
                Cambio de privilegios
              </span>


              <h3
                id="
                  admin-promotion-title
                "
              >

                {isAdmin
                  ? "Convertir en usuario"
                  : "Convertir en administrador"
                }

              </h3>


              <p>

                {isAdmin

                  ? (
                    <>
                      Estás a punto de revocar los
                      permisos administrativos de:
                    </>
                  )

                  : (
                    <>
                      Estás a punto de otorgar permisos
                      administrativos a:
                    </>
                  )

                }

              </p>


              {/* ================================================
                  USUARIO
                  ================================================ */}

              <div
                className="
                  admin-promotion-modal-user
                "
              >

                <div
                  className="
                    admin-promotion-modal-avatar
                  "
                >

                  {user.photoURL ? (

                    <img
                      src={
                        user.photoURL
                      }
                      alt=""
                    />

                  ) : (

                    <span>

                      {(user.name || "U")
                        .charAt(0)
                        .toUpperCase()}

                    </span>

                  )}

                </div>


                <div>

                  <strong>
                    {
                      user.name ||
                      "Sin nombre"
                    }
                  </strong>


                  <span>
                    {
                      user.email ||
                      "Sin correo"
                    }
                  </span>

                </div>

              </div>


              {/* ================================================
                  ADVERTENCIA
                  ================================================ */}

              <div
                className="
                  admin-promotion-modal-warning
                "
              >

                <i
                  className="
                    bi
                    bi-exclamation-triangle-fill
                  "
                ></i>


                <div>

                  <strong>
                    Acción administrativa
                  </strong>


                  <span>

                    {isAdmin

                      ? (
                        <>
                          Este usuario dejará de tener
                          acceso a las funciones
                          administrativas de la plataforma.
                        </>
                      )

                      : (
                        <>
                          Este usuario podrá acceder a las
                          funciones administrativas de la
                          plataforma.
                        </>
                      )

                    }

                  </span>

                </div>

              </div>

            </div>


            {/* ==================================================
                ACCIONES
                ================================================== */}

            <div
              className="
                admin-promotion-modal-actions
              "
            >

              <button
                type="button"
                className="
                  admin-promotion-cancel-button
                "
                onClick={
                  handleClosePromotionConfirm
                }
                disabled={
                  promoting
                }
              >
                Cancelar
              </button>


              <button
                type="button"
                className="
                  admin-promotion-confirm-button
                "
                onClick={
                  handleConfirmPromotion
                }
                disabled={
                  promoting
                }
              >

                {promoting ? (

                  <>

                    <i
                      className="
                        bi
                        bi-arrow-repeat
                      "
                    ></i>

                    Convirtiendo...

                  </>

                ) : (

                  <>

                    <i
                      className={
                        isAdmin
                          ? "bi bi-person-dash"
                          : "bi bi-shield-check"
                      }
                    ></i>


                    {isAdmin
                      ? "Confirmar usuario"
                      : "Confirmar administrador"
                    }

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}


export default AdminUserDetails;