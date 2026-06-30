export default function NetworkError({ message = 'Network error. Please try again later.' }) {
  return (
    <div style={{padding:24,background:'#fff5f5',border:'1px solid #fecaca',borderRadius:8,color:'#b91c1c'}}>
      <div style={{fontWeight:700,marginBottom:6}}>Network Error</div>
      <div>{message}</div>
    </div>
  );
}
