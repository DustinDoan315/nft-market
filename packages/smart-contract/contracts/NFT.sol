// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    // Struct to store listing information
    struct NFTListing {
        uint256 price;       // Sale price in wei
        address seller;      // Seller address
        bool isListed;       // Listing status
    }

    // Mapping to store listing details for each NFT
    mapping(uint256 => NFTListing) public nftListings;

    constructor() ERC721("NFTCollection", "NFTC") {
        tokenCounter = 0;
    }

    // Mint an NFT and store metadata
    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenCounter += 1;
        return newItemId;
    }

    // List an NFT for sale
    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "You must own the NFT to list it for sale");
        require(price > 0, "Price must be greater than zero");

        nftListings[tokenId] = NFTListing({
            price: price,
            seller: msg.sender,
            isListed: true
        });
    }

    // Remove NFT from sale
    function unlistNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You must own the NFT to unlist it");
        nftListings[tokenId].isListed = false;
    }

    // Buy a listed NFT
    function buyNFT(uint256 tokenId) public payable {
        NFTListing memory listing = nftListings[tokenId];
        require(listing.isListed, "NFT is not listed for sale");
        require(msg.value >= listing.price, "Insufficient funds to purchase NFT");

        // Transfer NFT to the buyer
        _transfer(listing.seller, msg.sender, tokenId);

        // Transfer payment to the seller
        payable(listing.seller).transfer(msg.value);

        // Remove listing after successful purchase
        nftListings[tokenId].isListed = false;
    }

    // Check if an NFT is listed for sale
    function isListed(uint256 tokenId) public view returns (bool) {
        return nftListings[tokenId].isListed;
    }
}
