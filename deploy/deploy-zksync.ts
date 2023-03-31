// Note that the deployment scripts must be placed in the `deploy` folder for `hardhat deploy-zksync`
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Wallet } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

const PRIVATE_KEY: string = process.env.PRIVATE_KEY || "";

export default async function main(hre: HardhatRuntimeEnvironment) {
  const cobie = "0x4Cbe68d825d21cB4978F56815613eeD06Cf30152";
  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);

  const artifact = await deployer.loadArtifact("CobieEscrow");
  const contract = await deployer.deploy(artifact, [cobie]);

  await contract.deployed();

  console.log("CobieEscrow deployed to:", contract.address);
}