// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract NftMarketplace {
    IERC721Enumerable private nftContract;

    constructor(address _nftContractAddress) {
        require(
            _nftContractAddress != address(0),
            "Invalid NFT contract address"
        );
        nftContract = IERC721Enumerable(_nftContractAddress);
    }

    function getListByUser(
        address user
    ) external view returns (uint256[] memory) {
        uint256 balance = nftContract.balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = nftContract.tokenOfOwnerByIndex(user, i);
        }

        return tokenIds;
    }
}
