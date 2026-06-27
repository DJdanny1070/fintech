import "./TrustedBy.css";

const TRUST_GROUPS = [
  {
    category: "Startups",
    logos: [
      { name: "Launchpad", initials: "LP" },
      { name: "Nova Labs", initials: "NL" },
    ],
  },
  {
    category: "Businesses",
    logos: [
      { name: "Meridian Corp", initials: "MC" },
      { name: "Axis Trade", initials: "AT" },
    ],
  },
  {
    category: "Developers",
    logos: [
      { name: "StackForge", initials: "SF" },
      { name: "CodeRoute", initials: "CR" },
    ],
  },
  {
    category: "Investors",
    logos: [
      { name: "Peak Capital", initials: "PC" },
      { name: "Horizon VC", initials: "HV" },
    ],
  },
];

function LogoPlaceholder({ initials, name }) {
  return (
    <div className="trusted-by__logo" aria-label={name}>
      <span className="trusted-by__mark" aria-hidden="true">
        {initials}
      </span>
      <span className="trusted-by__name">{name}</span>
    </div>
  );
}

function TrustedBy() {
  return (
    <section className="trusted-by" aria-labelledby="trusted-by-heading">
      <div className="trusted-by__container">
        <div className="trusted-by__header">
          <h2 id="trusted-by-heading" className="trusted-by__title">
            Trusted by
          </h2>
          <p className="trusted-by__subtitle">
            Startups, businesses, developers, and investors building on CresoX
          </p>
        </div>

        <div className="trusted-by__grid">
          {TRUST_GROUPS.map((group) => (
            <div key={group.category} className="trusted-by__group">
              <span className="trusted-by__category">{group.category}</span>
              <div className="trusted-by__logos">
                {group.logos.map((logo) => (
                  <LogoPlaceholder key={logo.name} initials={logo.initials} name={logo.name} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedBy;
