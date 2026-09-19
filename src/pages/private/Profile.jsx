import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  AuthContext
} from "../../context/AuthContext.jsx";

import {
  useNotification
} from "../../hooks/useNotification";

import CertificateNameModal
  from "../../components/profile/CertificateNameConfirmModal.jsx";

import "../../styles/private/profile.css";
import "../../styles/button.css";

function Profile() {

  const {
    user,
    updateCertificateName
  } = useContext(AuthContext);

  const notification =
    useNotification();

  const [
    certificateName,
    setCertificateName
  ] = useState(
    user?.certificateName || ""
  );

  const [
    showCertificateNameModal,
    setShowCertificateNameModal
  ] = useState(false);

  const [
    saving,
    setSaving
  ] = useState(false);

  /* ============================================================
     SINCRONIZAR NOMBRE OFICIAL
     ============================================================ */

  useEffect(() => {

    setCertificateName(
      user?.certificateName || ""
    );

  }, [
    user?.certificateName
  ]);


  /* ============================================================
     GUARDAR NOMBRE — ABRIR CONFIRMACIÓN
     ============================================================ */

  const handleSaveCertificateName =
    () => {

      const cleanName =
        certificateName.trim();

      if (!cleanName) {
        return;
      }

      setCertificateName(
        cleanName
      );

      setShowCertificateNameModal(
        true
      );

    };


  /* ============================================================
     CONFIRMAR NOMBRE OFICIAL
     ============================================================ */

  const handleConfirmCertificateName =
    async () => {

      const cleanName =
        certificateName.trim();

      if (!cleanName) {
        return;
      }

      try {

        setSaving(true);

        await updateCertificateName(
          cleanName
        );

        setCertificateName(
          cleanName
        );

        setShowCertificateNameModal(
          false
        );

        notification.success({

          title:
            "¡Nombre guardado!",

          description:
            "El nombre oficial se ha guardado correctamente y se utilizará en tus próximas constancias.",

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
            "welcome-notification",

        });

      } catch (error) {

        console.error(
          "❌ Error actualizando nombre oficial:",
          error
        );

        notification.error({

          title:
            "No se pudo guardar",

          description:
            "No fue posible actualizar tu nombre oficial. Inténtalo nuevamente.",

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
            "welcome-notification",

        });

      } finally {

        setSaving(false);

      }

    };


  /* ============================================================
     CANCELAR CONFIRMACIÓN
     ============================================================ */

  const handleCancelCertificateName =
    () => {

      if (saving) {
        return;
      }

      setShowCertificateNameModal(
        false
      );

    };


  const hasCertificateName =
    Boolean(
      certificateName.trim()
    );


  return (
    <div className="private-page-container">

      {/* ========================================================
          ENCABEZADO
          ======================================================== */}

      <div className="private-page-header">

        <span className="private-page-eyebrow">
          Cuenta
        </span>

        <h1>
          Mi perfil
        </h1>

        <p>
          Consulta y administra la información asociada a tu cuenta.
        </p>

      </div>


      {/* ========================================================
          INFORMACIÓN DE LA CUENTA
          ======================================================== */}

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
              Tipo de usuario
            </span>

            <strong>
              {user?.role === "admin"
                ? "Administrador"
                : "Usuario"}
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


      {/* ========================================================
          NOMBRE OFICIAL PARA CONSTANCIAS
          ======================================================== */}

      <section className="private-card">

        <div className="private-card-header">

          <div className="private-card-icon">

            <i className="bi bi-patch-check" />

          </div>

          <div>

            <h2>
              Nombre oficial para constancias
            </h2>

            <p>
              Este nombre aparecerá en tus constancias académicas.
            </p>

          </div>

        </div>


        <div className="private-profile-certificate-name">

          <label htmlFor="certificateName">
            Nombre oficial
          </label>


          <input
            id="certificateName"
            type="text"
            value={certificateName}
            onChange={(event) =>
              setCertificateName(
                event.target.value
              )
            }
            maxLength={100}
            placeholder="Nombre completo para tus constancias"
            disabled={saving}
          />


          <p>
            Escríbelo exactamente como deseas que aparezca en tus constancias.
          </p>


          {/* ====================================================
              ESTADO DEL NOMBRE
              ==================================================== */}

          {hasCertificateName && (

            <div
              className="
                private-profile-certificate-saved
              "
            >

              <i className="bi bi-check-circle-fill" />

              <div>

                <strong>
                  Nombre oficial guardado
                </strong>

                <span>
                  Este nombre se utilizará en tus próximas constancias.
                </span>

              </div>

            </div>

          )}


          {/* ====================================================
              BOTÓN
              ==================================================== */}

          <button
            type="button"
            className="
              app-button
              app-button-blue
            "
            onClick={
              handleSaveCertificateName
            }
            disabled={
              !certificateName.trim() ||
              saving
            }
          >

            <i
              className={
                hasCertificateName
                  ? "bi bi-pencil-square"
                  : "bi bi-check-lg"
              }
            />

            <span>

              {hasCertificateName
                ? "Actualizar nombre"
                : "Guardar nombre"}

            </span>

          </button>

        </div>

      </section>


      {/* ========================================================
          MODAL
          ======================================================== */}

      {showCertificateNameModal && (

        <CertificateNameModal

          certificateName={
            certificateName
          }

          loading={
            saving
          }

          onConfirm={
            handleConfirmCertificateName
          }

          onCancel={
            handleCancelCertificateName
          }

        />

      )}

    </div>
  );

}

export default Profile;