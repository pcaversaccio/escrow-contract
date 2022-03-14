import { expect } from "chai";
import { ethers } from "hardhat";

describe("CobieEscrow", function () {
  const cobie = "0x7387782312Eff16eAdd777d2dA365Eae49DCD8D3"
  it("should deploy successfully", async function () {
    const Contract = await ethers.getContractFactory("CobieEscrow");
    const contract = await Contract.deploy(cobie);
    await contract.deployed();
  });
});
