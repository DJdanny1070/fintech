import "./TrustedBy.css";

const LOGOS = [
  { icon: "🏦", name: "HDFC Bank" },
  { icon: "💳", name: "Razorpay" },
  { icon: "📈", name: "Zerodha" },
  { icon: "📱", name: "PhonePe" },
  { icon: "🌱", name: "Groww" },
  { icon: "🔷", name: "Infosys" },
  { icon: "💰", name: "Paytm" },
  { icon: "🏢", name: "Navi" },
];

function TrustedBy() {
  return (
    <section className="trusted-by" id="company">
      <div className="container">
        <p className="trusted-by__label">Trusted by teams at leading companies</p>
        <div className="trusted-by__logos">
          {LOGOS.map(({ icon, name }) => (
            <div className="trusted-by__logo" key={name}>
              <span className="trusted-by__logo-icon">{icon}</span>
              <span className="trusted-by__logo-name">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedBy;
