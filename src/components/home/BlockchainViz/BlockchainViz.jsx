import { ShieldCheck } from "lucide-react";
import "./BlockchainViz.css";

const STEPS = [
  {
    num: "01", title: "Initiate",
    desc: "User authorises the transaction with CresoX credentials.",
    hash: "0xa3f8...d291",
  },
  {
    num: "02", title: "Sign",
    desc: "A cryptographic signature is generated and attached.",
    hash: "sig:7c94...b403",
  },
  {
    num: "03", title: "Hash",
    desc: "The transaction is assigned a unique SHA-256 hash.",
    hash: "sha256:f2c8...7a1e",
  },
  {
    num: "04", title: "Broadcast",
    desc: "The signed transaction is broadcast to validator nodes.",
    hash: "tx:0x8f12...c9d4",
  },
  {
    num: "05", title: "Confirmed",
    desc: "Consensus reached. Permanently written to an immutable block.",
    hash: "block:#482910",
  },
];

function BlockchainViz() {
  return (
    <section className="blockchain" id="blockchain">
      <div className="container blockchain__layout">
        {/* Left copy */}
        <div className="blockchain__copy">
          <span className="tag">Blockchain Security</span>
          <h2 className="h2" style={{ marginTop: 12 }}>Every transaction permanently verified.</h2>
          <p className="lead">
            CresoX writes every payment and marketplace order to an immutable
            distributed ledger. No tampering. No hidden fees. Full auditability
            — always.
          </p>

          <div className="blockchain__stats">
            {[
              { value: "12,847",  label: "Transactions verified\ntoday" },
              { value: "1.2s",    label: "Average confirmation\ntime" },
              { value: "99.98%",  label: "Network\nuptime" },
            ].map((s) => (
              <div className="blockchain__stat" key={s.label}>
                <div className="blockchain__stat-value">{s.value}</div>
                <div className="blockchain__stat-label" style={{ whiteSpace: "pre-line" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — steps panel */}
        <div className="blockchain__steps-wrap">
          <div className="blockchain__steps-header">
            <span className="blockchain__steps-title">Transaction lifecycle</span>
            <span className="blockchain__steps-badge">
              <ShieldCheck size={11} /> Verified
            </span>
          </div>
          <div className="blockchain__steps">
            {STEPS.map((step, i) => (
              <div className="blockchain__step" key={step.num}>
                <div className="blockchain__step-left">
                  <div className="blockchain__step-circle">{step.num}</div>
                  {i < STEPS.length - 1 && <div className="blockchain__step-line" />}
                </div>
                <div className="blockchain__step-content">
                  <div className="blockchain__step-title">{step.title}</div>
                  <div className="blockchain__step-desc">{step.desc}</div>
                  <span className="blockchain__step-hash">{step.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlockchainViz;
