import React, { useState, useEffect, useRef } from "react";
import { useEthers, useLookupAddress } from "@usedapp/core";
import { abis, addresses } from "@my-app/contracts";
import './index.css';
import{GetBaseLocation} from "./BaseLocations"

function getButtonCoordinates(pos: number) {
  const buttonID = `BuildButton${pos}`;
  const button = document.getElementById(buttonID);
  if (button) {
    const rect = button.getBoundingClientRect();
    console.log(`Koordinaten von ${buttonID}: Top: ${rect.top}, Left: ${rect.left}`);
  }
}

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


function Zombie({ index, despawntime }: { index: number, despawntime: number }) {
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
      id={index.toString()}
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




function App() {
  const zombiePositions = useRef<{ x: number; y: number }[]>([]);
  
  const handleBuildButtonClick = (pos: number) => {
    handleButtonClick(pos);
    getButtonCoordinates(pos);
  };
  
  const [buttonCoordinates, setButtonCoordinates] = useState<{ id: string, x: number, y: number }[]>([]);
  const getButtonCoordinates = (pos: number) => {
    const buttonID = `BuildButton${pos}`;
    const button = document.getElementById(buttonID);
    if (button) {
      const rect = button.getBoundingClientRect();
      const coordinates = { id: buttonID, x: rect.left, y: rect.top };
      setButtonCoordinates([...buttonCoordinates, coordinates]);
      console.log(`Koordinaten von ${buttonID}: Top: ${rect.top}, Left: ${rect.left}`);
      console.log(buttonCoordinates); // Hier den Array in der Konsole ausgeben
    }
  };
  
  
  const healthPercentage = 5; // Setze den Gesundheitsprozentsatz hier
  const isMediumHealth = healthPercentage >= 30 && healthPercentage <= 50;
  const isLowHealth = healthPercentage < 30;
  const [zombies, setZombies] = useState<JSX.Element[]>([]);
  const [bases, setBases] = useState<JSX.Element[]>([]);
  const [isFlying, setIsFlying] = useState(false);
  const [despawntime, setdespawntime] = useState(5000)
  const [disabledButtons, setDisabledButtons] = useState<number[]>([]); // Zustand für deaktivierte Buttons
  const WaveState = "Wave in Progress";
  const spawnZombieCheck = () => {
    console.log("Spawn Zombie called"); // Überprüfen, ob die Funktion aufgerufen wird
    //Todo:Smartcontract
    setZombies([...zombies, <Zombie key={zombies.length} index={zombies.length} despawntime={despawntime} />]);
  };
  

  const Base_Build_request = (pos: number) => {
    handleButtonClick(pos);
    getButtonCoordinates(pos); // Aufruf der Funktion, um die Koordinaten zu erhalten
  // find ref in dom = newBase
  // setBases([...bases, newBase])
  }
  

  function zombiestart(despawnit: number) {
    setdespawntime(despawnit)
    spawnZombieCheck();
    setIsFlying(true);
  }
  function spawnZombie() {
    const zombiePosition = { x:0, y:0};
    zombiePositions.current.push(zombiePosition);
  }

  function calculateCollision() {
    for (let baseIndex = 0; baseIndex < GetBaseLocation.length; baseIndex++) {
      const base = GetBaseLocation[baseIndex];
      const baseX = base.x;
      const baseY = base.y;
  
      for (let i = 0; i < zombiePositions.current.length; i++) {
        const zombiePosition = zombiePositions.current[i];
        const distance = Math.sqrt(
          (baseX - zombiePosition.x) ** 2 + (baseY - zombiePosition.y) ** 2
        );
  
        if (distance <= 100) {
          // Kollision zwischen Basis und Zombie
          console.log('Kollision zwischen Basis und Zombie');
        }
      }
    }
  }
  

  return (
    <div className="container">
      <div className={`health-bar ${isLowHealth ? 'low-health' : ''} ${isMediumHealth ? 'medium-health' : ''}`}>
        <div className="health" style={{ width: `${healthPercentage}%` }}></div>
        <span className="health-text">{healthPercentage}%</span>
        </div>
      <span className="WaveStatecss">{WaveState}</span>
      <div className="buttons-container">
        <button className="startFlyingButton" onClick={() => zombiestart(10000)}>
          Start Flying
        </button>
        <button id="BuildButton1" className="BuildButton1" onClick={() => Base_Build_request(1)}></button>
        <button id="BuildButton2" className="BuildButton2" onClick={() => Base_Build_request(2)}></button>
        <button id="BuildButton3" className="BuildButton3" onClick={() => Base_Build_request(3)}></button>
        <button id="BuildButton4" className="BuildButton4" onClick={() => Base_Build_request(4)}></button>
        <button id="BuildButton5" className="BuildButton5" onClick={() => Base_Build_request(5)}></button>
        <button id="BuildButton6" className="BuildButton6" onClick={() => Base_Build_request(6)}></button>
        <button id="BuildButton7" className="BuildButton7" onClick={() => Base_Build_request(7)}></button>
        <button id="BuildButton8" className="BuildButton8" onClick={() => Base_Build_request(8)}></button>
        <button id="BuildButton9" className="BuildButton9" onClick={() => Base_Build_request(9)}></button>
        <button id="BuildButton10" className="BuildButton10" onClick={() => Base_Build_request(10)}></button>
        <button id="BuildButton11" className="BuildButton11" onClick={() => Base_Build_request(11)}></button>
        <button id="BuildButton12" className="BuildButton12" onClick={() => Base_Build_request(12)}></button>
        <button id="BuildButton13" className="BuildButton13" onClick={() => Base_Build_request(13)}></button>
        <button id="BuildButton14" className="BuildButton14" onClick={() => Base_Build_request(14)}></button>
        <button id="BuildButton15" className="BuildButton15" onClick={() => Base_Build_request(15)}></button>
        <button id="BuildButton16" className="BuildButton16" onClick={() => Base_Build_request(16)}></button>
        <button id="BuildButton17" className="BuildButton17" onClick={() => Base_Build_request(17)}></button>
        <button id="BuildButton18" className="BuildButton18" onClick={() => Base_Build_request(18)}></button>
        <button id="BuildButton19" className="BuildButton19" onClick={() => Base_Build_request(19)}></button>
        <button id="BuildButton20" className="BuildButton20" onClick={() => Base_Build_request(20)}></button>
        <button id="BuildButton21" className="BuildButton21" onClick={() => Base_Build_request(21)}></button>
        <button id="BuildButton22" className="BuildButton22" onClick={() => Base_Build_request(22)}></button>
        <button id="BuildButton23" className="BuildButton23" onClick={() => Base_Build_request(23)}></button>
        <button id="BuildButton24" className="BuildButton24" onClick={() => Base_Build_request(24)}></button>
        <button id="BuildButton25" className="BuildButton25" onClick={() => Base_Build_request(25)}></button>
        <button id="BuildButton26" className="BuildButton26" onClick={() => Base_Build_request(26)}></button>
        <button id="BuildButton27" className="BuildButton27" onClick={() => Base_Build_request(27)}></button>
        <button id="BuildButton28" className="BuildButton28" onClick={() => Base_Build_request(28)}></button>
        <button id="BuildButton29" className="BuildButton29" onClick={() => Base_Build_request(29)}></button>
        <button id="BuildButton30" className="BuildButton30" onClick={() => Base_Build_request(30)}></button>
        <button id="BuildButton31" className="BuildButton31" onClick={() => Base_Build_request(31)}></button>
        <button id="BuildButton32" className="BuildButton32" onClick={() => Base_Build_request(32)}></button>
        <button id="BuildButton33" className="BuildButton33" onClick={() => Base_Build_request(33)}></button>
        <button id="BuildButton34" className="BuildButton34" onClick={() => Base_Build_request(34)}></button>
        <button id="BuildButton35" className="BuildButton35" onClick={() => Base_Build_request(35)}></button>
        <button id="BuildButton36" className="BuildButton36" onClick={() => Base_Build_request(36)}></button>
        <button id="BuildButton37" className="BuildButton37" onClick={() => Base_Build_request(37)}></button>
        <button id="BuildButton38" className="BuildButton38" onClick={() => Base_Build_request(38)}></button>
        <button id="BuildButton39" className="BuildButton39" onClick={() => Base_Build_request(39)}></button>
        <button id="BuildButton40" className="BuildButton40" onClick={() => Base_Build_request(40)}></button>
        <button id="BuildButton41" className="BuildButton41" onClick={() => Base_Build_request(41)}></button>
        <button id="BuildButton42" className="BuildButton42" onClick={() => Base_Build_request(42)}></button>
        <button id="BuildButton43" className="BuildButton43" onClick={() => Base_Build_request(43)}></button>
        <button id="BuildButton44" className="BuildButton44" onClick={() => Base_Build_request(44)}></button>
        <button id="BuildButton45" className="BuildButton45" onClick={() => Base_Build_request(45)}></button>
        <button id="BuildButton46" className="BuildButton46" onClick={() => Base_Build_request(46)}></button>
        <button id="BuildButton47" className="BuildButton47" onClick={() => Base_Build_request(47)}></button>
        <button id="BuildButton48" className="BuildButton48" onClick={() => Base_Build_request(48)}></button>
        <button id="BuildButton49" className="BuildButton49" onClick={() => Base_Build_request(49)}></button>

        <button id="BuildButton51" className="BuildButton51" onClick={() => Base_Build_request(51)}></button>

        <button id="BuildButton53" className="BuildButton53" onClick={() => Base_Build_request(53)}></button>

        <button id="BuildButton55" className="BuildButton55" onClick={() => Base_Build_request(55)}></button>

        <button id="BuildButton57" className="BuildButton57" onClick={() => Base_Build_request(57)}></button>

        <button id="BuildButton59" className="BuildButton59" onClick={() => Base_Build_request(59)}></button>

        <button id="BuildButton61" className="BuildButton61" onClick={() => Base_Build_request(61)}></button>

        <button id="BuildButton63" className="BuildButton63" onClick={() => Base_Build_request(63)}></button>



      </div>

      <div>
        {zombies.map((zombie, index) => (
          <Zombie key={index} index={index} despawntime={despawntime} />
        ))}
      </div>

      <div className="header">
        <WalletButton />
      </div>
    </div>
  );
}

export default App;
