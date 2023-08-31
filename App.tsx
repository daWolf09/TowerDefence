import React, { useState, useEffect } from "react";
import { useEthers, useLookupAddress } from "@usedapp/core";
import { abis, addresses } from "@my-app/contracts";
import './index.css';

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


function Zombie({ index,despawntime}: { index: number,despawntime: number }) {
  const [isFlying, setIsFlying] = useState(true);

  useEffect(() => {
    let animationTimeout: NodeJS.Timeout;

    if (isFlying) {
      animationTimeout = setTimeout(() => {
        setIsFlying(false);
      }, despawntime);
    }

    return () => clearTimeout(animationTimeout);
  }, [isFlying]);

  return (
    <img
      className={`flying-image ${!isFlying ? 'hide' : ''}`}
      src="https://raw.githubusercontent.com/daWolf09/TowerDefence/main/Pixelart%20Parts/NEW_ZOMBIE_nobg.png"
      alt={`Flying Zombie ${index}`}
    />
  );
}
function handleButtonClick(pos: number) {
  const buttonID = `BuildButton${pos}`;
  const button = document.getElementsByClassName(buttonID)[0];
  if (button) {
    button.classList.add("clicked");
  }
}
function Base_Build_request(pos: number) {
  handleButtonClick(pos);
}



function App() {
  const healthPercentage = 5; // Setze den Gesundheitsprozentsatz hier
  const isMediumHealth = healthPercentage >= 30 && healthPercentage <= 50;
  const isLowHealth = healthPercentage < 30;
  const [zombies, setZombies] = useState<JSX.Element[]>([]);
  const [isFlying, setIsFlying] = useState(false);
  const [disabledButtons, setDisabledButtons] = useState<number[]>([]); // Zustand für deaktivierte Buttons
  const WaveState = "Wave in Progress";
  const spawnZombie = () => {
    console.log("Spawn Zombie called"); // Überprüfen, ob die Funktion aufgerufen wird
    //Todo:Smartcontract
    setZombies([...zombies, <Zombie key={zombies.length} index={zombies.length} despawntime={50000} />]);
  };
  const handleBuildButtonClick = (buttonNum: number) => {
    handleButtonClick(buttonNum);
    
  };
  
  return (
    <div className="container">
            <div className={`health-bar ${isLowHealth ? 'low-health' : ''} ${isMediumHealth ? 'medium-health' : ''}`}>
            <div className="health" style={{ width: `${healthPercentage}%` }}></div>
            <span className="health-text">{healthPercentage}%</span>
    </div>
        <span className="WaveStatecss">{WaveState}</span>
      <div className="buttons-container">
        <button className="startFlyingButton" onClick={() => {
          
          spawnZombie()
          setIsFlying(true)}}>
          Start Flying
        </button>
        <button className="BuildButton1" onClick={() => Base_Build_request(1)}></button>
        <button className="BuildButton2" onClick={() => Base_Build_request(2)}></button>
        <button className="BuildButton3" onClick={() => Base_Build_request(3)}></button>
        <button className="BuildButton4" onClick={() => Base_Build_request(4)}></button>
        <button className="BuildButton5" onClick={() => Base_Build_request(5)}></button>
        <button className="BuildButton6" onClick={() => Base_Build_request(6)}></button>
        <button className="BuildButton7" onClick={() => Base_Build_request(7)}></button>
        <button className="BuildButton8" onClick={() => Base_Build_request(8)}></button>
        <button className="BuildButton9" onClick={() => Base_Build_request(9)}></button>
        <button className="BuildButton10" onClick={() => Base_Build_request(10)}></button>
        <button className="BuildButton11" onClick={() => Base_Build_request(11)}></button>
        <button className="BuildButton12" onClick={() => Base_Build_request(12)}></button>
        <button className="BuildButton13" onClick={() => Base_Build_request(13)}></button>
        <button className="BuildButton14" onClick={() => Base_Build_request(14)}></button>
        <button className="BuildButton15" onClick={() => Base_Build_request(15)}></button>
        <button className="BuildButton16" onClick={() => Base_Build_request(16)}></button>
        <button className="BuildButton17" onClick={() => Base_Build_request(17)}></button>
        <button className="BuildButton18" onClick={() => Base_Build_request(18)}></button>
        <button className="BuildButton19" onClick={() => Base_Build_request(19)}></button>
        <button className="BuildButton20" onClick={() => Base_Build_request(20)}></button>
        <button className="BuildButton21" onClick={() => Base_Build_request(21)}></button>
        <button className="BuildButton22" onClick={() => Base_Build_request(22)}></button>
        <button className="BuildButton23" onClick={() => Base_Build_request(23)}></button>
        <button className="BuildButton24" onClick={() => Base_Build_request(24)}></button>
        <button className="BuildButton25" onClick={() => Base_Build_request(25)}></button>
        <button className="BuildButton26" onClick={() => Base_Build_request(26)}></button>
        <button className="BuildButton27" onClick={() => Base_Build_request(27)}></button>
        <button className="BuildButton28" onClick={() => Base_Build_request(28)}></button>
        <button className="BuildButton29" onClick={() => Base_Build_request(29)}></button>
        <button className="BuildButton30" onClick={() => Base_Build_request(30)}></button>
        <button className="BuildButton31" onClick={() => Base_Build_request(31)}></button>
        <button className="BuildButton32" onClick={() => Base_Build_request(32)}></button>
        <button className="BuildButton33" onClick={() => Base_Build_request(33)}></button>
        <button className="BuildButton34" onClick={() => Base_Build_request(34)}></button>
        <button className="BuildButton35" onClick={() => Base_Build_request(35)}></button>
        <button className="BuildButton36" onClick={() => Base_Build_request(36)}></button>
        <button className="BuildButton37" onClick={() => Base_Build_request(37)}></button>
        <button className="BuildButton38" onClick={() => Base_Build_request(38)}></button>
        <button className="BuildButton39" onClick={() => Base_Build_request(39)}></button>
        <button className="BuildButton40" onClick={() => Base_Build_request(40)}></button>
        <button className="BuildButton41" onClick={() => Base_Build_request(41)}></button>
        <button className="BuildButton42" onClick={() => Base_Build_request(42)}></button>
        <button className="BuildButton43" onClick={() => Base_Build_request(43)}></button>
        <button className="BuildButton44" onClick={() => Base_Build_request(44)}></button>
        <button className="BuildButton45" onClick={() => Base_Build_request(45)}></button>
        <button className="BuildButton46" onClick={() => Base_Build_request(46)}></button>
        <button className="BuildButton47" onClick={() => Base_Build_request(47)}></button>
        <button className="BuildButton48" onClick={() => Base_Build_request(48)}></button>
        <button className="BuildButton49" onClick={() => Base_Build_request(49)}></button>
      
        <button className="BuildButton51" onClick={() => Base_Build_request(51)}></button>
   
        <button className="BuildButton53" onClick={() => Base_Build_request(53)}></button>
       
        <button className="BuildButton55" onClick={() => Base_Build_request(55)}></button>
        
        <button className="BuildButton57" onClick={() => Base_Build_request(57)}></button>
       
        <button className="BuildButton59" onClick={() => Base_Build_request(59)}></button>
        
        <button className="BuildButton61" onClick={() => Base_Build_request(61)}></button>
        
        <button className="BuildButton63" onClick={() => Base_Build_request(63)}></button>


      </div>

      <div>
        {zombies.map((zombie, index) => (
          <Zombie key={index} index={index} despawntime={50000} />
        ))}
      </div>

      <div className="header">
        <WalletButton />
      </div>
    </div>
  );
}

export default App;
