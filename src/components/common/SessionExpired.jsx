export default function SessionExpired({ onRelogin }) {
  return (
    <div style={{textAlign:'center',padding:32}}>
      <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>Session Expired</div>
      <div style={{color:'var(--text-muted)',marginBottom:12}}>Please sign in again to continue.</div>
      <div>
        <button className="btn btn-primary" onClick={onRelogin}>Sign In</button>
      </div>
    </div>
  );
}
