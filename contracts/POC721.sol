// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./POC20.sol";

contract POC721 is ERC721 {

    address payable public owner;
    enum ItemStatus { Available, Sold }

    POC20 public currencyToken;

    struct Item {
        uint tokenId;
        string title;
        string description;
        uint256 price;
        string date;
        address payable owner;
        ItemStatus status;
        //string image;
    }

    mapping(uint => address[]) public tokenOwnerHistory;
    mapping(uint => uint[]) public tokenPriceHistory;


    mapping(uint256 => Item) public item;

    constructor(uint tokenId, string memory title, string memory description, uint price, string memory date, address POC20Address) ERC721('POC_NFT_TOKEN', 'POC721') {
        owner = payable(msg.sender);
        _safeMint(owner, tokenId);
        item[tokenId] = Item(tokenId, title, description, price, date, owner, ItemStatus.Available);
        tokenOwnerHistory[tokenId].push(owner);
        tokenPriceHistory[tokenId].push(price);
        currencyToken = POC20(POC20Address);
    }

    function buyItem (uint tokenId) public payable{
        require(msg.sender != owner, "You cannot buy your own item");
        require(msg.value == item[tokenId].price, "You must pay the listed price");
        require(item[tokenId].status == ItemStatus.Available, "You cannot buy an item which is not available");
        //payable(owner).transfer(msg.value);
        currencyToken.transferTokens(payable(msg.sender),payable(owner),msg.value);
        _transfer(owner, msg.sender, tokenId);
        item[tokenId].owner = payable(msg.sender);
        item[tokenId].status = ItemStatus.Sold;
        tokenOwnerHistory[tokenId].push(msg.sender);
        tokenPriceHistory[tokenId].push(msg.value);
        owner = payable(msg.sender);
    }

    function resellItem(uint tokenId, uint price) public {
        require(msg.sender == owner, "Only owner");
        require(item[tokenId].status == ItemStatus.Sold, "Only sold items can be listed again");
        item[tokenId].status = ItemStatus.Available;
        item[tokenId].price = price;
    }
     function _baseURI() internal pure override returns(string memory){
        return 'http://localhost:5555/';
    }

    function getTokenOwnerHistory(uint tokenId) external view returns(address[] memory) {
        return tokenOwnerHistory[tokenId];
    }
}