import { useState, useEffect } from "react";
import "./Dashboard.css";

function genHash() {
  return "0x" + Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("")
    + "..." + Array.from({length:4},()=>Math.floor(Math.random()*16).toString(16)).join("");
}

function genBlock(num) {
  return {
    num,
    hash: genHash(),
    prevHash: genHash(),
    txns: Math.floor(Math.random()*20)+1,
    time: new Date().toLocaleTimeString(),
  };
}

const INITIAL_BLOCKS = [91435,91434,91433,91432,91431].map(genBlock);

function Blockchain() {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [selected, setSelected] = useState(INITIAL_BLOCKS[0]);
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks(prev => {
        const newBlock = genBlock(prev[0].num + 1);
        const updated = [newBlock, ...prev.slice(0, 9)];
        setSelected(s => s.num === prev[0].num ? newBlock : s);
        return updated;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    if (!verifyInput.trim()) return;
    const found = blocks.find(b => b.hash.includes(verifyInput.trim()) || b.num.toString() === verifyInput.trim());
    setVerifyResult(found ? "valid" : "invalid");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1>Blockchain Explorer</h1>
            <p>Live view of the CresoX verification network</p>
          </div>
          <span className="badge badge-green"><span className="dot-live"></span> Network live</span>
        </div>
      </div>

      {/* Network stats */}
      <div className="kpi-grid" style={{marginBottom:"var(--sp-5)"}}>
        {[
          { label:"Latest Block",    value:`#${blocks[0]?.num}` },
          { label:"Transactions/s",  value:"142 TPS" },
          { label:"Avg. Conf. Time", value:"1.18s" },
          { label:"Active Nodes",    value:"1,284" },
        ].map(s => (
          <div className="kpi-card" key={s.label}>
            <div className="kpi-card__label">{s.label}</div>
            <div className="kpi-card__value" style={{fontSize:18,marginTop:"var(--sp-2)"}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="two-col" style={{alignItems:"start",marginBottom:"var(--sp-5)"}}>
        {/* Block list */}
        <div className="content-card">
          <div className="content-card__header">
            <div className="content-card__title">Recent Blocks</div>
            <span className="badge badge-blue">Auto-updating</span>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Block</th><th>Hash</th><th>Txns</th><th>Time</th></tr>
            </thead>
            <tbody>
              {blocks.map(b => (
                <tr key={b.num} onClick={() => setSelected(b)}
                  style={{cursor:"pointer",background:selected.num===b.num?"var(--blue-light)":""}}>
                  <td style={{fontFamily:"monospace",fontWeight:700,color:"var(--blue)"}}>#{b.num}</td>
                  <td style={{fontFamily:"monospace",fontSize:12,color:"var(--text-muted)"}}>{b.hash}</td>
                  <td><span className="badge badge-gray">{b.txns}</span></td>
                  <td style={{color:"var(--text-muted)",fontSize:12}}>{b.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Block detail */}
        <div style={{display:"flex",flexDirection:"column",gap:"var(--sp-4)"}}>
          <div className="content-card">
            <div className="content-card__header">
              <div className="content-card__title">Block #{selected?.num}</div>
              <span className="badge badge-green">✓ Verified</span>
            </div>
            {[
              { label:"Block Number",  value:`#${selected?.num}` },
              { label:"Block Hash",    value:selected?.hash },
              { label:"Previous Hash", value:selected?.prevHash },
              { label:"Transactions",  value:`${selected?.txns} confirmed` },
              { label:"Confirmed At",  value:selected?.time },
            ].map(f => (
              <div key={f.label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)",gap:"var(--sp-4)"}}>
                <span style={{fontSize:12,color:"var(--text-muted)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",flexShrink:0}}>
                  {f.label}
                </span>
                <span style={{fontFamily:"monospace",fontSize:13,color:"var(--text-primary)",wordBreak:"break-all",textAlign:"right"}}>
                  {f.value}
                </span>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:"var(--sp-3)",marginTop:"var(--sp-4)",padding:"var(--sp-4)",background:"var(--green-light)",borderRadius:"var(--r-md)",border:"1px solid rgba(22,163,74,0.15)"}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"var(--green)"}}>Block Verified</div>
                <div style={{fontSize:12,color:"var(--text-muted)"}}>Confirmed by 1,284 validator nodes</div>
              </div>
            </div>
          </div>

          {/* Hash verifier */}
          <div className="content-card">
            <div className="content-card__header">
              <div className="content-card__title">Verify Transaction</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"var(--sp-3)"}}>
              <input className="input" placeholder="Enter hash or block number..."
                value={verifyInput} onChange={e => { setVerifyInput(e.target.value); setVerifyResult(null); }} />
              <button className="btn btn-primary w-full" style={{justifyContent:"center"}} onClick={handleVerify}>
                Verify Hash
              </button>
              {verifyResult === "valid" && (
                <div style={{display:"flex",alignItems:"center",gap:"var(--sp-2)",padding:"var(--sp-3)",background:"var(--green-light)",borderRadius:"var(--r-md)",fontSize:13,fontWeight:600,color:"var(--green)"}}>
                  ✓ Hash found and verified on chain
                </div>
              )}
              {verifyResult === "invalid" && (
                <div style={{display:"flex",alignItems:"center",gap:"var(--sp-2)",padding:"var(--sp-3)",background:"var(--red-light)",borderRadius:"var(--r-md)",fontSize:13,fontWeight:600,color:"var(--red)"}}>
                  ✕ Hash not found in recent blocks
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blockchain;
