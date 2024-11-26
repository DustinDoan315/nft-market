// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DTNft is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    event Mint(address indexed to, uint256 tokenId, string tokenURI);

    constructor() ERC721("Dustin 315 NFT", "D315") Ownable(msg.sender){}

   
    function mint(address to, string calldata tokenURI) external onlyOwner returns (uint256) {
        uint256 tokenId = ++_tokenIdCounter;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        emit Mint(to, tokenId, tokenURI);
        return tokenId;
    }
}
