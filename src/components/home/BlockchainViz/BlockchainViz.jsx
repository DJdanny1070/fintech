import "./BlockchainViz.css";

const STEPS = [
  { num:"01", title:"Initiate",    desc:"User authorises the transaction with their CresoX credentials." },
  { num:"02", title:"Sign",        desc:"A cryptographic signature is generated and attached to the request." },
  { num:"03", title:"Hash",        desc:"The transaction receives a unique, tamper-proof SHA-256 hash." },
  { num:"04", title:"Broadcast",   desc:"The signed transaction is broadcast to the CresoX validator network." },
  { num:"05", title:"Confirmed",   desc:"Consensus reached. Transaction is written to an immutable block." },
];

function BlockchainViz() {
  return (
    <section className="bcv section section--gray" id="blockchain">
      <div className="container">
        <div className="bcv__layout">
          {/* Left */}
          <div className="bcv__copy">
            <div className="tag">Blockchain Security</div>
            <h2 className="h2">Every transaction permanently verified.</h2>
            <p className="lead" style={{marginTop:"var(--sp-4)"}}>
              CresoX writes every payment, agreement, and marketplace order
              to an immutable blockchain. No tampering. No hidden fees.
              Full auditability.
            </p>
            <div className="bcv__stats">
              {[
                { value:"12,847", label:"Transactions verified today" },
                { value:"1.2s",   label:"Average confirmation time" },
                { value:"99.98%", label:"Network uptime" },
              ].map(s => (
                <div className="bcv__stat" key={s.label}>
                  <div className="bcv__stat-value">{s.value}</div>
                  <div className="bcv__stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — horizontal stepper */}
          <div className="bcv__stepper">
            {STEPS.map((step, i) => (
              <div className="bcv__step" key={step.num}>
                <div className="bcv__step-left">
                  <div className="bcv__step-circle">
                    <span>{step.num}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="bcv__step-line"></div>}
                </div>
                <div className="bcv__step-content">
                  <div className="bcv__step-title">{step.title}</div>
                  <div className="bcv__step-desc">{step.desc}</div>
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
