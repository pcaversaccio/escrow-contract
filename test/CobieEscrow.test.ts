// import { expect } from "chai";
import { ethers } from "hardhat";

describe("CobieEscrow", function () {
  const cobie = "0x4Cbe68d825d21cB4978F56815613eeD06Cf30152";
  it("should deploy successfully", async function () {
    const Contract = await ethers.getContractFactory("CobieEscrow");
    const contract = await Contract.deploy(cobie);
    await contract.deployed();
  });
});
