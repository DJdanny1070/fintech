import "./Leadership.css";
import founderImg from "../../../assets/images/team/image.png";
import cofounderImg from "../../../assets/images/team/image copy.png";
import advisorImg from "../../../assets/images/team/wahallal.png";

const TEAM = [
  {
    photo: cofounderImg,
    name: "Dr. S. M. Wasiullah",
    role: "Founder",
    highlights: [
      "10+ years of industry experience",
      "5 years of research experience",
      "Expertise in Finance, FinTech & Entrepreneurship",
      "Business Consultant",
    ],
  },
  {
    photo: advisorImg,
    name: "Mr. Ishtiyaq Nadeem",
    role: "Co-Founder",
    highlights: [
      "Banker with 10+ years of experience",
      "Entrepreneur",
      "Engineer",
      "Business Consultant",
    ],
  },
  {
    photo: founderImg,
    name: "Mr. Sudheer",
    role: "Advisor – Technology Development",
    highlights: [
      "Technology expert with 20+ years of experience",
      "Entrepreneur",
      "Master's in Data Science & Artificial Intelligence",
      "FinTech Consultant",
    ],
  },
];

function Leadership() {
  return (
    <section className="leadership" id="leadership">
      <div className="leadership__container">
        {/* Header */}
        <div className="leadership__header">
          <span className="leadership__eyebrow">Meet Our Team</span>
          <h2 className="leadership__title">Leadership Team</h2>
          <p className="leadership__subtitle">
            The visionaries driving CresoX forward — combining decades of
            industry expertise, technological innovation, and entrepreneurial
            ambition to redefine fintech.
          </p>
        </div>

        {/* Cards */}
        <div className="leadership__grid">
          {TEAM.map(({ photo, name, role, highlights }) => (
            <article className="leadership__card" key={name}>
              <div className="leadership__photo-wrapper">
                <img
                  src={photo}
                  alt={`Portrait of ${name}`}
                  className="leadership__photo"
                  loading="lazy"
                />
                <div className="leadership__photo-overlay" />
              </div>

              <div className="leadership__body">
                <span className="leadership__role-badge">{role}</span>
                <h3 className="leadership__name">{name}</h3>

                <ul className="leadership__highlights">
                  {highlights.map((item) => (
                    <li key={item} className="leadership__highlight-item">
                      <span className="leadership__dot" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Leadership;
