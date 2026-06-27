import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Globe, Lock } from "lucide-react";
import "./Hero.css";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay },
  }),
};

const BAR_HEIGHTS = [35, 55, 42, 70, 52, 85, 68, 90, 60, 100, 78, 95];
const BAR_COLORS  = [
  "#DBEAFE","#BFDBFE","#93C5FD","#60A5FA","#3B82F6",
  "#2563EB","#1D4ED8","#1E40AF","#1E3A8A","#075AD8",
  "#2563EB","#3B82F6",
];

const TXNS = [
  { icon: "💳", bg: "#EFF6FF", name: "Marketplace Purchase", date: "Today, 2:14 PM", amount: "−₹2,500", type: "debit" },
  { icon: "↗",  bg: "#F0FDF4", name: "Settlement Received",  date: "Today, 11:02 AM", amount: "+₹18,400", type: "credit" },
  { icon: "🔐", bg: "#FEF2F2", name: "Blockchain Verified",  date: "Yesterday", amount: "−₹4,000", type: "debit" },
];

function DashboardPreview() {
  return (
    <div className="hero-browser">
      {/* Browser chrome */}
      <div className="hero-browser__bar">
        <div className="hero-browser__dots">
          <div className="hero-browser__dot" style={{ background: "#FC5F5A" }} />
          <div className="hero-browser__dot" style={{ background: "#FDBC40" }} />
          <div className="hero-browser__dot" style={{ background: "#34C749" }} />
        </div>
        <div className="hero-browser__url">
          <Lock size={9} className="hero-browser__lock" />
          app.cresox.in/dashboard
        </div>
      </div>

      {/* Dashboard content */}
      <div className="hero-dash">
        <div className="hero-dash__topbar">
          <span className="hero-dash__topbar-label">CresoX Dashboard</span>
          <span className="hero-dash__live">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block", animation: "pulse-live 2s ease-in-out infinite" }} />
            Live
          </span>
        </div>

        {/* Stats */}
        <div className="hero-dash__stats">
          {[
            { label: "Portfolio", value: "₹12.4 Cr", change: "+14.5%", type: "up" },
            { label: "Wallet", value: "₹2,41,320", change: "+₹12,500", type: "up" },
            { label: "Transactions", value: "12,847", change: "Today", type: "neutral" },
          ].map((s) => (
            <div className="hero-dash__stat" key={s.label}>
              <div className="hero-dash__stat-label">{s.label}</div>
              <div className="hero-dash__stat-value">{s.value}</div>
              <div className={`hero-dash__stat-change ${s.type}`}>{s.change}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="hero-dash__chart-wrap">
          <div className="hero-dash__chart-label">Portfolio performance — 12 months</div>
          <div className="hero-dash__chart">
            {BAR_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="hero-dash__bar"
                style={{ height: `${h}%`, background: BAR_COLORS[i] }}
              />
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className="hero-dash__txns">
          {TXNS.map((t) => (
            <div className="hero-dash__txn" key={t.name}>
              <div className="hero-dash__txn-left">
                <div className="hero-dash__txn-icon" style={{ background: t.bg }}>
                  {t.icon}
                </div>
                <div>
                  <div className="hero-dash__txn-name">{t.name}</div>
                  <div className="hero-dash__txn-date">{t.date}</div>
                </div>
              </div>
              <div className={`hero-dash__txn-amount ${t.type}`}>{t.amount}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="hero-dash__footer">
          <ShieldCheck size={11} className="hero-dash__footer-icon" />
          All transactions blockchain-verified · SOC2 Compliant
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__layout">
        {/* Left — copy */}
        <div className="hero__copy">
          <motion.div
            className="hero__eyebrow"
            initial="hidden" animate="show" variants={fadeUp} custom={0}
          >
            <span className="hero__eyebrow-dot" />
            Trusted by 12,480+ businesses across India
          </motion.div>

          <motion.h1
            className="hero__headline"
            initial="hidden" animate="show" variants={fadeUp} custom={0.1}
          >
            One platform for<br />
            <span className="hero__headline-accent">every financial need.</span>
          </motion.h1>

          <motion.p
            className="hero__sub"
            initial="hidden" animate="show" variants={fadeUp} custom={0.2}
          >
            CresoX is a secure financial ecosystem where you can manage your wallet,
            trade on a verified marketplace, and have every transaction permanently
            recorded on the blockchain.
          </motion.p>

          <motion.div
            className="hero__ctas"
            initial="hidden" animate="show" variants={fadeUp} custom={0.3}
          >
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-lg">
              Explore the platform <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.div
            className="hero__trust"
            initial="hidden" animate="show" variants={fadeUp} custom={0.4}
          >
            {[
              { icon: ShieldCheck, text: "SOC2 Compliant" },
              { icon: Zap,         text: "Sub-3s settlements" },
              { icon: Globe,       text: "Blockchain-verified" },
            ].map(({ icon: Icon, text }) => (
              <div className="hero__trust-item" key={text}>
                <Icon size={14} className="hero__trust-icon" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — browser dashboard */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;