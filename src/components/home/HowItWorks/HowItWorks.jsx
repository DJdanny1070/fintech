import "./HowItWorks.css";

const STEPS = [
  {
    num: "01",
    title: "Create your account",
    desc: "Register in under 2 minutes. Choose your role — Individual, Business, Buyer, or Seller — and get a personalised dashboard immediately. No credit card required.",
    visual: (
      <div className="hiw-visual hiw-visual--register">
        <div className="hiw-visual__card">
          <div className="hiw-visual__card-label">Create Account</div>
          <div className="hiw-visual__input-mock">
            <div className="hiw-visual__input-line"></div>
          </div>
          <div className="hiw-visual__input-mock">
            <div className="hiw-visual__input-line" style={{width:"70%"}}></div>
          </div>
          <div className="hiw-visual__roles">
            {["Individual","Business","Buyer","Seller"].map((r,i) => (
              <div key={r} className={`hiw-visual__role ${i===0?"active":""}`}>{r}</div>
            ))}
          </div>
          <div className="hiw-visual__btn">Get Started Free →</div>
        </div>
      </div>
    ),
  },
  {
    num: "02",
    title: "Connect your finances",
    desc: "Link your bank account, set up your wallet, and import existing portfolios. We use bank-grade encryption and never store your credentials.",
    visual: (
      <div className="hiw-visual hiw-visual--connect">
        <div className="hiw-visual__card">
          <div className="hiw-visual__card-label">Connect Bank</div>
          {["HDFC Bank •••• 4521","ICICI Bank •••• 8823","SBI Savings •••• 9012"].map((b,i) => (
            <div key={b} className={`hiw-visual__bank-row ${i===0?"active":""}`}>
              <div className="hiw-visual__bank-icon">🏦</div>
              <span>{b}</span>
              {i === 0 && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "03",
    title: "Transact with blockchain security",
    desc: "Every action — payment, purchase, or listing — is automatically recorded on the CresoX blockchain. You get a verifiable receipt for everything.",
    visual: (
      <div className="hiw-visual hiw-visual--tx">
        <div className="hiw-visual__card">
          <div className="hiw-visual__card-label">Transaction Confirmed</div>
          <div className="hiw-visual__tx-amount">+₹12,500</div>
          <div className="hiw-visual__tx-from">from Rahul Kumar</div>
          <div className="hiw-visual__tx-hash">
            <span>Hash:</span>
            <code>0x4f2a8e1b...c91d</code>
          </div>
          <div className="hiw-visual__tx-status">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Blockchain Verified
          </div>
        </div>
      </div>
    ),
  },
];

function HowItWorks() {
  return (
    <section className="hiw section section--white">
      <div className="container">
        <div className="section-header">
          <div className="tag">How It Works</div>
          <h2 className="h2">Up and running in minutes.</h2>
          <p className="lead">
            Getting started with CresoX is straightforward. No lengthy onboarding. No paperwork.
          </p>
        </div>

        <div className="hiw__steps">
          {STEPS.map((step, i) => (
            <div className={`hiw__step ${i % 2 === 1 ? "hiw__step--reverse" : ""}`} key={step.num}>
              <div className="hiw__step-copy">
                <div className="hiw__step-num">{step.num}</div>
                <h3 className="h3">{step.title}</h3>
                <p style={{fontSize:15,color:"var(--text-secondary)",lineHeight:1.7,marginTop:"var(--sp-3)"}}>
                  {step.desc}
                </p>
              </div>
              <div className="hiw__step-visual">{step.visual}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
