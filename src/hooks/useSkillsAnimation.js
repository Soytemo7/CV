import { useEffect } from "react";

export default function useSkillsAnimation() {

  useEffect(() => {

    const skills = document.querySelectorAll(".skills-animation");

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            const progress = entry.target.querySelectorAll(".progress-bar");

            progress.forEach((el) => {
              el.style.width = el.getAttribute("aria-valuenow") + "%";
            });

            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.5,
      }
    );


    skills.forEach((skill) => {
      observer.observe(skill);
    });


    return () => {
      observer.disconnect();
    };

  }, []);

}