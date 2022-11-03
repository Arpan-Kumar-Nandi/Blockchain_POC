// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract POC20 is ERC20 {

    uint public tokensPerUnitEther = 10;
    address payable owner;

    constructor() ERC20('POC_TOKEN', 'POC20') {
         _mint(msg.sender, 1000 * 10 ** 18);
        owner = payable(msg.sender);

    }

    function buyTokens(uint amount) public payable {
        require(amount > 0, "You need exchange some ethers for POC20");
        uint convertEtherToPOCToken = amount * tokensPerUnitEther;
        _transfer(owner, msg.sender, convertEtherToPOCToken);
    }

    function getBalance() public view returns(uint) {
        return balanceOf(owner);
    }
}