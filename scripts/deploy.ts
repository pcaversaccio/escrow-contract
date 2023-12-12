/* eslint-disable @typescript-eslint/no-unused-vars */
import hre from "hardhat";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const cobie = ["0x4Cbe68d825d21cB4978F56815613eeD06Cf30152"];
  const cobieEscrow = await hre.ethers.deployContract("CobieEscrow", cobie);

  await cobieEscrow.waitForDeployment();
  const cobieEscrowAddress = await cobieEscrow.getAddress();

  console.log("CobieEscrow deployed to:", cobieEscrowAddress);

  await delay(30000); // Wait for 30 seconds before verifying the contract

  await hre.run("verify:verify", {
    address: cobieEscrowAddress,
    constructorArguments: cobie,
  });

  // await hre.tenderly.verify({
  //   name: "CobieEscrow",
  //   address: cobieEscrowAddress,
  // });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
