import { Wallet, ShoppingBag, Zap, BarChart3, Users, Shield } from "lucide-react";
import "./Platform.css";

const FEATURES = [
  {
    icon: Wallet,
    title: "Smart Wallet",
    desc: "Send, receive, and manage funds in real time. Every transaction tracked and secured.",
  },
  {
    icon: ShoppingBag,
    title: "Verified Marketplace",
    desc: "Buy and sell financial services from verified providers. Blockchain-authenticated listings.",
  },
  {
    icon: Zap,
    title: "Instant Settlements",
    desc: "Payments clear in under 3 seconds. No waiting for traditional bank clearances.",
  },
  {
    icon: Shield,
    title: "Blockchain Verification",
    desc: "Every order and payment is written to an immutable ledger. Full auditability.",
  },
];

function Platform() {
  return (
    <section className="platform" id="platform">
      <div className="container">
        <div className="section-header">
          <span className="tag">The Platform</span>
          <h2 className="h2">Everything your financial operations need</h2>
          <p className="lead">
            One platform. No switching between tools. Built for how modern
            businesses actually work.
          </p>
        </div>

        <div className="platform__grid">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div className="platform__card" key={title}>
              <div className="platform__icon-box">
                <Icon size={20} />
              </div>
              <h3 className="platform__card-title">{title}</h3>
              <p className="platform__card-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Platform;
