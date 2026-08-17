import "devicon/devicon.min.css";
import "../styles/contact-tech-marquee.css";


const technologies = [
  {
    name: "React",
    icon: "devicon-react-original colored"
  },
  {
    name: "JavaScript",
    icon: "devicon-javascript-plain colored"
  },
  {
    name: "HTML5",
    icon: "devicon-html5-plain colored"
  },
  {
    name: "CSS3",
    icon: "devicon-css3-plain colored"
  },
  {
    name: "Node.js",
    icon: "devicon-nodejs-plain colored"
  },
  {
    name: "Express",
    icon: "devicon-express-original"
  },
  {
    name: "MongoDB",
    icon: "devicon-mongodb-plain colored"
  },
  {
    name: "Firebase",
    icon: "devicon-firebase-plain colored"
  },
  {
    name: "Git",
    icon: "devicon-git-plain colored"
  },
  {
    name: "GitHub",
    icon: "devicon-github-original"
  },
  {
    name: "Vite",
    icon: "devicon-vitejs-plain colored"
  },
  {
    name: "NPM",
    icon: "devicon-npm-original-wordmark colored"
  },
  {
    name: "Bootstrap",
    icon: "devicon-bootstrap-plain colored"
  },
  {
    name: "Ant Design",
    icon: "devicon-antdesign-plain colored"
  }
];


function TechnologyItem({ technology }) {

  return (

    <div
      className="contact-tech-item"
      title={technology.name}
    >

      <div className="contact-tech-icon">

        <span className="contact-tech-glow"></span>

        <span className="contact-tech-orbit"></span>

        <i className={technology.icon}></i>

        <span className="contact-tech-shine"></span>

      </div>


      <span className="contact-tech-name">
        {technology.name}
      </span>

    </div>

  );

}


function ContactTechMarquee() {

  const marqueeItems = [
    ...technologies,
    ...technologies
  ];


  return (

    <div className="contact-tech-marquee">

      <div className="contact-tech-header">

        <span className="contact-tech-line"></span>

        <span className="contact-tech-label">
          Tecnologías utilizadas
        </span>

        <span className="contact-tech-line"></span>

      </div>


      <div className="contact-tech-viewport">

        <div className="contact-tech-fade contact-tech-fade-left"></div>

        <div className="contact-tech-fade contact-tech-fade-right"></div>


        <div className="contact-tech-track">

          {marqueeItems.map((technology, index) => (

            <TechnologyItem
              key={`${technology.name}-${index}`}
              technology={technology}
            />

          ))}

        </div>

      </div>

    </div>

  );

}


export default ContactTechMarquee;