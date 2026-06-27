import { useState } from "react";
import "./Dashboard.css";

function BarChart({ data, color="#075AD8" }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <svg viewBox="0 0 500 110" style={{width:"100%",height:110}} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`bg${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.85"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.45"/>
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const bw = 28, gap = (500 - data.length * bw) / (data.length + 1);
        const x = gap + i * (bw + gap);
        const h = (d.v / max) * 90;
        return (
          <g key={d.l}>
            <rect x={x} y={100-h} width={bw} height={h} fill={`url(#bg${color.slice(1)})`} rx="3"/>
            <text x={x+bw/2} y="108" textAnchor="middle" fontSize="8" fill="#9CA3AF">{d.l}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ data, color="#075AD8" }) {
  const max = Math.max(...data.map(d => d.v));
  const W=500, H=90;
  const pts = data.map((d,i) => `${(i/(data.length-1))*(W-20)+10},${H-12-((d.v/max)*(H-24))}`).join(" ");
  const area = `10,${H} ` + pts + ` ${W-10},${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:90}} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`lf${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#lf${color.slice(1)})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const MONTHLY = [
  {l:"Jan",v:82},{l:"Feb",v:91},{l:"Mar",v:78},{l:"Apr",v:105},
  {l:"May",v:98},{l:"Jun",v:120},{l:"Jul",v:113},{l:"Aug",v:130},
  {l:"Sep",v:125},{l:"Oct",v:140},{l:"Nov",v:135},{l:"Dec",v:155},
];
const WEEKLY = [
  {l:"Mon",v:48},{l:"Tue",v:65},{l:"Wed",v:52},{l:"Thu",v:74},
  {l:"Fri",v:89},{l:"Sat",v:43},{l:"Sun",v:37},
];

const ASSETS = [
  { name:"Portfolio Fund A", type:"Mutual Fund",  value:"₹4,80,000", change:"↑ 18.2%", up:true  },
  { name:"Nifty 50 ETF",    type:"Index Fund",   value:"₹2,20,000", change:"↑ 12.1%", up:true  },
  { name:"Gold ETF",        type:"Commodity",    value:"₹80,000",   change:"↑ 5.4%",  up:true  },
  { name:"Govt Bond 2028",  type:"Fixed Income", value:"₹1,50,000", change:"↑ 3.8%",  up:true  },
  { name:"HDFC Shares",     type:"Equity",       value:"₹1,40,000", change:"↓ 2.1%",  up:false },
];

function Analytics() {
  const [range, setRange] = useState("1Y");

  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1>Analytics</h1>
            <p>Track your financial performance across all activity</p>
          </div>
          <div style={{display:"flex",gap:"var(--sp-1)"}}>
            {["7D","1M","3M","6M","1Y"].map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`btn btn-sm ${range===r?"btn-primary":"btn-secondary"}`}>{r}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="kpi-grid" style={{marginBottom:"var(--sp-5)"}}>
        {[
          { label:"Total Revenue",       value:"₹1.2 Cr",  change:"↑ 22.4% YoY",  up:true  },
          { label:"Marketplace Volume",  value:"₹48.5 L",  change:"↑ 34.1%",       up:true  },
          { label:"Avg. Monthly Growth", value:"14.8%",    change:"↑ +2.1pp",      up:true  },
          { label:"Blockchain Savings",  value:"₹1.8 L",   change:"vs. traditional",up:null },
        ].map(k => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-card__label">{k.label}</div>
            <div className="kpi-card__value" style={{marginTop:"var(--sp-2)"}}>{k.value}</div>
            <div className={`kpi-card__change ${k.up===true?"up":k.up===false?"down":"neutral"}`}>{k.change}</div>
          </div>
        ))}
      </div>

      <div className="two-col" style={{marginBottom:"var(--sp-5)"}}>
        <div className="content-card">
          <div className="content-card__header">
            <div>
              <div className="content-card__title">Monthly Revenue</div>
              <div className="content-card__sub">Full year · ₹ in Lakhs</div>
            </div>
            <span className="badge badge-green">↑ 22.4%</span>
          </div>
          <BarChart data={MONTHLY}/>
        </div>
        <div className="content-card">
          <div className="content-card__header">
            <div>
              <div className="content-card__title">Transaction Volume</div>
              <div className="content-card__sub">This week · ₹ in Lakhs</div>
            </div>
            <span className="badge badge-blue">↑ 34.1%</span>
          </div>
          <LineChart data={WEEKLY} color="#8b5cf6"/>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card__header">
          <div className="content-card__title">Top Assets</div>
          <button className="btn btn-ghost btn-sm">View Portfolio →</button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Asset</th><th>Type</th><th>Value</th><th>Change</th></tr>
          </thead>
          <tbody>
            {ASSETS.map(a => (
              <tr key={a.name}>
                <td style={{fontWeight:600,color:"var(--text-primary)"}}>{a.name}</td>
                <td><span className="badge badge-gray">{a.type}</span></td>
                <td style={{fontWeight:700,letterSpacing:"-0.02em"}}>{a.value}</td>
                <td style={{fontWeight:700,color:a.up?"var(--green)":"var(--red)"}}>{a.change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Analytics;
