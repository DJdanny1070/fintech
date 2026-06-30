import { ArrowRight, PhoneCall } from "lucide-react";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content hero__animate">
          {/* Eyebrow */}
          <span className="hero__eyebrow">CresoX Fintech Private Limited</span>

          <h1 className="hero__headline">
            Empowering Investments Through{" "}
            <span className="hero__headline-accent">Tokenization</span>
          </h1>

          <p className="hero__description">
            Building innovative fintech solutions that bridge real-world assets
            with modern investment opportunities through secure tokenization.
          </p>

          <div className="hero__actions">
            <a href="#solutions" className="btn btn-primary btn-lg hero__btn">
              Explore Our Solutions
              <ArrowRight size={16} strokeWidth={1.75} />
            </a>
            <a href="#contact" className="btn btn-secondary btn-lg hero__btn">
              <PhoneCall size={16} strokeWidth={1.75} />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
