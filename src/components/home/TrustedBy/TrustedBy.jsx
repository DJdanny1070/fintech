import "./TrustedBy.css";

const LOGOS = [
  "Infosys",  "HDFC Bank",  "Razorpay",  "Zerodha",
  "Paytm",    "PhonePe",    "Navi",       "Groww",
];

function TrustedBy() {
  return (
    <section className="trusted section--gray">
      <div className="container">
        <div className="trusted__label">
          Trusted by teams at leading companies
        </div>
        <div className="trusted__logos">
          {LOGOS.map(name => (
            <div className="trusted__logo-item" key={name}>{name}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedBy;
