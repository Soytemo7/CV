import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";


export function showMessage(message, type = "success") {


  Toastify({

    text: message,

    duration: 5000,

    close: true,

    gravity: "bottom",

    position: "right",

    stopOnFocus: true,


    style: {

      background: type === "success"

        ? "linear-gradient(to right, #00b09b, #96c93d)"

        : "linear-gradient(to right, #ff416c, #ff4b2b)"

    }

  }).showToast();

}