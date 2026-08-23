import { argon2id } from "hash-wasm";


// ============================================================
// CONFIGURACIÓN
// ============================================================

const ARGON2_TIME = 3;
const ARGON2_MEMORY = 19456;
const ARGON2_PARALLELISM = 1;
const ARGON2_HASH_LENGTH = 32;

const AES_ALGORITHM = "AES-GCM";
const AES_KEY_LENGTH = 256;
const AES_IV_LENGTH = 12;

const KEY_FILE_VERSION = 1;


// ============================================================
// BASE64URL
// ============================================================

const bytesToBase64Url = (bytes) => {

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

};


const base64UrlToBytes = (value) => {

  const base64 =
    value
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(
        value.length + (4 - value.length % 4) % 4,
        "="
      );

  const binary = atob(base64);

  const bytes =
    new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;

};


// ============================================================
// UTF-8
// ============================================================

const encodeText = (text) =>
  new TextEncoder().encode(text);

const decodeText = (bytes) =>
  new TextDecoder().decode(bytes);


// ============================================================
// HEX
// ============================================================

const bytesToHex = (bytes) => {

  return [...bytes]
    .map(
      byte =>
        byte
          .toString(16)
          .padStart(2, "0")
    )
    .join("");

};


// ============================================================
// PEM
// ============================================================

const arrayBufferToPem = (
  buffer,
  label
) => {

  const bytes =
    new Uint8Array(buffer);

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  const base64 =
    btoa(binary);

  const lines =
    base64.match(/.{1,64}/g) || [];

  return [
    `-----BEGIN ${label}-----`,
    ...lines,
    `-----END ${label}-----`
  ].join("\n");

};


// ============================================================
// RANDOM
// ============================================================

const randomBytes = (length) => {

  const bytes =
    new Uint8Array(length);

  crypto.getRandomValues(bytes);

  return bytes;

};


// ============================================================
// ARGON2ID
// ============================================================

const deriveKeyMaterial = async (
  password,
  salt
) => {

  if (
    typeof password !== "string" ||
    password.length < 1
  ) {

    throw new Error(
      "La contraseña o PIN es obligatorio."
    );

  }


  return await argon2id({

    password,

    salt,

    iterations:
      ARGON2_TIME,

    memorySize:
      ARGON2_MEMORY,

    parallelism:
      ARGON2_PARALLELISM,

    hashLength:
      ARGON2_HASH_LENGTH,

    outputType:
      "binary"

  });

};


// ============================================================
// AES KEY
// ============================================================

const importAesKey = async (
  keyBytes
) => {

  return await crypto.subtle.importKey(

    "raw",

    keyBytes,

    {
      name:
        AES_ALGORITHM
    },

    false,

    [
      "encrypt",
      "decrypt"
    ]

  );

};


// ============================================================
// GENERAR PAR DE CLAVES ED25519
// ============================================================

export const generateCertificateKeyPair =
  async () => {

    return await crypto.subtle.generateKey(

      {
        name:
          "Ed25519"
      },

      true,

      [
        "sign",
        "verify"
      ]

    );

  };


// ============================================================
// EXPORTAR CLAVE PÚBLICA PEM
// ============================================================

export const exportPublicKeyPem =
  async (
    publicKey
  ) => {

    const spki =
      await crypto.subtle.exportKey(
        "spki",
        publicKey
      );

    return arrayBufferToPem(
      spki,
      "PUBLIC KEY"
    );

  };


// ============================================================
// EXPORTAR CLAVE PRIVADA
// ============================================================

const exportPrivateKey =
  async (
    privateKey
  ) => {

    return await crypto.subtle.exportKey(
      "pkcs8",
      privateKey
    );

  };


// ============================================================
// CIFRAR PRIVATE KEY
// ============================================================

export const createKeyFile =
  async ({
    privateKey,
    password,
    publicKeyPem,
    name,
    certificateId,
    expiresAt
  }) => {

    const privateKeyPkcs8 =
      await exportPrivateKey(
        privateKey
      );


    const salt =
      randomBytes(16);

    const iv =
      randomBytes(
        AES_IV_LENGTH
      );


    const keyMaterial =
      await deriveKeyMaterial(
        password,
        salt
      );


    const aesKey =
      await importAesKey(
        keyMaterial
      );


    const encrypted =
      await crypto.subtle.encrypt(

        {
          name:
            AES_ALGORITHM,

          iv

        },

        aesKey,

        privateKeyPkcs8

      );


    const file = {

        version:
            KEY_FILE_VERSION,

        type:
            "CV-CERTIFICATE-KEY",

        algorithm:
            "Ed25519",

        encryption:
            "AES-256-GCM",

        kdf:
            "Argon2id",

        certificateId,

        expiresAt,

        argon2: {

            time:
            ARGON2_TIME,

            memory:
            ARGON2_MEMORY,

            parallelism:
            ARGON2_PARALLELISM,

            hashLength:
            ARGON2_HASH_LENGTH

        },

        name,

        publicKeyPem,

        salt:
            bytesToBase64Url(
            salt
            ),

        iv:
            bytesToBase64Url(
            iv
            ),

        ciphertext:
            bytesToBase64Url(
            new Uint8Array(
                encrypted
            )
            )

        };


    return JSON.stringify(
      file,
      null,
      2
    );

  };


// ============================================================
// DESCIFRAR .KEY
// ============================================================

export const decryptKeyFile =
  async (
    fileText,
    password
  ) => {

    let file;

    try {

      file =
        JSON.parse(
          fileText
        );

    } catch {

      throw new Error(
        "El archivo .key no tiene un formato válido."
      );

    }


    if (
      file?.type !==
      "CV-CERTIFICATE-KEY"
    ) {

      throw new Error(
        "El archivo no es una credencial compatible."
      );

    }


    if (
      file?.version !==
      KEY_FILE_VERSION
    ) {

      throw new Error(
        "La versión del archivo .key no es compatible."
      );

    }


    if (
      file?.algorithm !==
      "Ed25519"
    ) {

      throw new Error(
        "El algoritmo de la credencial no es compatible."
      );

    }


    try {

      const salt =
        base64UrlToBytes(
          file.salt
        );

      const iv =
        base64UrlToBytes(
          file.iv
        );

      const ciphertext =
        base64UrlToBytes(
          file.ciphertext
        );


      const keyMaterial =
        await deriveKeyMaterial(
          password,
          salt
        );


      const aesKey =
        await importAesKey(
          keyMaterial
        );


      const decrypted =
        await crypto.subtle.decrypt(

          {
            name:
              AES_ALGORITHM,

            iv

          },

          aesKey,

          ciphertext

        );


      const privateKey =
        await crypto.subtle.importKey(

          "pkcs8",

          decrypted,

          {
            name:
              "Ed25519"
          },

          false,

          [
            "sign"
          ]

        );


      return {

        privateKey,

        publicKeyPem:
          file.publicKeyPem,
        
        certificateId: file.certificateId,

        name:
          file.name,
        
        expiresAt:
          file.expiresAt

      };

    } catch {

      throw new Error(
        "No fue posible descifrar la credencial. Verifica la contraseña o PIN."
      );

    }

  };


// ============================================================
// FIRMAR CHALLENGE
// ============================================================

export const signChallenge =
  async (
    privateKey,
    challenge
  ) => {

    const signature =
      await crypto.subtle.sign(

        {
          name:
            "Ed25519"
        },

        privateKey,

        encodeText(
          challenge
        )

      );


    return bytesToBase64Url(
      new Uint8Array(
        signature
      )
    );

  };


// ============================================================
// OBTENER PUBLIC KEY DESDE .KEY
// ============================================================

export const getPublicKeyFromKeyFile =
  (
    fileText
  ) => {

    const file =
      JSON.parse(
        fileText
      );

    if (
      file?.type !==
      "CV-CERTIFICATE-KEY"
    ) {

      throw new Error(
        "Archivo .key no compatible."
      );

    }

    return {
    publicKeyPem:
      file.publicKeyPem,

    name:
      file.name || "",

    certificateId:
      file.certificateId,

    expiresAt:
      file.expiresAt
  };

  };


// ============================================================
// DESCARGA
// ============================================================

export const downloadTextFile =
  (
    content,
    filename,
    mimeType
  ) => {

    const blob =
      new Blob(
        [content],
        {
          type:
            mimeType
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const anchor =
      document.createElement(
        "a"
      );

    anchor.href =
      url;

    anchor.download =
      filename;

    document.body.appendChild(
      anchor
    );

    anchor.click();

    anchor.remove();


    URL.revokeObjectURL(
      url
    );

  };


// ============================================================
// GENERAR .CER
// ============================================================

  export const createCertificateFile =
  (
    publicKeyPem,
    {
      certificateId,
      name,
      expiresAt
    } = {}
  ) => {

    const certificate = {
      version:
        1,

      type:
        "CV-CERTIFICATE",

      algorithm:
        "Ed25519",

      certificateId,

      name,

      expiresAt,

      publicKeyPem
    };

    return JSON.stringify(
      certificate,
      null,
      2
    );

  };

// ============================================================
// HUELLA LOCAL
// ============================================================

export const getPublicKeyFingerprint =
  async (
    publicKeyPem
  ) => {

    const pemBody =
      publicKeyPem
        .replace(
          "-----BEGIN PUBLIC KEY-----",
          ""
        )
        .replace(
          "-----END PUBLIC KEY-----",
          ""
        )
        .replace(
          /\s/g,
          ""
        );


    const binary =
      atob(
        pemBody
      );


    const der =
      new Uint8Array(
        binary.length
      );


    for (
      let i = 0;
      i < binary.length;
      i++
    ) {

      der[i] =
        binary.charCodeAt(i);

    }


    const hash =
      await crypto.subtle.digest(
        "SHA-256",
        der
      );


    return bytesToHex(
      new Uint8Array(
        hash
      )
    );

  };