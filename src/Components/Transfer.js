import { useState } from "react";
import { Address, toNano } from "ton";
import { useTonConnect } from "../hooks/UseTonConnect";

export function TransferTon() {
  const { sender, connected } = useTonConnect();

  const [tonAmount, setTonAmount] = useState("0.01");
  const [tonRecipient, setTonRecipient] = useState(
    "UQBVG55fi3FjPFBprk6KVknXV4STHrWph08-cMlHgC3SBuG8"
  );

  return (
<>
<div className="w-full flex flex-col">



        <h3>Transfer TON</h3>
  
          <label>Amount </label>
          <input
            style={{ marginRight: 8 }}
            type="number"
            value={tonAmount}
            onChange={(e) => setTonAmount(e.target.value)}
          ></input>
   
   
          <label>To </label>
          <input
            style={{ marginRight: 8 }}
            value={tonRecipient}
            onChange={(e) => setTonRecipient(e.target.value)}
          ></input>
    
        <button
          disabled={!connected}
          style={{ marginTop: 18 }}
          onClick={async () => {
            sender.send({
              to: Address.parse(tonRecipient),
              value: toNano(tonAmount),
            });
          }}
        >
          Transfer
        </button>
        </div>
        </>
  );
}
