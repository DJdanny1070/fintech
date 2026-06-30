export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div style={{display:'grid',gap:8}}>
      {Array.from({length:rows}).map((_,i) => (
        <div key={i} style={{height:48,background:'#f3f3f3',borderRadius:8}} />
      ))}
    </div>
  );
}
