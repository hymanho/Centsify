/*

Creates the strucutre of the 'About' page. Contains biographies of the creators of Centsible, as well as both GitHub and LinkedIn hyperlinks.

*/

// Import images from the assets folder
import creator1 from '../../../assets/centsiblebiopic.jpg';  // Adjust the path based on your project structure
import creator2 from '../../../assets/centsiblebiopic2.jpg';

const About = () => {
  const creators = [
    {
      name: 'Diljan Shah',
      role: 'Lead Developer',
      image: creator1,  
      bio: "Hi! My name is Diljan Shah, I'm a highly motivated and dedicated computer science student at SU, pursuing my Bachelor's degree in Computer Science. With a strong passion for innovation and a genuine interest in software development, I am constantly seeking opportunities to expand my knowledge and skills in this dynamic field.\n\nLet's connect and discuss the exciting possibilities of working together. Feel free to reach out to me via LinkedIn or my email at diljanshah119@gmail.com.",
      linkedIn: 'https://www.linkedin.com/in/diljan-shah',  
      github: 'https://github.com/diljanshah333',  
    },
    {
      name: 'Hyman Ho',
      role: 'Lead Developer',
      image: creator2,
      bio: "Hi, my name is Hyman Ho. I am an undergraduate that is studying for a Bachelor's computer science at Seattle Univerisity. I am strongly passionate about using technology, especially AI and machine learning to improve the status quo. I am constantly seeking opportunities to grow my skills and gain experience in the field.\n\nFeel free to connect with me and we can discuss about working together! Feel free to reach out to me via LinkedIn or my email at hymanho@outlook.com.",
      linkedIn: 'https://www.linkedin.com/in/hyman-ho-7a13a1288/',
      github: 'https://github.com/hymanho',
    },
  ];

  const projectMission = "Our mission with this AI-powered expense tracking application is to revolutionize the way individuals manage their personal finances. The application helps users track expenses, gain insights through detailed reports, and use AI-driven predictions to plan better for the future. Our chatbot assistant provides instant support to answer financial queries and offers advice tailored to spending habits. By making financial management simple, intuitive, and powerful, we aim to empower users to take control of their finances and make informed decisions.";

  return (
    <div className="about-tab">
      <h2>About Us</h2>
      <div className="about-content">
        <div className="creators-list">
          {creators.map((creator) => (
            <div key={creator.name} className="creator-card">
              <img src={creator.image} alt={creator.name} className="creator-image" />
              <h3>{creator.name}</h3>
              <p><strong>{creator.role}</strong></p>
              <p>{creator.bio}</p>
              {/* Adds a section for GitHub and LinkedIn links with icons */}
              <div className="social-links">
                <a
                  href={creator.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  <i className="fab fa-github"></i> GitHub
                </a>
                <a
                  href={creator.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-link"
                >
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
        {/* Project Mission Section */}
        <div className="project-mission">
          <h3>Centsibles Goal</h3>
          <p>{projectMission}</p>
        </div>
      </div>
    </div>
  );
};

export default About;