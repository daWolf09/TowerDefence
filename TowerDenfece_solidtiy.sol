// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TowerDefenseGame {
    uint256 private constant START_ZOMBIE_HEALTH = 3;

    address public owner;
    uint256 public gameStartTime;
    uint256 public baseHP;
    uint256 public playerBalance;
    bool public isWaveInProgress;
    uint256 public waveNumber;

    bool public isWaveButtonEnabled = true;

    mapping(string => uint256) public enemyHealth;
    mapping(string => mapping(string => uint256)) private baseAttacks;
    mapping(string => string[]) public baseWaypoints;
    mapping(string => string) public waypoints;
    mapping(address => bool) public baseBuilds;

    uint256 public baseEnemyHealth = START_ZOMBIE_HEALTH;

    constructor() {
        owner = msg.sender;
        gameStartTime = 0;
        baseHP = 10000;
        isWaveInProgress = false;
        waveNumber = 0;

        playerBalance = 100;

        baseWaypoints["Base1"] = ["W1", "W2"];
        baseWaypoints["Base2"] = ["W1", "W2"];
        baseWaypoints["Base3"] = ["W1", "W2", "W3"];
        baseWaypoints["Base4"] = ["W1", "W2", "W3"];
        baseWaypoints["Base5"] = ["W2", "W3", "W4"];
        baseWaypoints["Base6"] = ["W3", "W4", "W5"];
        baseWaypoints["Base7"] = ["W3", "W4"];
        baseWaypoints["Base8"] = ["W5", "W6", "W7"];
        baseWaypoints["Base9"] = ["W4", "W5"];
        baseWaypoints["Base10"] = ["W6", "W7", "W8"];
        baseWaypoints["Base11"] = ["W4", "W5", "W6"];
        baseWaypoints["Base12"] = ["W7", "W8", "W9"];
        baseWaypoints["Base13"] = ["W5", "W6", "W7"];
        baseWaypoints["Base14"] = ["W8", "W9", "W10"];
        baseWaypoints["Base15"] = ["W6", "W7", "W8"];
        baseWaypoints["Base16"] = ["W9", "W10"];
        baseWaypoints["Base17"] = ["W7", "W8", "W9"];
        baseWaypoints["Base18"] = ["W20", "W21", "W23", "W20", "W19", "W24", "W25"];
        baseWaypoints["Base19"] = ["W9" , "W10" , "W11"];
        baseWaypoints["Base20"] = ["W18", "W19", "W20", "W24", "W25", "W26"];
        baseWaypoints["Base21"] = ["W11", "W12", "W13"];
        baseWaypoints["Base22"] = ["W17", "W18", "W19", "W25", "W26", "W27"];
        baseWaypoints["Base23"] = ["W12", "W13", "W14"];
        baseWaypoints["Base24"] = ["W16", "W17", "W18", "W26", "W27", "W28"];
        baseWaypoints["Base25"] = ["W14", "W15", "W16"];
        baseWaypoints["Base26"] = ["W15", "W16", "W17", "W27", "W28", "W29"];
        baseWaypoints["Base27"] = ["W16", "W17", "W18"];
        baseWaypoints["Base28"] = ["W15", "W16", "W28", "W29"];
        baseWaypoints["Base29"] = ["W17", "W18", "W19"];
        baseWaypoints["Base30"] = ["W29", "W30"];
        baseWaypoints["Base31"] = ["W18", "W19", "W20"];
        baseWaypoints["Base32"] = ["W29", "W30", "W31"];
        baseWaypoints["Base33"] = ["W19", "W20", "W21"];
        baseWaypoints["Base34"] = ["W30", "W31", "W32"];
        baseWaypoints["Base35"] = ["W20", "W21"];
        baseWaypoints["Base36"] = ["W31", "W32", "W33"];
        baseWaypoints["Base37"] = ["W21", "W22"];
        baseWaypoints["Base38"] = ["W32", "W33", "W34"];
        baseWaypoints["Base39"] = ["W21", "W22", "W23"];
        baseWaypoints["Base40"] = ["W33", "W34"];
        baseWaypoints["Base41"] = ["W22", "W23"];
        baseWaypoints["Base42"] = ["W34", "W35"];
        baseWaypoints["Base43"] = ["W23", "W24"];
        baseWaypoints["Base44"] = ["W34", "W35", "W36"];
        baseWaypoints["Base45"] = ["W23", "W24", "W25"];
        baseWaypoints["Base46"] = ["W35", "W36", "W37"];
        baseWaypoints["Base47"] = ["W24", "W25", "W26"];
        baseWaypoints["Base48"] = ["W36", "W37"];
        baseWaypoints["Base49"] = ["W25", "W26", "W27"];
        baseWaypoints["Base51"] = ["W26", "W27", "W28"];
        baseWaypoints["Base53"] = ["W28", "W29", "W30"];
        baseWaypoints["Base55"] = ["W30", "W31", "W32"];
        baseWaypoints["Base57"] = ["W31", "W32", "W33"];
        baseWaypoints["Base59"] = ["W33", "W34", "W35"];
        baseWaypoints["Base61"] = ["W35", "W36", "W37"];
        baseWaypoints["Base63"] = ["W36", "W37"];
        

            for (uint256 i = 1; i <= 55; i++) {
            string memory baseType = string(abi.encodePacked("Base", uintToString(i)));
            for (uint256 j = 0; j < baseWaypoints[baseType].length; j++) {
                baseAttacks[baseType][baseWaypoints[baseType][j]] = 10;
            }
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier gameInProgress() {
        require(gameStartTime > 0, "Game has not started yet");
        _;
    }

    modifier noWaveInProgress() {
        require(!isWaveInProgress, "A wave is already in progress");
        _;
    }

    function startGame() external payable {
        require(msg.value >= 0.00005 ether, "Insufficient funds to start the game");
        gameStartTime = block.timestamp;
        playerBalance = msg.value;
    }

    function startWave() external gameInProgress noWaveInProgress {
        require(isWaveButtonEnabled, "Next Wave button is disabled");
        require(baseBuilds[msg.sender], "You must build a base first");
        
        isWaveInProgress = true;
        isWaveButtonEnabled = false; // Deaktiviere den Button während der Wave
    }

    function updateWaveDifficulty() internal {
        waveNumber++;

        baseEnemyHealth += 10;

        for (uint256 i = 1; i <= 10; i++) {
            string memory enemyType = string(abi.encodePacked("Enemy_", uintToString(i)));
            enemyHealth[enemyType] = baseEnemyHealth * START_ZOMBIE_HEALTH;
        }

        uint256 totalDamage = calculateTotalDamageInPreviousWave();
        playerBalance += totalDamage;

        isWaveButtonEnabled = true;
    }

    function calculateTotalDamageInPreviousWave() internal view returns (uint256) {
        uint256 totalDamage = 0;
        for (uint256 i = 1; i <= 10; i++) {
            string memory enemyType = string(abi.encodePacked("Enemy_", uintToString(i)));
            uint256 damage = enemyHealth[enemyType] - (enemyHealth[enemyType] % baseEnemyHealth);
            totalDamage += damage;
        }
        return totalDamage;
    }

    function sendEnemy(string memory enemyType, uint256 health, string memory waypoint) external gameInProgress {
        require(enemyHealth[enemyType] == 0, "Enemy type already exists");
        enemyHealth[enemyType] = health;
        waypoints[enemyType] = waypoint;
    }

    function calculateTotalAttack(string memory baseType, string memory waypoint) internal view returns (uint256) {
        return baseAttacks[baseType][waypoint];
    }
    
    function handleEnemyDeath(string memory enemyType) internal {
        string memory baseType = "Main_Base";
        string memory waypoint = waypoints[enemyType];
        if (enemyHealth[enemyType] > 0) {
            if (keccak256(abi.encodePacked(waypoint)) == keccak256(abi.encodePacked("W1"))) {
                baseHP -= calculateTotalAttack(baseType, waypoint);
            }
            enemyHealth[enemyType] = 0;
        }
    }
    function buildBase() external gameInProgress {
        require(!baseBuilds[msg.sender], "You already built a base");
        baseBuilds[msg.sender] = true;
    }

    function paybackToOwner() external onlyOwner {
        require(baseHP <= 0, "Game is not over yet");
        payable(owner).transfer(address(this).balance);
    }

    function uintToString(uint256 value) pure internal returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
