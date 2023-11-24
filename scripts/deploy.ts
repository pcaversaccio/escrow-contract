/* eslint-disable @typescript-eslint/no-unused-vars */
import hre, { ethers } from "hardhat";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const cobie = ["0x4Cbe68d825d21cB4978F56815613eeD06Cf30152"];
  const contract = await ethers.deployContract("CobieEscrow", cobie);

  await contract.deployed();
  const contractAddress = contract.address;

  console.log("CobieEscrow deployed to:", contractAddress);

  await delay(30000); // Wait for 30 seconds before verifying the contract

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: cobie,
  });

  // await hre.tenderly.verify({
  //   name: "CobieEscrow",
  //   address: contractAddress,
  // });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
