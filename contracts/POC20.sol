// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract POC20 is ERC20 {

    uint public tokensPerUnitEther;
    address payable owner;

    constructor(uint exchangeRate) ERC20('POC_TOKEN', 'POC20') {
        _mint(msg.sender, 1000 * 10 ** 18);
        tokensPerUnitEther = exchangeRate;
        owner = payable(msg.sender);

    }

    function buyTokens() public payable {
        require(msg.value > 0, "You need exchange some ethers for POC20");
        uint convertEtherToPOCToken = msg.value * tokensPerUnitEther;
        _transfer(owner, msg.sender, convertEtherToPOCToken);
    }

    function getBalance() public view returns(uint) {
        return balanceOf(owner);
    }
}