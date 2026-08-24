import {
  useEffect,
  useState,
  useContext
} from "react";

import {
  KeyOutlined,
  PlusOutlined,
  DeleteOutlined,
  SafetyOutlined,
  DesktopOutlined,  
} from "@ant-design/icons";

import {
  Button,
  Empty,
  Spin
} from "antd";

import {
  useNotification
} from "../../../hooks/useNotification";

import {
  AuthContext
} from "../../../context/AuthContext.jsx";

import {
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable
} from "@simplewebauthn/browser";

import "../../../styles/passkey.css";


function PasskeyCard() {

  const {

    getPasskeys,

    registerPasskey,

    removePasskey

  } = useContext(
    AuthContext
  );


  const notification =
    useNotification();


  // ============================================================
  // ESTADO
  // ============================================================

  const [
    passkeys,
    setPasskeys
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    registering,
    setRegistering
  ] = useState(false);


  const [
    deleting,
    setDeleting
  ] = useState(null);


  // ============================================================
  // MODAL REGISTRAR
  // ============================================================

  const [
    modalOpen,
    setModalOpen
  ] = useState(false);


  const [
    passkeyName,
    setPasskeyName
  ] = useState("");


  // ============================================================
  // MODAL ELIMINAR
  // ============================================================

  const [
    deleteModalOpen,
    setDeleteModalOpen
  ] = useState(false);


  const [
    passkeyToDelete,
    setPasskeyToDelete
  ] = useState(null);


  // ============================================================
  // SOPORTE WEBAUTHN
  // ============================================================

  const [
    supported,
    setSupported
  ] = useState(true);


  const [
    platformAvailable,
    setPlatformAvailable
  ] = useState(false);


  // ============================================================
  // CARGAR PASSKEYS
  //
  // Esta función se utiliza después de registrar o eliminar
  // una Passkey.
  // ============================================================

  const loadPasskeys =
    async () => {

      try {

        setLoading(true);


        const result =
          await getPasskeys();


        setPasskeys(
          Array.isArray(result)
            ? result
            : []
        );

      } catch (error) {

        console.error(
          "❌ Error cargando Passkeys:",
          error
        );


        notification.error({

          title:
            "Error",

          description:
            error?.message ||
            "No fue posible cargar las Passkeys.",

          placement:
            "topRight",

          duration:
            8,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });

      } finally {

        setLoading(false);

      }

    };


  // ============================================================
  // DETECTAR SOPORTE WebAuthn
  // ============================================================

  useEffect(() => {

    let cancelled = false;


    const checkSupport =
      async () => {

        const webAuthnSupported =
          browserSupportsWebAuthn();


        if (cancelled) {

          return;

        }


        setSupported(
          webAuthnSupported
        );


        if (!webAuthnSupported) {

          setPlatformAvailable(
            false
          );

          return;

        }


        try {

          const available =
            await platformAuthenticatorIsAvailable();


          if (cancelled) {

            return;

          }


          setPlatformAvailable(
            available
          );

        } catch {

          if (cancelled) {

            return;

          }


          setPlatformAvailable(
            false
          );

        }

      };


    checkSupport();


    return () => {

      cancelled = true;

    };

  }, []);


  // ============================================================
  // CARGA INICIAL DE PASSKEYS
  // ============================================================

  useEffect(() => {

    let cancelled = false;


    const loadInitialPasskeys =
      async () => {

        try {

          const result =
            await getPasskeys();


          if (cancelled) {

            return;

          }


          setPasskeys(
            Array.isArray(result)
              ? result
              : []
          );


        } catch (error) {

          if (cancelled) {

            return;

          }


          console.error(
            "❌ Error cargando Passkeys:",
            error
          );


          notification.error({

            title:
              "Error",

            description:
              error?.message ||
              "No fue posible cargar las Passkeys.",

            placement:
              "topRight",

            duration:
              8,

            showProgress:
              true,

            pauseOnHover:
              true,

            closable:
              true,

            className:
              "welcome-notification"

          });


        } finally {

          if (!cancelled) {

            setLoading(
              false
            );

          }

        }

      };


    const timer =
      setTimeout(() => {

        if (!cancelled) {

          loadInitialPasskeys();

        }

      }, 0);


    return () => {

      cancelled = true;

      clearTimeout(
        timer
      );

    };

  }, [getPasskeys, notification]);


  // ============================================================
  // CERRAR MODAL REGISTRAR
  // ============================================================

  const closeRegisterModal =
    () => {

      if (
        registering
      ) {

        return;

      }


      setModalOpen(
        false
      );


      setPasskeyName(
        ""
      );

    };


  // ============================================================
  // ABRIR MODAL ELIMINAR
  // ============================================================

  const openDeleteModal =
    (passkey) => {

      if (
        deleting !== null
      ) {

        return;

      }


      setPasskeyToDelete(
        passkey
      );


      setDeleteModalOpen(
        true
      );

    };


  // ============================================================
  // CERRAR MODAL ELIMINAR
  // ============================================================

  const closeDeleteModal =
    () => {

      if (
        deleting !== null
      ) {

        return;

      }


      setDeleteModalOpen(
        false
      );


      setPasskeyToDelete(
        null
      );

    };


  // ============================================================
  // REGISTRAR PASSKEY
  // ============================================================

  const handleRegister =
    async () => {

      if (
        registering
      ) {

        return;

      }


      if (
        !supported
      ) {

        notification.error({

          title:
            "Passkeys no disponibles",

          description:
            "Este navegador no admite autenticación mediante Passkeys.",

          placement:
            "topRight",

          duration:
            8,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });

        return;

      }


      const name =
        passkeyName.trim();


      if (
        !name
      ) {

        notification.error({

          title:
            "Nombre requerido",

          description:
            "Escribe un nombre para identificar esta Passkey.",

          placement:
            "topRight",

          duration:
            6,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });

        return;

      }


      try {

        setRegistering(
          true
        );


        await registerPasskey(
          name
        );


        notification.success({

          title:
            "Passkey registrada",

          description:
            "La Passkey fue registrada correctamente en tu cuenta.",

          placement:
            "topRight",

          duration:
            6,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });


        setModalOpen(
          false
        );


        setPasskeyName(
          ""
        );


        await loadPasskeys();


      } catch (error) {

        console.error(
          "❌ Error registrando Passkey:",
          error
        );


        let description =
          error?.message ||
          "No fue posible registrar la Passkey.";


        if (
          error?.name ===
          "NotAllowedError"
        ) {

          description =
            "El registro de la Passkey fue cancelado o no fue autorizado.";

        }


        if (
          error?.name ===
          "InvalidStateError"
        ) {

          description =
            "Esta Passkey ya está registrada en tu cuenta.";

        }


        if (
          error?.status ===
          409
        ) {

          description =
            "Esta Passkey ya está registrada en tu cuenta.";

        }


        notification.error({

          title:
            "Error registrando Passkey",

          description,

          placement:
            "topRight",

          duration:
            8,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });


      } finally {

        setRegistering(
          false
        );

      }

    };


  // ============================================================
  // ELIMINAR PASSKEY
  // ============================================================

  const handleDelete =
    async () => {

      if (
        !passkeyToDelete
      ) {

        return;

      }


      if (
        deleting !== null
      ) {

        return;

      }


      const credentialID =
        passkeyToDelete.credentialID;


      try {

        setDeleting(
          credentialID
        );


        await removePasskey(
          credentialID
        );


        notification.success({

          title:
            "Passkey eliminada",

          description:
            "La Passkey fue eliminada correctamente.",

          placement:
            "topRight",

          duration:
            6,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });


        setDeleteModalOpen(
          false
        );


        setPasskeyToDelete(
          null
        );


        await loadPasskeys();


      } catch (error) {

        console.error(
          "❌ Error eliminando Passkey:",
          error
        );


        notification.error({

          title:
            "Error",

          description:
            error?.message ||
            "No fue posible eliminar la Passkey.",

          placement:
            "topRight",

          duration:
            8,

          showProgress:
            true,

          pauseOnHover:
            true,

          closable:
            true,

          className:
            "welcome-notification"

        });


      } finally {

        setDeleting(
          null
        );

      }

    };


  // ============================================================
  // FORMATO FECHA
  // ============================================================

  const formatDate =
    (date) => {

      if (
        !date
      ) {

        return "Nunca";

      }


      try {

        return new Intl.DateTimeFormat(

          "es-MX",

          {

            dateStyle:
              "medium",

            timeStyle:
              "short"

          }

        ).format(

          new Date(
            date
          )

        );

      } catch {

        return "Fecha no disponible";

      }

    };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <section className="passkey-card">


      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="passkey-header">

        <div className="passkey-title">

          <div className="passkey-icon">

            <KeyOutlined />

          </div>


          <div>

            <h3>
              Passkeys
            </h3>


            <p>

              Inicia sesión de forma segura
              sin utilizar tu contraseña.

            </p>

          </div>

        </div>


        <Button

          type="primary"

          className="private-primary-button passkey-add-button"

          icon={
            <PlusOutlined />
          }

          onClick={() =>
            setModalOpen(true)
          }

          disabled={
            !supported ||
            registering
          }

        >

          Agregar Passkey

        </Button>

      </div>


      {/* ======================================================
          AVISO DE SOPORTE
          ====================================================== */}

      {!supported && (

        <div className="passkey-warning">

          <SafetyOutlined />

          <span>

            Este navegador no admite
            Passkeys/WebAuthn.

          </span>

        </div>

      )}


      {/* ======================================================
          INFORMACIÓN DEL AUTENTICADOR
          ====================================================== */}

      {supported &&
        platformAvailable && (

          <div className="passkey-platform-info">

            <SafetyOutlined />

            <span>

              Este dispositivo admite
              autenticación biométrica,
              PIN o mecanismo de seguridad
              del dispositivo.

            </span>

          </div>

        )}


      {/* ======================================================
          LISTA DE PASSKEYS
          ====================================================== */}

      <div className="passkey-list">

        {loading ? (

          <div className="passkey-loading">

            <Spin />

          </div>

        ) : passkeys.length === 0 ? (

          <Empty

            image={
              Empty.PRESENTED_IMAGE_SIMPLE
            }

            description={
              "No tienes Passkeys registradas."
            }

          />

        ) : (

          passkeys.map(
            (passkey) => {

              const isDeleting =
                deleting ===
                passkey.credentialID;             


              return (

                <div

                  key={
                    passkey.credentialID
                  }

                  className="passkey-item"

                >

                  {/* ==========================================
                      ICONO DISPOSITIVO
                      ========================================== */}

                  <div className="passkey-item-icon">

                    <DesktopOutlined />

                  </div>


                  {/* ==========================================
                      INFORMACIÓN
                      ========================================== */}

                  <div className="passkey-item-info">

                    <strong>

                      {passkey.name ||
                        "Passkey"}

                    </strong>

                    <span>
                    Dispositivo:{" "}
                    {passkey.operatingSystem ||
                        "Dispositivo desconocido"}
                    </span>


                    <span>

                      Registrada:{" "}

                      {formatDate(
                        passkey.registeredAt
                      )}

                    </span>


                    <span>

                      Último uso:{" "}

                      {formatDate(
                        passkey.lastUsedAt
                      )}

                    </span>

                  </div>


                  {/* ==========================================
                      ELIMINAR
                      ========================================== */}

                  <Button

                    danger

                    type="text"

                    className="private-danger-button"

                    icon={
                      <DeleteOutlined />
                    }

                    disabled={
                      deleting !== null
                    }

                    onClick={() =>
                      openDeleteModal(
                        passkey
                      )
                    }

                  >

                    Eliminar

                  </Button>

                </div>

              );

            }

          )

        )}

      </div>


      {/* ======================================================
          MODAL PERSONALIZADO — REGISTRAR
          ====================================================== */}

      {modalOpen && (

        <div

          className="passkey-modal-overlay"

          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              closeRegisterModal();

            }

          }}

        >

          <div

            className="passkey-modal"

            role="dialog"

            aria-modal="true"

            aria-labelledby="passkey-register-modal-title"

          >

            {/* ==================================================
                HEADER
                ================================================== */}

            <div className="passkey-modal-header">

              <div className="passkey-modal-title">

                <div className="passkey-modal-icon">

                  <KeyOutlined />

                </div>


                <div>

                  <h3
                    id="passkey-register-modal-title"
                  >

                    Registrar Passkey

                  </h3>


                  <span>

                    Nueva credencial de acceso

                  </span>

                </div>

              </div>


              <button

                type="button"

                className="passkey-modal-close"

                onClick={
                  closeRegisterModal
                }

                disabled={
                  registering
                }

                aria-label="Cerrar"

              >

                ×

              </button>

            </div>


            {/* ==================================================
                CONTENIDO
                ================================================== */}

            <div className="passkey-modal-content">

              <div className="passkey-modal-info">

                <SafetyOutlined />

                <p>

                  La Passkey quedará asociada
                  a tu cuenta y podrás utilizarla
                  posteriormente para iniciar sesión
                  sin contraseña.

                </p>

              </div>


              <div className="passkey-modal-field">

                <label
                  htmlFor="passkey-name"
                >

                  Nombre de la Passkey

                </label>


                <input

                  id="passkey-name"

                  type="text"

                  value={
                    passkeyName
                  }

                  onChange={(event) =>
                    setPasskeyName(
                      event.target.value
                    )
                  }

                  placeholder={
                    "Ej. Mi laptop, Windows Hello, iPhone..."
                  }

                  maxLength={
                    100
                  }

                  disabled={
                    registering
                  }

                  autoFocus

                  onKeyDown={(event) => {

                    if (
                      event.key ===
                      "Enter"
                    ) {

                      event.preventDefault();

                      handleRegister();

                    }

                  }}

                />


                <span className="passkey-modal-hint">

                  Usa un nombre que te permita
                  identificar este dispositivo.

                </span>

              </div>

            </div>


            {/* ==================================================
                FOOTER
                ================================================== */}

            <div className="passkey-modal-footer">

              <button

                type="button"

                className="passkey-modal-cancel"

                onClick={
                  closeRegisterModal
                }

                disabled={
                  registering
                }

              >

                Cancelar

              </button>


              <button

                type="primary"

                className="private-primary-button passkey-add-button"

                onClick={
                  handleRegister
                }

                disabled={
                  registering
                }

              >

                {registering ? (

                  <>

                    <span
                      className="passkey-modal-spinner"
                    />

                    Registrando...

                  </>

                ) : (

                  <>

                    <KeyOutlined />

                    Registrar Passkey

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          MODAL PERSONALIZADO — ELIMINAR
          ====================================================== */}

      {deleteModalOpen &&
        passkeyToDelete && (

          <div

            className="passkey-modal-overlay"

            onMouseDown={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {

                closeDeleteModal();

              }

            }}

          >

            <div

              className="passkey-modal"

              role="dialog"

              aria-modal="true"

              aria-labelledby="passkey-delete-modal-title"

            >

              {/* ==================================================
                  HEADER
                  ================================================== */}

              <div className="passkey-modal-header">

                <div className="passkey-modal-title">

                  <div className="passkey-modal-icon passkey-modal-icon-danger">

                    <DeleteOutlined />

                  </div>


                  <div>

                    <h3
                      id="passkey-delete-modal-title"
                    >

                      Eliminar Passkey

                    </h3>


                    <span>

                      Eliminar credencial de acceso

                    </span>

                  </div>

                </div>


                <button

                  type="button"

                  className="passkey-modal-close"

                  onClick={
                    closeDeleteModal
                  }

                  disabled={
                    deleting !== null
                  }

                  aria-label="Cerrar"

                >

                  ×

                </button>

              </div>


              {/* ==================================================
                  CONTENIDO
                  ================================================== */}

              <div className="passkey-modal-content">

                <div className="passkey-modal-info passkey-modal-info-danger">

                  <DeleteOutlined />

                  <p>

                    ¿Estás seguro de que deseas
                    eliminar esta Passkey?

                  </p>

                </div>


                <div className="passkey-delete-details">

                  <span>

                    Passkey

                  </span>


                  <strong>

                    {passkeyToDelete.name ||
                      "Passkey"}

                  </strong>


                  <small>

                    Registrada:{" "}

                    {formatDate(
                      passkeyToDelete.registeredAt
                    )}

                  </small>

                </div>


                <p className="passkey-delete-warning">

                  Esta acción eliminará la credencial
                  de tu cuenta y no podrá utilizarse
                  nuevamente para iniciar sesión.

                </p>

              </div>


              {/* ==================================================
                  FOOTER
                  ================================================== */}

              <div className="passkey-modal-footer">

                <button

                  type="button"

                  className="passkey-modal-cancel"

                  onClick={
                    closeDeleteModal
                  }

                  disabled={
                    deleting !== null
                  }

                >

                  Cancelar

                </button>


                <button

                  type="button"

                  className="passkey-modal-submit passkey-modal-submit-danger"

                  onClick={
                    handleDelete
                  }

                  disabled={
                    deleting !== null
                  }

                >

                  {deleting !== null ? (

                    <>

                      <span
                        className="passkey-modal-spinner"
                      />

                      Eliminando...

                    </>

                  ) : (

                    <>

                      <DeleteOutlined />

                      Eliminar Passkey

                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        )}

    </section>

  );

}


export default PasskeyCard;