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

    uint256 public baseEnemyHealth = START_ZOMBIE_HEALTH;

    constructor() {
        owner = msg.sender;
        gameStartTime = 0;
        baseHP = 10000;
        isWaveInProgress = false;
        waveNumber = 0;

        playerBalance = 100;

        baseWaypoints["Base1"] = ["W1", "W2"];
        // ... Fügen Sie die Initialisierung der anderen Waypoints hinzu ...

        for (uint256 i = 0; i < baseWaypoints["Base1"].length; i++) {
            for (uint256 j = 1; j <= 44; j++) {
                string memory baseType = string(abi.encodePacked("Base", uintToString(j)));
                baseAttacks[baseType][baseWaypoints["Base1"][i]] = 10;
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
        
        
        isWaveInProgress = true;
        isWaveButtonEnabled = false;
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
