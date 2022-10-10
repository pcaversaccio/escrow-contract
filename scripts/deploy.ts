import hre, { ethers } from "hardhat";

async function main() {
  const cobie = "0x4Cbe68d825d21cB4978F56815613eeD06Cf30152";
  const contract = await ethers.deployContract("CobieEscrow", [cobie]);

  await contract.deployed();

  console.log("CobieEscrow deployed to:", contract.address);

  // await hre.tenderly.verify({
  //   name: "CobieEscrow",
  //   address: contract.address,
  // });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
