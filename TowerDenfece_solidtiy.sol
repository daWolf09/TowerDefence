// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TowerDefenseGame {
    address public owner;
    uint256 public gameStartTime;
    uint256 public baseHP;
    uint256 public gameBalance;
    bool public isWaveInProgress;

    mapping(string => uint256) public baseBuilds;
    mapping(string => uint256) public waypoints;
    mapping(string => uint256) public enemyHealth;

    // Angriffsstärken der Basen für verschiedene Wegfelder
    mapping(string => mapping(string => uint256)) public baseAttacks;

    // Liste von Wegfeldern für jede der 40 Basen
    mapping(string => string[]) public baseWaypoints;

    constructor() {
        owner = msg.sender;
        gameStartTime = 0;
        baseHP = 10000;
        isWaveInProgress = false;

        // Initialisierung der Liste von Wegpunkten für jede der 40 Basen
        baseWaypoints["Base1"] = ["W1", "W2"];
        baseWaypoints["Base2"] = ["W1", "W2"];
        baseWaypoints["Base3"] = ["W7", "W8", "W9"];
        baseWaypoints["Base4"] = ["W10", "W11", "W12"];
        baseWaypoints["Base5"] = ["W13", "W14", "W15"];
        baseWaypoints["Base6"] = ["W16", "W17", "W18"];
        baseWaypoints["Base7"] = ["W19", "W20", "W21"];
        baseWaypoints["Base8"] = ["W22", "W23", "W24"];
        baseWaypoints["Base9"] = ["W25", "W26", "W27"];
        baseWaypoints["Base10"] = ["W28", "W29", "W30"];
        baseWaypoints["Base11"] = ["W31", "W32", "W33"];
        baseWaypoints["Base12"] = ["W34", "W35", "W36"];
        baseWaypoints["Base13"] = ["W37", "W38", "W39"];
        baseWaypoints["Base14"] = ["W40", "W41", "W42"];
        baseWaypoints["Base15"] = ["W43", "W44", "W45"];
        baseWaypoints["Base16"] = ["W46", "W47", "W48"];
        baseWaypoints["Base17"] = ["W49", "W50", "W51"];
        baseWaypoints["Base18"] = ["W52", "W53", "W54"];
        baseWaypoints["Base19"] = ["W55", "W56", "W57"];
        baseWaypoints["Base20"] = ["W58", "W59", "W60"];
        baseWaypoints["Base21"] = ["W61", "W62", "W63"];
        baseWaypoints["Base22"] = ["W64", "W65", "W66"];
        baseWaypoints["Base23"] = ["W67", "W68", "W69"];
        baseWaypoints["Base24"] = ["W70", "W71", "W72"];
        baseWaypoints["Base25"] = ["W73", "W74", "W75"];
        baseWaypoints["Base26"] = ["W76", "W77", "W78"];
        baseWaypoints["Base27"] = ["W79", "W80", "W81"];
        baseWaypoints["Base28"] = ["W82", "W83", "W84"];
        baseWaypoints["Base29"] = ["W85", "W86", "W87"];
        baseWaypoints["Base30"] = ["W88", "W89", "W90"];
        baseWaypoints["Base31"] = ["W91", "W92", "W93"];
        baseWaypoints["Base32"] = ["W94", "W95", "W96"];
        baseWaypoints["Base33"] = ["W97", "W98", "W99"];
        baseWaypoints["Base34"] = ["W100", "W101", "W102"];
        baseWaypoints["Base35"] = ["W103", "W104", "W105"];
        baseWaypoints["Base36"] = ["W106", "W107", "W108"];
        baseWaypoints["Base37"] = ["W109", "W110", "W111"];
        baseWaypoints["Base38"] = ["W112", "W113", "W114"];
        baseWaypoints["Base39"] = ["W115", "W116", "W117"];
        baseWaypoints["Base40"] = ["W118", "W119", "W120"];
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
        require(msg.value >= 0.05 ether, "Insufficient funds to start the game");
        gameStartTime = block.timestamp;
        gameBalance = msg.value;
    }

    function buildBase(string memory baseType) external gameInProgress {
        require(baseBuilds[baseType] == 0, "Base build slot is occupied");
        baseBuilds[baseType] = block.timestamp;
    }

    function startWave() external gameInProgress noWaveInProgress {
        require(baseBuilds["Main_Base"] > 0, "Main Base must be built first");
        isWaveInProgress = true;
    }

    function sendEnemy(string memory enemyType, uint256 health, string memory waypoint) external gameInProgress {
        require(enemyHealth[enemyType] == 0, "Enemy type already exists");
        enemyHealth[enemyType] = health;
        waypoints[enemyType] = stringToUint(waypoint);
    }

    function setBaseAttack(string memory baseType, string memory waypoint, uint256 attackStrength) external onlyOwner {
        baseAttacks[baseType][waypoint] = attackStrength;
    }

    function stringToUint(string memory s) pure internal returns (uint256 result) {
        bytes memory b = bytes(s);
        for (uint256 i = 0; i < b.length; i++) {
            uint256 val = uint256(uint8(b[i]));
            if (val >= 48 && val <= 57) {
                result = result * 10 + (val - 48);
            }
        }
    }

    function calculateTotalAttack(string memory baseType, string memory waypoint) internal view returns (uint256) {
        return baseAttacks[baseType][waypoint];
    }

    function updateWaveDifficulty() internal {
        // Logic to make waves progressively harder
    }

    function handleEnemyDeath(string memory enemyType) internal {
        uint256 waypoint = waypoints[enemyType];
        if (enemyHealth[enemyType] > 0) {
            if (waypoint == 1) {
                baseHP -= calculateTotalAttack("Main_Base", "W1"); // Deduct health from base if enemy reaches waypoint 1
            }
            enemyHealth[enemyType] = 0;
        }
    }

    function endWave() external onlyOwner {
        require(isWaveInProgress, "No wave in progress");
        isWaveInProgress = false;
        updateWaveDifficulty();
    }

    function paybackToOwner() external onlyOwner {
        require(baseHP <= 0, "Game is not over yet");
        payable(owner).transfer(address(this).balance);
    }
}
