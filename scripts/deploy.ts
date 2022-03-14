import hre, { ethers } from "hardhat";

async function main() {
  const cobie = "0x9F3f11d72d96910df008Cfe3aBA40F361D2EED03";
  const Contract = await ethers.getContractFactory("CobieEscrow");
  const contract = await Contract.deploy(cobie);

  await contract.deployed();

  console.log("CobieEscrow deployed to:", contract.address);

  await hre.tenderly.verify({
    name: "CobieEscrow",
    address: contract.address,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
