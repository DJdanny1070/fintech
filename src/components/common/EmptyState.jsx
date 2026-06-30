export default function EmptyState({ title = 'Nothing here', description = '', action = null }) {
  return (
    <div style={{textAlign:'center',padding:32,color:'var(--text-muted)'}}>
      <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>{title}</div>
      {description && <div style={{marginBottom:12}}>{description}</div>}
      {action}
    </div>
  );
}
