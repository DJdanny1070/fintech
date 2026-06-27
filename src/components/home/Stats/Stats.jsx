import { useEffect, useRef, useState } from "react";
import "./Stats.css";

const STATS = [
  { value: 50000,  suffix: "+", label: "Active Users",       prefix: "",  decimals: 0 },
  { value: 120,    suffix: "Cr+",label: "Transactions (₹)", prefix: "₹", decimals: 0 },
  { value: 1200,   suffix: "+", label: "Verified Sellers",   prefix: "",  decimals: 0 },
  { value: 99.9,   suffix: "%", label: "Uptime Guaranteed",  prefix: "",  decimals: 1 },
];

function useIntersection(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

function StatItem({ value, suffix, label, prefix, decimals, started }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!started) return;
    const duration = 2200;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(parseFloat((eased * value).toFixed(decimals)));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [started, value, decimals]);

  return (
    <div className="stat-item">
      <div className="stat-item__value">
        <span className="stat-item__prefix">{prefix}</span>
        {decimals > 0 ? display.toFixed(decimals) : Math.floor(display).toLocaleString("en-IN")}
        <span className="stat-item__suffix">{suffix}</span>
      </div>
      <div className="stat-item__label">{label}</div>
    </div>
  );
}

function Stats() {
  const ref = useRef(null);
  const visible = useIntersection(ref);

  return (
    <section className="stats-section" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} started={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
