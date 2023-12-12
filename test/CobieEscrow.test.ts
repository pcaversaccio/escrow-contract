import hre from "hardhat";

describe("CobieEscrow", function () {
  const cobie = ["0x4Cbe68d825d21cB4978F56815613eeD06Cf30152"];
  it("should deploy successfully", async function () {
    const cobieEscrow = await hre.ethers.deployContract("CobieEscrow", cobie);
    await cobieEscrow.waitForDeployment();
  });
});
