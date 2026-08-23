import { useState } from "react";

import api from "../../services/api.js";

import {
  createCertificateFile,
  downloadTextFile
} from "../../utils/certificateCrypto.js";

import "../../styles/certificate.css";


export default function CertificateItem({
  certificate,
  onRevoked
}) {

  const [revoking, setRevoking] =
    useState(false);

  const [error, setError] =
    useState("");


  // ============================================================
  // DATOS
  // ============================================================

  const certificateId =
    certificate?.certificateId ||
    certificate?._id;


  const fingerprint =
    certificate?.fingerprint ||
    certificate?.publicKeyFingerprint ||
    "No disponible";


  const createdAt =
    certificate?.createdAt
      ? new Date(
          certificate.createdAt
        ).toLocaleString()
      : "No disponible";


  // ============================================================
  // REVOCAR
  // ============================================================

  const handleRevoke =
    async () => {

      const confirmed =
        window.confirm(
          "¿Deseas revocar este certificado? Esta acción no se puede deshacer."
        );


      if (!confirmed) {
        return;
      }


      try {

        setRevoking(true);
        setError("");


        await api(
          `/api/certificates/${encodeURIComponent(
            certificateId
          )}`,
          {
            method: "DELETE"
          }
        );


        onRevoked?.(
          certificateId
        );

      } catch (err) {

        console.error(
          "Error revoking certificate:",
          err
        );


        setError(
          err?.message ||
          "No se pudo revocar el certificado."
        );

      } finally {

        setRevoking(false);

      }

    };


  // ============================================================
  // DESCARGAR .CER
  // ============================================================

  const handleDownloadCertificate =
    () => {

      try {

        if (
          !certificate?.publicKeyPem
        ) {

          throw new Error(
            "El certificado no contiene la clave pública."
          );

        }


        const certificateFile =
        createCertificateFile(
          certificate.publicKeyPem,
          {
            certificateId:
              certificate.certificateId,

            name:
              certificate.name,

            expiresAt:
              certificate.expiresAt
          }
        );


        downloadTextFile(
          certificateFile,
          `${sanitizeFilename(
            certificate.name
          )}.cer`,
          "application/x-x509-ca-cert"
        );


      } catch (err) {

        console.error(
          "Error generando .cer:",
          err
        );


        setError(
          err?.message ||
          "No se pudo generar el archivo .cer."
        );

      }

    };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <article
      className="private-session-item"
    >

      {/* ======================================================
          ICONO
      ====================================================== */}

      <div
        className="private-session-icon"
      >

        <i
          className="bi bi-shield-lock"
        />

      </div>


      {/* ======================================================
          INFORMACIÓN
      ====================================================== */}

      <div
        className="private-session-info"
      >

        <div
          className="private-session-title"
        >

          <strong>
            {certificate?.name ||
              "Certificado Ed25519"}
          </strong>


          <span
            className="private-session-status"
          >

            <span
              className="private-session-status-dot"
            />

            Activo

          </span>

        </div>


        <span
          className="private-session-device"
        >
          Ed25519
        </span>


        <div
          className="private-session-meta"
        >

          <span>

            <i
              className="bi bi-fingerprint"
            />

            {fingerprint}

          </span>


          <span>

            <i
              className="bi bi-calendar3"
            />

            {createdAt}

          </span>

        </div>


        {error && (

          <div
            className="private-security-error"
          >

            <i
              className="bi bi-exclamation-triangle"
            />

            <span>
              {error}
            </span>

          </div>

        )}

      </div>


      {/* ======================================================
          ACCIONES
      ====================================================== */}

      <div
        className="private-session-actions"
      >

        <button
          type="button"
          className="private-password-button"
          onClick={
            handleDownloadCertificate
          }
          disabled={revoking}
        >

          <i
            className="bi bi-download"
          />

          <span>
            .cer
          </span>

        </button>


        <button
          type="button"
          className="private-danger-button"
          onClick={handleRevoke}
          disabled={
            revoking ||
            !certificateId
          }
        >

          <i
            className={
              revoking
                ? "bi bi-arrow-repeat"
                : "bi bi-shield-x"
            }
          />

          <span>
            {revoking
              ? "Revocando..."
              : "Revocar"
            }
          </span>

        </button>

      </div>

    </article>

  );

}


// ============================================================
// SANITIZAR NOMBRE
// ============================================================

function sanitizeFilename(value) {

  return String(
    value || "certificado"
  )
    .trim()
    .replace(
      /[<>:"/\\|?*]/g,
      "_"
    )
    .replace(
      /\s+/g,
      "_"
    )
    .slice(
      0,
      100
    )
    || "certificado";

}