import "./Testimonials.css";

const TESTIMONIALS = [
  {
    quote: "We switched from three separate tools to CresoX and reduced our monthly SaaS spend by 40%. The marketplace verification alone saved us two bad vendor deals.",
    name: "Priya Sharma",
    role: "CFO",
    company: "Novatek Solutions",
    initials: "PS",
  },
  {
    quote: "As a marketplace seller, getting paid used to take 3–5 days. With CresoX, settlements are instant and I have a blockchain receipt for every single transaction.",
    name: "Arjun Mehta",
    role: "Founder",
    company: "FinStack Labs",
    initials: "AM",
  },
  {
    quote: "The dashboard is the first fintech product I've used that my non-technical team actually loves. Clean, fast, and everything is where you'd expect it.",
    name: "Sneha Pillai",
    role: "Operations Head",
    company: "Trendex Commerce",
    initials: "SP",
  },
];

function Testimonials() {
  return (
    <section className="testimonials section section--white">
      <div className="container">
        <div className="section-header">
          <div className="tag">Testimonials</div>
          <h2 className="h2">What our customers say</h2>
        </div>

        <div className="testimonials__grid">
          {TESTIMONIALS.map(t => (
            <div className="testimonials__card card" key={t.name}>
              <div className="testimonials__stars">
                {"★★★★★"}
              </div>
              <blockquote className="testimonials__quote">
                "{t.quote}"
              </blockquote>
              <div className="testimonials__author">
                <div className="testimonials__avatar">{t.initials}</div>
                <div>
                  <div className="testimonials__name">{t.name}</div>
                  <div className="testimonials__role">{t.role} · {t.company}</div>
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
