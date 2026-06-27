import "./Testimonials.css";

const TESTIMONIALS = [
  {
    quote: "We switched from three separate tools to CresoX and cut our SaaS spend by 40%. The marketplace verification alone saved us two bad vendor deals.",
    name: "Priya Sharma",
    role: "CFO, Novatek Solutions",
    initials: "PS",
    color: "#075AD8",
  },
  {
    quote: "As a seller, getting paid used to take 3–5 days. With CresoX, settlements are instant and I have a blockchain receipt for every transaction.",
    name: "Arjun Mehta",
    role: "Founder, FinStack Labs",
    initials: "AM",
    color: "#2C3E58",
  },
  {
    quote: "The first fintech product my non-technical team actually loves. Clean, fast, and everything is exactly where you'd expect it.",
    name: "Sneha Pillai",
    role: "Operations Head, Trendex Commerce",
    initials: "SP",
    color: "#16A34A",
  },
];

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <span className="tag">Testimonials</span>
          <h2 className="h2">Trusted by people who actually use it.</h2>
          <p className="lead">Real customers. Real results. No paid reviews.</p>
        </div>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonials__card" key={t.name}>
              <div className="testimonials__stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="testimonials__star">★</span>
                ))}
              </div>
              <p className="testimonials__quote">{t.quote}</p>
              <div className="testimonials__author">
                <div className="testimonials__avatar" style={{ background: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <div className="testimonials__name">{t.name}</div>
                  <div className="testimonials__role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
