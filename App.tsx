import React, { useState, useEffect } from "react";
import { useEthers, useLookupAddress } from "@usedapp/core";
import { abis, addresses } from "@my-app/contracts";

function WalletButton() {
  const { account, activateBrowserWallet, deactivate } = useEthers();
  const { ens } = useLookupAddress(account);

  const [showFullAddress, setShowFullAddress] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    setIsFlashing(!account);
  }, [account]);

  const toggleAddressDisplay = () => {
    setShowFullAddress(!showFullAddress);
  };

  const handleConnectWallet = () => {
    if (account) {
      toggleAddressDisplay();
    } else {
      activateBrowserWallet();
    }
  };

  return (
    <button className={`LEO${isFlashing ? " flashing" : ""}`} onClick={handleConnectWallet}>
      {account ? (
        <div className="walletInfo">
          <span>
            {showFullAddress
              ? account
              : `${account.slice(0, 6)}...${account.slice(-4)}`}
          </span>
          <button className="smallButton" onClick={toggleAddressDisplay}>
            {showFullAddress ? "<" : ">"}
          </button>
        </div>
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
}

function App() {
  return (
    <div className="container">
      <div className="header">
        <WalletButton />
      </div>
    </div>
  );
}

export default App;
