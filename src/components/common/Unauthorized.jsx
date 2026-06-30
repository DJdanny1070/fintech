export default function Unauthorized({ title = 'Unauthorized', description = 'You do not have access to this resource.' }) {
  return (
    <div style={{textAlign:'center',padding:32}}>
      <div style={{fontSize:22,fontWeight:800,marginBottom:8}}>{title}</div>
      <div style={{color:'var(--text-muted)'}}>{description}</div>
    </div>
  );
}
