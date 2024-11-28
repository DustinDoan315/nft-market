import { ethers } from "hardhat";
import { expect } from "chai";
import { DTNft } from "../typechain-types";

describe("DTNft Contract", function () {
  let dtnft: DTNft;
  let owner: any, addr1: any, addr2: any;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const DTNftFactory = await ethers.getContractFactory("DTNft");
    dtnft = (await DTNftFactory.deploy()) as DTNft;
  });

  it("Should have the correct name and symbol", async function () {
    expect(await dtnft.name()).to.equal("Dustin 315 NFT");
    expect(await dtnft.symbol()).to.equal("D315");
  });

  it("Should allow the owner to mint a new NFT", async function () {
    const tokenURI = "https://example.com/token/1";
    await expect(dtnft.connect(owner).mint(addr1.address, tokenURI))
      .to.emit(dtnft, "Mint")
      .withArgs(addr1.address, 1, tokenURI);

    // Verify the token exists
    expect(await dtnft.ownerOf(1)).to.equal(addr1.address);
    expect(await dtnft.tokenURI(1)).to.equal(tokenURI);
  });

  it("Should not allow a non-owner to mint a new NFT", async function () {
    const tokenURI = "https://example.com/token/2";
    await expect(
      dtnft.connect(addr1).mint(addr1.address, tokenURI)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should correctly increment the token ID counter", async function () {
    const tokenURI1 = "https://example.com/token/1";
    const tokenURI2 = "https://example.com/token/2";

    await dtnft.connect(owner).mint(addr1.address, tokenURI1);
    expect(await dtnft.ownerOf(1)).to.equal(addr1.address);

    await dtnft.connect(owner).mint(addr2.address, tokenURI2);
    expect(await dtnft.ownerOf(2)).to.equal(addr2.address);
  });

  it("Should correctly emit Mint events", async function () {
    const tokenURI = "https://example.com/token/3";

    await expect(dtnft.connect(owner).mint(addr1.address, tokenURI))
      .to.emit(dtnft, "Mint")
      .withArgs(addr1.address, 1, tokenURI);
  });
});
