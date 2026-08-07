import { useState } from "react";
import { showMessage } from "../utils/toast";


function Contact() {


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });


  const [sending, setSending] = useState(false);



  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };




  const handleSubmit = async (e) => {

    e.preventDefault();

    setSending(true);


    try {


      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("subject", formData.subject);
      data.append("message", formData.message);



      const response = await fetch(
        "https://formsubmit.co/ajax/manuel_fusion@hotmail.com",
        {
          method: "POST",
          body: data
        }
      );



      if (response.ok) {


        showMessage(
          "¡Su mensaje ha sido enviado correctamente!"
        );


        setFormData({

          name: "",
          email: "",
          subject: "",
          message: ""

        });


      } else {


        showMessage(
          "Ocurrió un error al enviar el mensaje.",
          "error"
        );


      }



    } catch (error) {


      console.error(error);


      showMessage(
        "No fue posible conectar con el servidor.",
        "error"
      );


    }



    setSending(false);


  };



  return (

    <section id="contact" className="contact section">


      <div className="container section-title" data-aos="fade-up">

        <h2>Contacto</h2>

        <p>
          Necesitamos algo de su información para poder contactarlo; por ello,
          le ofrecemos esta sección con los datos necesarios.
        </p>

      </div>



      <div
        className="container"
        data-aos="fade"
        data-aos-delay="100"
      >


        <div className="row gy-4">



          <div className="col-lg-4">


            <div
              className="info-item d-flex"
              data-aos="fade-up"
              data-aos-delay="200"
            >

              <i className="bi bi-geo-alt flex-shrink-0"></i>

              <div>

                <h3>Dirección</h3>

                <p>
                  Chilpancingo, Guerrero
                </p>

              </div>

            </div>




            <div
              className="info-item d-flex"
              data-aos="fade-up"
              data-aos-delay="300"
            >

              <i className="bi bi-telephone flex-shrink-0"></i>

              <div>

                <h3>Llámenos</h3>

                <p>
                  7471860174
                </p>

              </div>

            </div>




            <div
              className="info-item d-flex"
              data-aos="fade-up"
              data-aos-delay="400"
            >

              <i className="bi bi-envelope flex-shrink-0"></i>

              <div>

                <h3>
                  Envíenos un correo electrónico
                </h3>

                <p>
                  contador.manuel0@gmail.com
                </p>

              </div>

            </div>


          </div>






          <div className="col-lg-8">


            <form

              id="contact-form"

              className="php-email-form"

              onSubmit={handleSubmit}

              data-aos="fade-up"

              data-aos-delay="200"

            >


              <div className="row gy-4">



                <div className="col-md-6">

                  <input

                    type="text"

                    name="name"

                    className="form-control"

                    placeholder="Tu nombre"

                    value={formData.name}

                    onChange={handleChange}

                    required

                  />

                </div>





                <div className="col-md-6">

                  <input

                    type="email"

                    name="email"

                    className="form-control"

                    placeholder="Tu correo electrónico"

                    value={formData.email}

                    onChange={handleChange}

                    required

                  />

                </div>





                <div className="col-md-12">

                  <input

                    type="text"

                    name="subject"

                    className="form-control"

                    placeholder="Asunto"

                    value={formData.subject}

                    onChange={handleChange}

                    required

                  />

                </div>





                <div className="col-md-12">

                  <textarea

                    name="message"

                    className="form-control"

                    rows="6"

                    placeholder="Mensaje"

                    value={formData.message}

                    onChange={handleChange}

                    required

                  ></textarea>

                </div>





                <div className="col-md-12 text-center">


                  <button

                    type="submit"

                    disabled={sending}

                  >

                    {sending ? "Enviando..." : "Enviar mensaje"}


                  </button>


                </div>



              </div>


            </form>


          </div>


        </div>


      </div>


    </section>

  );

}


export default Contact;