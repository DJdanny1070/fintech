import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content hero__animate">
          <h1 className="hero__headline">
            CresoX — The Complete Financial Ecosystem
          </h1>

          <p className="hero__description">
            Manage your wallet, trade on a verified marketplace, and record every
            transaction on the blockchain — all from one secure platform built for
            startups, businesses, and developers across India.
          </p>

          <div className="hero__actions">
            <Link to="/register" className="btn btn-primary btn-lg hero__btn">
              Get Started
            </Link>
            <a href="#marketplace" className="btn btn-secondary btn-lg hero__btn">
              Explore Marketplace
              <ArrowRight size={16} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
