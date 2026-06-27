import { useState } from "react";
import "./FAQ.css";

const ITEMS = [
  { q:"What is CresoX and who is it for?", a:"CresoX is an integrated financial platform for individuals, businesses, buyers, and sellers. It combines wallet, marketplace, blockchain verification, and analytics in one place. Whether you're an independent professional or a mid-sized enterprise, CresoX adapts to your needs." },
  { q:"Is CresoX free to use?", a:"Creating an account is completely free. Marketplace transactions carry a small 1.5% platform fee, and premium analytics plans start at ₹499/month. There are no hidden charges." },
  { q:"How does blockchain verification work?", a:"Every transaction on CresoX is hashed using SHA-256 and broadcast to a distributed validator network. Once confirmed, the transaction is written to an immutable block. You receive a verifiable receipt with a unique hash that anyone can audit." },
  { q:"Is my financial data secure?", a:"Yes. We use AES-256 encryption for all stored data and TLS 1.3 for data in transit. We are SOC2 Type II compliant and do not sell your data to third parties." },
  { q:"How quickly do payments settle?", a:"Payments on the CresoX network settle in under 3 seconds. Withdrawals to linked bank accounts follow standard banking timelines (T+1 for IMPS, T+2 for NEFT)." },
  { q:"Can I use CresoX for my business?", a:"Absolutely. Business accounts get access to multi-user management, invoice generation, B2B payment processing, and business credit assessment. You can add team members and assign roles directly from your dashboard." },
  { q:"What types of products can I sell on the Marketplace?", a:"You can list financial services, analytics tools, developer APIs, compliance reports, and digital assets. All listings must pass our verification process before going live." },
];

function FAQ() {
  const [open, setOpen] = useState(null);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section className="faq section section--gray">
      <div className="container">
        <div className="faq__layout">
          <div className="faq__copy">
            <div className="tag">FAQ</div>
            <h2 className="h2">Frequently asked questions</h2>
            <p className="lead" style={{marginTop:"var(--sp-4)"}}>
              Can't find the answer you're looking for?{" "}
              <a href="#" className="text-blue" style={{fontWeight:600}}>Contact our team</a>.
            </p>
          </div>
          <div className="faq__list">
            {ITEMS.map((item, i) => (
              <div
                className={`faq__item ${open === i ? "faq__item--open" : ""}`}
                key={i}
              >
                <button className="faq__question" onClick={() => toggle(i)}>
                  <span>{item.q}</span>
                  <svg
                    className="faq__icon"
                    width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12" className="faq__icon-h"/>
                  </svg>
                </button>
                {open === i && (
                  <div className="faq__answer animate-fade-up">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
