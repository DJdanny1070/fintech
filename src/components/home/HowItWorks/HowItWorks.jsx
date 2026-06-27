import { UserPlus, Link2, ShoppingBag, BarChart3 } from "lucide-react";
import "./HowItWorks.css";

const STEPS = [
  {
    num: "01",
    icon: UserPlus,
    title: "Create your account",
    desc: "Register in under 2 minutes. Choose your role — Individual, Business, Buyer, or Seller — and get a purpose-built dashboard instantly.",
  },
  {
    num: "02",
    icon: Link2,
    title: "Connect your finances",
    desc: "Link your bank account, set up your wallet, and import existing portfolios. All data is encrypted with AES-256.",
  },
  {
    num: "03",
    icon: ShoppingBag,
    title: "Transact with confidence",
    desc: "Every payment, purchase, or listing is blockchain-verified. You receive an immutable receipt for every action.",
  },
  {
    num: "04",
    icon: BarChart3,
    title: "Measure everything",
    desc: "Access real-time analytics, portfolio performance, tax summaries, and custom reports — all in one exportable dashboard.",
  },
];

function HowItWorks() {
  return (
    <section className="hiw">
      <div className="container">
        <div className="section-header">
          <span className="tag">How It Works</span>
          <h2 className="h2">Up and running in minutes.</h2>
          <p className="lead">
            No lengthy onboarding. No paperwork. Register, connect, and start transacting.
          </p>
        </div>

        <div className="hiw__grid">
          {STEPS.map(({ num, icon: Icon, title, desc }) => (
            <div className="hiw__step" key={num}>
              <div className="hiw__step-num">{num}</div>
              <div className="hiw__step-icon">
                <Icon size={18} />
              </div>
              <h3 className="hiw__step-title">{title}</h3>
              <p className="hiw__step-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
