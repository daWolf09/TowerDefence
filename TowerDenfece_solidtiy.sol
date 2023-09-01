// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract TowerDefens {
    mapping(address => uint256) private playerBalances;
    uint256 BaseCost;

    function getPlayerBalance() public view returns (uint256) {
        return playerBalances[msg.sender];
    }

    function playerDeposit() public payable {
        require(msg.value >= 0.0005 ether, "You must deposit exactly 0.0005 ether.");
        playerBalances[msg.sender] += 0.0005 ether;//0.0005x = 100
    }

    function price() public {
        require(playerBalances[msg.sender] >= BaseCost, "Insufficient balance.");
        playerBalances[msg.sender] -= BaseCost;
        BaseCost*= 2;
    }
    function killedZombiesInMoney(uint hp)public{
        playerBalances[msg.sender] += hp;
    }
    function payBackToOwner()public {
        payable (msg.sender).transfer(playerBalances[msg.sender]);
    }
}
