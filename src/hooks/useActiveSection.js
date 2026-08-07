import { useEffect, useState } from "react";

function useActiveSection(sections) {

  const [activeSection, setActiveSection] = useState("hero");


  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }

        });

      },
      {
        threshold: 0.5
      }
    );


    sections.forEach((section) => {

      const element = document.getElementById(section);

      if (element) {
        observer.observe(element);
      }

    });


    return () => {

      sections.forEach((section) => {

        const element = document.getElementById(section);

        if (element) {
          observer.unobserve(element);
        }

      });

    };


  }, [sections]);


  return activeSection;

}


export default useActiveSection;