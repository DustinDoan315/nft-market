import { ethers } from "hardhat";
import { expect } from "chai";
import {
  MockContract,
  deployMockContract,
} from "@ethereum-waffle/mock-contract";
import IERC721Enumerable from "@openzeppelin/contracts/build/contracts/IERC721Enumerable.json";
import { BaseContract } from "ethers";

describe("NftMarketplace", function () {
  let nftMarketplace: any;
  let nftMock: MockContract<BaseContract>;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy a mock IERC721Enumerable contract
    const IERC721EnumerableABI = IERC721Enumerable.abi;
    nftMock = await deployMockContract(owner, IERC721EnumerableABI);

    // Deploy the NftMarketplace with the mock contract address
    const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
    nftMarketplace = await NftMarketplace.deploy(nftMock.getAddress());
    await nftMarketplace.deployed();
  });

  it("returns false if the wallet has less then 1000000 coins", async () => {
    await nftMock.balanceOf(ethers.parseEther("999999"));
    expect(await nftMarketplace.check()).to.be.equal(false);
  });

  //   it("Should allow minting and track the user's NFTs", async function () {
  //     // Mock balanceOf and tokenOfOwnerByIndex
  //     await nftMock.mock.balanceOf.withArgs(addr1.address).returns(2);
  //     await nftMock.mock.tokenOfOwnerByIndex
  //       .withArgs(addr1.address, 0)
  //       .returns(1);
  //     await nftMock.mock.tokenOfOwnerByIndex
  //       .withArgs(addr1.address, 1)
  //       .returns(2);

  //     // Call getListByUser and verify the result
  //     const tokenIds = await nftMarketplace.getListByUser(addr1.address);
  //     expect(tokenIds).to.deep.equal([1, 2]);
  //   });

  //   it("Should revert if the NFT contract address is invalid", async function () {
  //     const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
  //     await expect(
  //       NftMarketplace.deploy(ethers.constants.AddressZero)
  //     ).to.be.revertedWith("Invalid NFT contract address");
  //   });
});
