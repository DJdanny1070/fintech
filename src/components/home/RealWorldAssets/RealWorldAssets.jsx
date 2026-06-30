import {
  Building2,
  Zap,
  Landmark,
  FileText,
  Palette,
} from "lucide-react";
import "./RealWorldAssets.css";

const ASSETS = [
  {
    icon: Building2,
    title: "Real Estate",
    desc: "Residential, commercial, and industrial properties.",
  },
  {
    icon: Zap,
    title: "Renewable Energy Projects",
    desc: "Solar farms, wind energy projects, and other green infrastructure assets.",
  },
  {
    icon: Landmark,
    title: "Infrastructure",
    desc: "Roads, ports, laboratories, testing facilities, and large-scale development projects.",
  },
  {
    icon: FileText,
    title: "Receivables",
    desc: "Accounts receivable financing and premium collectible assets.",
  },
  {
    icon: Palette,
    title: "Arts & Collectibles",
    desc: "Fine art, paintings, rare collectibles, and other high-value tangible assets.",
  },
];

function RealWorldAssets() {
  return (
    <section className="rwa" id="solutions">
      <div className="rwa__container">
        {/* Header */}
        <div className="rwa__header">
          <span className="rwa__eyebrow">Target Real-World Assets</span>
          <h2 className="rwa__title">Assets We Focus On</h2>
          <p className="rwa__subtitle">
            We enable the tokenization of valuable real-world assets, creating
            new investment opportunities while improving liquidity and
            accessibility.
          </p>
        </div>

        {/* Asset cards */}
        <div className="rwa__grid">
          {ASSETS.map(({ icon: Icon, title, desc }) => (
            <article className="rwa__card" key={title}>
              <div className="rwa__icon">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <h3 className="rwa__card-title">{title}</h3>
              <p className="rwa__card-desc">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RealWorldAssets;
