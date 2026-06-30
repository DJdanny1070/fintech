import { useEffect, useRef, useState } from "react";
import "./Stats.css";
import { getCounts as getUserCounts } from "../../../services/profileService";
import { getTotalCount as getTxCount } from "../../../services/transactionService";

const DEFAULT_STATS = [
  { value: 0, suffix: "+", label: "Active Users", prefix: "", decimals: 0 },
  { value: 0, suffix: "", label: "Transactions", prefix: "", decimals: 0 },
  { value: 0, suffix: "+", label: "Verified Sellers", prefix: "", decimals: 0 },
  { value: 99.9, suffix: "%", label: "Uptime Guaranteed", prefix: "", decimals: 1 },
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
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [userCounts, txCount] = await Promise.all([
          getUserCounts(),
          getTxCount(),
        ]);
        if (!mounted) return;
        setStats([
          { value: userCounts.users || 0, suffix: "+", label: "Active Users", prefix: "", decimals: 0 },
          { value: txCount || 0, suffix: "", label: "Transactions", prefix: "", decimals: 0 },
          { value: userCounts.verified_sellers || 0, suffix: "+", label: "Verified Sellers", prefix: "", decimals: 0 },
          { value: 99.9, suffix: "%", label: "Uptime Guaranteed", prefix: "", decimals: 1 },
        ]);
      } catch (err) {
        console.error('Failed to load stats', err.message);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <section className="stats-section" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} started={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
