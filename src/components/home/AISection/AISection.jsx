import { useState, useEffect } from "react";
import "./AISection.css";

const PROMPTS = [
  "How should I invest ₹1,00,000 for 5 years?",
  "What are the best sectors to invest in right now?",
  "How can I reduce my tax liability as a business?",
  "Should I buy or lease commercial property?",
];

const RESPONSES = [
  "Based on your risk profile and a 5-year horizon, I recommend: 40% in diversified equity mutual funds, 30% in index funds (Nifty 50), 20% in government bonds for stability, and 10% in gold ETFs as a hedge. This portfolio historically yields 12–15% CAGR.",
  "Current market signals suggest strong momentum in: IT & Tech (AI adoption), Green Energy (policy tailwinds), Healthcare (post-COVID growth), and Financial Services (credit expansion). Consider sector ETFs for diversified exposure.",
  "Key strategies for business tax optimization: Maximize depreciation on assets, claim R&D deductions, explore SEZ benefits, utilize startup exemptions under Section 80-IAC, and consider an HUF structure for family businesses.",
  "Decision matrix: Buying builds equity, offers tax benefits (depreciation), and provides long-term asset appreciation. Leasing preserves capital, offers flexibility, and keeps OpEx lower. For <₹2Cr budget in Tier-1 cities, leasing is advisable.",
];

function AISection() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [typed, setTyped]         = useState("");
  const [response, setResponse]   = useState("");
  const [phase, setPhase]         = useState("typing"); // typing | thinking | responding | done

  useEffect(() => {
    const timeouts = [];
    const prompt = PROMPTS[promptIdx];
    const resp = RESPONSES[promptIdx];

    timeouts.push(setTimeout(() => {
      setTyped("");
      setResponse("");
      setPhase("typing");
    }, 0));

    let charIdx = 0;
    let respIdx = 0;
    let respInterval = null;

    function startResponding() {
      setPhase("responding");
      respInterval = setInterval(function tickResp() {
        respIdx += 1;
        setResponse(resp.slice(0, respIdx));
        if (respIdx >= resp.length) {
          clearInterval(respInterval);
          setPhase("done");
          const t = setTimeout(function nextPrompt() {
            setPromptIdx(function(idx) { return (idx + 1) % PROMPTS.length; });
          }, 3500);
          timeouts.push(t);
        }
      }, 18);
      const safetyTimer = setTimeout(function clearResp() {
        clearInterval(respInterval);
      }, 20000);
      timeouts.push(safetyTimer);
    }

    const typeInterval = setInterval(function tickType() {
      charIdx += 1;
      setTyped(prompt.slice(0, charIdx));
      if (charIdx >= prompt.length) {
        clearInterval(typeInterval);
        timeouts.push(setTimeout(() => setPhase("thinking"), 0));
        const t = setTimeout(startResponding, 1000);
        timeouts.push(t);
      }
    }, 55);

    return function cleanup() {
      clearInterval(typeInterval);
      if (respInterval) clearInterval(respInterval);
      timeouts.forEach(function(t) { clearTimeout(t); });
    };
  }, [promptIdx]);

  return (
    <section className="ai-section section">
      <div className="container">
        <div className="ai-layout">
          {/* Left copy */}
          <div className="ai-copy">
            <div className="section-badge">🤖 AI Insights</div>
            <h2 className="section-title">
              Your personal<br />
              <span className="gradient-text">financial advisor</span>
            </h2>
            <p className="section-subtitle">
              Ask CresoX AI anything about investments, markets, tax planning,
              or financial strategy. Powered by real-time market data and
              machine learning.
            </p>
            <div className="ai-features">
              {["Real-time market data", "Personalized to your portfolio", "Tax optimization tips", "Risk assessment"].map(f => (
                <div className="ai-feature-chip" key={f}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{color:"var(--green-light)"}}>
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Right — chat widget */}
          <div className="ai-widget">
            <div className="ai-widget__header">
              <div className="ai-widget__avatar">🤖</div>
              <div>
                <div className="ai-widget__name">CresoX AI</div>
                <div className="ai-widget__status">
                  <span className="dot-live"></span>
                  Online · Financial Advisor Mode
                </div>
              </div>
              <div className="badge badge-blue" style={{marginLeft:"auto", fontSize:"11px"}}>GPT-4 Powered</div>
            </div>

            <div className="ai-widget__body">
              {/* User bubble */}
              <div className="ai-bubble ai-bubble--user">
                <div className="ai-bubble__content">
                  {typed}
                  {phase === "typing" && <span className="ai-cursor">|</span>}
                </div>
                <div className="ai-bubble__avatar">J</div>
              </div>

              {/* AI thinking */}
              {phase === "thinking" && (
                <div className="ai-bubble ai-bubble--ai ai-bubble--thinking">
                  <div className="ai-widget__avatar ai-widget__avatar--sm">🤖</div>
                  <div className="ai-thinking">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}

              {/* AI response */}
              {(phase === "responding" || phase === "done") && response && (
                <div className="ai-bubble ai-bubble--ai">
                  <div className="ai-widget__avatar ai-widget__avatar--sm">🤖</div>
                  <div className="ai-bubble__content">
                    {response}
                    {phase === "responding" && <span className="ai-cursor">|</span>}
                  </div>
                </div>
              )}
            </div>

            <div className="ai-widget__footer">
              <div className="ai-input-bar">
                <span className="ai-input-placeholder">Ask anything about finance...</span>
                <button className="ai-send-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
                </button>
              </div>
              <div className="ai-disclaimer">AI insights are educational. Not financial advice.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AISection;
