import { ShieldCheck } from "lucide-react";
import "./BlockchainViz.css";

function BlockchainViz() {
  return (
    <section className="blockchain" id="blockchain">
      <div className="blockchain__container">
        <div className="blockchain__content">
          <h2 className="blockchain__title">Blockchain verification without compromising privacy</h2>
          <p className="blockchain__desc">
            CresoX stores only cryptographic hashes on the blockchain — never your personal
            information, account details, or transaction content. Your data stays private
            while every action remains independently verifiable.
          </p>

          <ul className="blockchain__points">
            <li>
              <ShieldCheck size={16} strokeWidth={1.75} />
              Only SHA-256 hashes are written on-chain
            </li>
            <li>
              <ShieldCheck size={16} strokeWidth={1.75} />
              User data remains encrypted and off-chain
            </li>
            <li>
              <ShieldCheck size={16} strokeWidth={1.75} />
              Any party can verify integrity without seeing private details
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default BlockchainViz;
