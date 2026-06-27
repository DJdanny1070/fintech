import {
  UserPlus,
  ShieldCheck,
  Wallet,
  ShoppingBag,
  Link2,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import "./HowItWorks.css";

const STEPS = [
  { icon: UserPlus, label: "Register", desc: "Create your account" },
  { icon: ShieldCheck, label: "Verify", desc: "Complete KYC" },
  { icon: Wallet, label: "Wallet", desc: "Fund your balance" },
  { icon: ShoppingBag, label: "Marketplace", desc: "Buy or sell" },
  { icon: Link2, label: "Blockchain", desc: "Hash recorded" },
  { icon: BarChart3, label: "Analytics", desc: "Track performance" },
];

function HowItWorks() {
  return (
    <section className="hiw">
      <div className="hiw__container">
        <div className="hiw__header">
          <h2 className="hiw__title">How the ecosystem works</h2>
          <p className="hiw__subtitle">
            From registration to analytics — a clear path through every stage of the CresoX platform.
          </p>
        </div>

        <div className="hiw__timeline">
          {STEPS.map((step, index) => (
            <div className="hiw__step-wrap" key={step.label}>
              <div className="hiw__step">
                <div className="hiw__step-icon">
                  <step.icon size={18} strokeWidth={1.75} />
                </div>
                <span className="hiw__step-label">{step.label}</span>
                <span className="hiw__step-desc">{step.desc}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div className="hiw__arrow" aria-hidden="true">
                  <ArrowRight size={16} strokeWidth={1.75} className="hiw__arrow-icon hiw__arrow-icon--horizontal" />
                  <span className="hiw__arrow-icon hiw__arrow-icon--vertical">↓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
