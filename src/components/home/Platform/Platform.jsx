import { Link } from "react-router-dom";
import { Shield, Zap, Eye, Layers } from "lucide-react";
import "./Platform.css";

const FEATURES = [
  {
    icon: Shield,
    title: "Secure",
    desc: "Bank-grade encryption, role-based access, and hash-only blockchain records protect every transaction.",
  },
  {
    icon: Zap,
    title: "Fast",
    desc: "Settlements clear in seconds. Real-time wallet updates and instant marketplace confirmations.",
  },
  {
    icon: Eye,
    title: "Transparent",
    desc: "Full audit trails and on-chain verification — without exposing private user data.",
  },
  {
    icon: Layers,
    title: "Scalable",
    desc: "Built to handle growing transaction volumes for startups, enterprises, and developer integrations.",
  },
];

function Platform() {
  return (
    <section className="why-cresox" id="company">
      <div className="why-cresox__container">
        <div className="why-cresox__header">
          <h2 className="why-cresox__title">Why CresoX</h2>
          <p className="why-cresox__subtitle">
            Enterprise-grade infrastructure designed for teams that need reliability,
            speed, and clarity in every financial operation.
          </p>
        </div>

        <div className="why-cresox__grid">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <article className="why-cresox__card" key={title}>
              <div className="why-cresox__icon">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="why-cresox__card-title">{title}</h3>
              <p className="why-cresox__card-desc">{desc}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="why-cresox__cta">
        <div className="why-cresox__cta-inner">
          <h2 className="why-cresox__cta-title">Ready to join CresoX?</h2>
          <p className="why-cresox__cta-desc">
            Create your account in minutes or talk to our sales team about enterprise plans.
          </p>
          <div className="why-cresox__cta-actions">
            <Link to="/register" className="btn btn-white btn-lg why-cresox__cta-btn">
              Register
            </Link>
            <a href="#contact" className="btn btn-secondary btn-lg why-cresox__cta-btn why-cresox__cta-btn--outline">
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Platform;
