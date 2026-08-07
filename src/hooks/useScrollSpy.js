import { useEffect } from "react";


export function useScrollSpy() {


  useEffect(() => {


    const sections = document.querySelectorAll("section[id]");

    const navLinks = document.querySelectorAll(
      ".navmenu a"
    );


    const handleScroll = () => {


      let current = "";


      const scrollPosition = window.scrollY + 250;


      sections.forEach((section) => {


        const sectionTop = section.offsetTop;

        const sectionBottom =
          sectionTop + section.offsetHeight;



        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionBottom
        ) {

          current = section.id;

        }


      });



      navLinks.forEach((link) => {


        link.classList.remove("active");


        if (
          link.getAttribute("href") === `#${current}`
        ) {

          link.classList.add("active");

        }


      });


    };



    window.addEventListener(
      "scroll",
      handleScroll
    );


    handleScroll();



    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };


  }, []);

}