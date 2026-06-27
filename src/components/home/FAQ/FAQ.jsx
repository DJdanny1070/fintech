import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import "./FAQ.css";

const ITEMS = [
  {
    q: "Is CresoX free to use?",
    a: "Creating an account is completely free. Marketplace transactions carry a 1.5% platform fee, and premium analytics plans start at ₹499/month. No hidden charges, ever.",
  },
  {
    q: "How does blockchain verification work?",
    a: "Every transaction is hashed using SHA-256 and broadcast to a distributed validator network. Once consensus is reached, it's written to an immutable block with a verifiable receipt — tamper-proof and permanently auditable.",
  },
  {
    q: "Is my financial data secure?",
    a: "Yes. We use AES-256 encryption for all stored data and TLS 1.3 for data in transit. CresoX is SOC2 Type II compliant and we never sell, share, or monetise your personal data.",
  },
  {
    q: "How quickly do payments settle?",
    a: "Payments on the CresoX network settle in under 3 seconds. Withdrawals to linked bank accounts follow standard banking timelines — T+1 for IMPS, T+2 for NEFT.",
  },
  {
    q: "Can I hold multiple roles on CresoX?",
    a: "Yes. You can register as an Individual, Business, Buyer, or Seller — and switch or combine roles at any time from your account settings without any additional verification.",
  },
  {
    q: "What happens if a marketplace transaction goes wrong?",
    a: "All marketplace listings are blockchain-verified before they go live. In the event of a dispute, our resolution team uses the immutable transaction ledger to arbitrate fairly within 48 hours.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="faq">
      <div className="container faq__layout">
        <div className="faq__copy">
          <span className="tag">FAQ</span>
          <h2 className="h2">Common questions answered.</h2>
          <p className="faq__copy-sub">
            Everything you need to know about CresoX. Can't find what you're
            looking for?
          </p>
          <a href="#" className="faq__copy-link">
            Contact our support team →
          </a>
        </div>

        <div className="faq__list">
          {ITEMS.map((item, i) => (
            <div className={`faq__item ${open === i ? "faq__item--open" : ""}`} key={i}>
              <button
                className="faq__question"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <span className="faq__question-icon">
                  {open === i ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>
              {open === i && (
                <div className="faq__answer">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
