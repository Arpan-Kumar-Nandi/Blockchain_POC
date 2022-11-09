// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract POC20 is ERC20 {

    uint public tokensPerUnitEther;
    address payable owner;

    constructor(uint exchangeRate) ERC20('POC_TOKEN', 'POC20') {
        tokensPerUnitEther = exchangeRate;
        owner = payable(msg.sender);

    }

    function buyTokens() public payable {
        require(msg.value > 0, "You need exchange some ethers for POC20");
        require(msg.sender != owner);
        uint convertEtherToPOCToken = msg.value * tokensPerUnitEther;
        payable(owner).transfer(msg.value);
        _mint(msg.sender, convertEtherToPOCToken);
    }

    function transferTokens(address payable from, address payable to, uint amount) public payable {
        _transfer(from, to, amount);
    }
}