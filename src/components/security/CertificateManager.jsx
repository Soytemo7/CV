import {
  useCallback,
  useEffect,
  useState
} from "react";

import api from "../../services/api.js";

import CertificateCreate
  from "./CertificateCreate.jsx";

import CertificateItem
  from "./CertificateItem.jsx";

export default function CertificateManager() {

  const [
    certificates,
    setCertificates
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    creating,
    setCreating
  ] = useState(false);


  // ============================================================
  // CARGAR CERTIFICADOS
  // ============================================================

  const loadCertificates =
    useCallback(
      async () => {

        try {

          setLoading(true);
          setError("");


          const response =
            await api(
              "/api/certificates",
              {
                method: "GET"
              }
            );


          const certificateList =
            response?.certificates ||
            response?.data?.certificates ||
            [];


          setCertificates(
            Array.isArray(certificateList)
              ? certificateList
              : []
          );

        } catch (err) {

          console.error(
            "Error loading certificates:",
            err
          );


          setError(
            err?.message ||
            "No fue posible cargar tus certificados."
          );

        } finally {

          setLoading(false);

        }

      },
      []
    );


  // ============================================================
  // CARGAR AL MONTAR
  // ============================================================

  useEffect(() => {

    let cancelled = false;


    const load = async () => {

      try {

        setLoading(true);
        setError("");


        const response =
          await api(
            "/api/certificates",
            {
              method: "GET"
            }
          );


        if (cancelled) {
          return;
        }


        const certificateList =
          response?.certificates ||
          response?.data?.certificates ||
          [];


        setCertificates(
          Array.isArray(certificateList)
            ? certificateList
            : []
        );

      } catch (err) {

        if (cancelled) {
          return;
        }


        console.error(
          "Error loading certificates:",
          err
        );


        setError(
          err?.message ||
          "No fue posible cargar tus certificados."
        );

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    };


    load();


    return () => {

      cancelled = true;

    };

  }, []);


  // ============================================================
  // CERTIFICADO CREADO
  // ============================================================

  const handleCreated =
    (certificate) => {

      if (!certificate) {
        return;
      }


      setCertificates(
        previous => [
          certificate,
          ...previous
        ]
      );


      setCreating(false);

    };


  // ============================================================
  // CERTIFICADO REVOCADO
  // ============================================================

  const handleRevoked =
    (certificateId) => {

      setCertificates(
        previous =>
          previous.filter(
            certificate => {

              const id =
                certificate?.certificateId ||
                certificate?._id;


              return id !== certificateId;

            }
          )
      );

    };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <section
      className="private-card"
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="private-card-header"
      >

        <div
          className="private-card-icon"
        >

          <i
            className="bi bi-shield-lock"
          />

        </div>


        <div>

          <h2>
            Certificados digitales
          </h2>

          <p>
            Administra tus credenciales Ed25519
            para autenticación.
          </p>

        </div>


        {!creating && (

          <button
            type="button"
            className="private-password-button"
            onClick={() =>
              setCreating(true)
            }
            style={{
              marginLeft: "auto"
            }}
          >

            <i
              className="bi bi-shield-plus"
            />

            <span>
              Crear certificado
            </span>

          </button>

        )}

      </div>


      {/* ======================================================
          CREAR CERTIFICADO
      ====================================================== */}

      {creating && (

        <CertificateCreate
          onCreated={
            handleCreated
          }

          onCancel={() =>
            setCreating(false)
          }

        />

      )}


      {/* ======================================================
          ERROR
      ====================================================== */}

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


          <button
            type="button"
            className="private-password-button"
            onClick={loadCertificates}
            disabled={loading}
          >

            <i
              className="bi bi-arrow-repeat"
            />

            <span>
              Reintentar
            </span>

          </button>

        </div>

      )}


      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (

        <div
          className="private-security-loading"
        >

          <i
            className="bi bi-arrow-repeat"
          />

          <span>
            Cargando certificados...
          </span>

        </div>

      )}


      {/* ======================================================
          LISTA
      ====================================================== */}

      {!loading &&
        !error &&
        certificates.length > 0 && (

          <div
            className="private-sessions-list"
          >

            {certificates.map(
              certificate => {

                const certificateId =
                  certificate?.certificateId ||
                  certificate?._id;


                return (

                  <CertificateItem
                    key={certificateId}
                    certificate={certificate}
                    onRevoked={
                      handleRevoked
                    }
                  />

                );

              }
            )}

          </div>

        )}


      {/* ======================================================
          SIN CERTIFICADOS
      ====================================================== */}

      {!loading &&
        !error &&
        certificates.length === 0 &&
        !creating && (

          <div
            className="private-security-empty"
          >

            <div
              className="private-security-empty-icon"
            >

              <i
                className="bi bi-shield-lock"
              />

            </div>


            <strong>
              No tienes certificados
            </strong>


            <span>
              Crea un certificado Ed25519
              para poder utilizarlo como
              método de autenticación.
            </span>


            <button
              type="button"
              className="private-password-button"
              onClick={() =>
                setCreating(true)
              }
            >

              <i
                className="bi bi-shield-plus"
              />

              <span>
                Crear mi primer certificado
              </span>

            </button>

          </div>

        )}

    </section>

  );

}