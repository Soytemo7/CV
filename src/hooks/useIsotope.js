import { useEffect } from "react";
import Isotope from "isotope-layout";
import imagesLoaded from "imagesloaded";

function useIsotope() {

  useEffect(() => {

    const container = document.querySelector(".isotope-container");

    if (!container) return;


    let iso;


    imagesLoaded(container, () => {

      iso = new Isotope(container, {

        itemSelector: ".isotope-item",

        layoutMode: "masonry"

      });


      const filters = document.querySelectorAll(
        ".portfolio-filters li"
      );


      filters.forEach(filter => {

        filter.addEventListener("click", () => {


          filters.forEach(item =>
            item.classList.remove("filter-active")
          );


          filter.classList.add("filter-active");


          iso.arrange({

            filter: filter.dataset.filter

          });


        });

      });


    });


    return () => {

      if (iso) {

        iso.destroy();

      }

    };


  }, []);

}


export default useIsotope;