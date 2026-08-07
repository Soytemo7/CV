import { useEffect } from "react";
import GLightbox from "glightbox";

export default function useGLightbox() {

  useEffect(() => {

    const lightbox = GLightbox({
      selector: ".glightbox",
    });


    return () => {
      lightbox.destroy();
    };


  }, []);

}