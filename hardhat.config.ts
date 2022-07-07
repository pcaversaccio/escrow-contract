import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "xdeployer";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";
import * as tdly from "@tenderly/hardhat-tenderly";
import "hardhat-abi-exporter";

dotenv.config();

// Turning off the automatic Tenderly verification
tdly.setup({ automaticVerifications: false });

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task(
  "balances",
  "Prints the list of accounts and their balances",
  async (_, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
      console.log(
        account.address +
          " " +
          (await hre.ethers.provider.getBalance(account.address))
      );
    }
  }
);

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
      chainId: 31337,
      forking: {
        url: process.env.ETH_MAINNET_URL || "",
        // The Hardhat network will by default fork from the latest mainnet block
        // To pin the block number, specify it below
        // You will need access to a node with archival data for this to work!
        // blockNumber: 14743877,
        // If you want to do some forking, set `enabled` to true
        enabled: false,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    "truffle-dashboard": {
      url: "http://localhost:24012/rpc",
    },
    tenderly: {
      url: `https://rpc.tenderly.co/fork/${process.env.TENDERLY_FORK_ID}`,
    },
    rinkeby: {
      chainId: 4,
      url: process.env.ETH_RINKEBY_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    kovan: {
      chainId: 42,
      url: process.env.ETH_KOVAN_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ropsten: {
      chainId: 3,
      url: process.env.ETH_ROPSTEN_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    goerli: {
      chainId: 5,
      url: process.env.ETH_GOERLI_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      chainId: 11155111,
      url: process.env.ETH_SEPOLIA_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ethMain: {
      chainId: 1,
      url: process.env.ETH_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bscTestnet: {
      chainId: 97,
      url: process.env.BSC_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bscMain: {
      chainId: 56,
      url: process.env.BSC_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    optimismTestnet: {
      chainId: 69,
      url: process.env.OPTIMISM_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    optimismMain: {
      chainId: 10,
      url: process.env.OPTIMISM_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrumTestnet: {
      chainId: 421611,
      url: process.env.ARBITRUM_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrumMain: {
      chainId: 42161,
      url: process.env.ARBITRUM_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      chainId: 80001,
      url: process.env.POLYGON_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    polygon: {
      chainId: 137,
      url: process.env.POLYGON_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hecoTestnet: {
      chainId: 256,
      url: process.env.HECO_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hecoMain: {
      chainId: 128,
      url: process.env.HECO_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fantomTestnet: {
      chainId: 4002,
      url: process.env.FANTOM_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fantomMain: {
      chainId: 250,
      url: process.env.FANTOM_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fuji: {
      chainId: 43113,
      url: process.env.AVALANCHE_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    avalanche: {
      chainId: 43114,
      url: process.env.AVALANCHE_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    sokol: {
      chainId: 77,
      url: process.env.GNOSIS_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    gnosis: {
      chainId: 100,
      url: process.env.GNOSIS_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    moonbaseAlpha: {
      chainId: 1287,
      url: process.env.MOONBEAM_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    moonriver: {
      chainId: 1285,
      url: process.env.MOONRIVER_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    moonbeam: {
      chainId: 1284,
      url: process.env.MOONBEAM_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    alfajores: {
      chainId: 44787,
      url: process.env.CELO_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    celo: {
      chainId: 42220,
      url: process.env.CELO_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    auroraTestnet: {
      chainId: 1313161555,
      url: process.env.AURORA_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    auroraMain: {
      chainId: 1313161554,
      url: process.env.AURORA_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    harmonyTestnet: {
      chainId: 1666700000,
      url: process.env.HARMONY_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    harmonyMain: {
      chainId: 1666600000,
      url: process.env.HARMONY_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    autobahn: {
      chainId: 45000,
      url: process.env.AUTOBAHN_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    spark: {
      chainId: 123,
      url: process.env.FUSE_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    fuse: {
      chainId: 122,
      url: process.env.FUSE_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    cronosTestnet: {
      chainId: 338,
      url: process.env.CRONOS_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    cronosMain: {
      chainId: 25,
      url: process.env.CRONOS_MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  xdeploy: {
    contract: "CobieEscrow",
    constructorArgsPath: "./deploy-args.ts",
    salt: process.env.SALT,
    signer: process.env.PRIVATE_KEY,
    networks: ["rinkeby", "ropsten", "kovan", "goerli"],
    rpcUrls: [
      process.env.ETH_RINKEBY_TESTNET_URL,
      process.env.ETH_ROPSTEN_TESTNET_URL,
      process.env.ETH_KOVAN_TESTNET_URL,
      process.env.ETH_GOERLI_TESTNET_URL,
    ],
    gasLimit: 1.6 * 10 ** 6,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
    strict: true,
    only: [],
    except: [],
  },
  abiExporter: {
    path: "./abis",
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
  },
  etherscan: {
    apiKey: {
      // For Mainnet, Ropsten, Rinkeby, Goerli, Kovan, Sepolia
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      ropsten: process.env.ETHERSCAN_API_KEY || "",
      rinkeby: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      kovan: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      // For BSC testnet & mainnet
      bsc: process.env.BSC_API_KEY || "",
      bscTestnet: process.env.BSC_API_KEY || "",
      // For Heco testnet & mainnet
      heco: process.env.HECO_API_KEY || "",
      hecoTestnet: process.env.HECO_API_KEY || "",
      // For Fantom testnet & mainnet
      opera: process.env.FANTOM_API_KEY || "",
      ftmTestnet: process.env.FANTOM_API_KEY || "",
      // For Optimism testnet & mainnet
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      optimisticKovan: process.env.OPTIMISM_API_KEY || "",
      // For Polygon testnet & mainnet
      polygon: process.env.POLYGON_API_KEY || "",
      polygonMumbai: process.env.POLYGON_API_KEY || "",
      // For Arbitrum testnet & mainnet
      arbitrumOne: process.env.ARBITRUM_API_KEY || "",
      arbitrumTestnet: process.env.ARBITRUM_API_KEY || "",
      // For Avalanche testnet & mainnet
      avalanche: process.env.AVALANCHE_API_KEY || "",
      avalancheFujiTestnet: process.env.AVALANCHE_API_KEY || "",
      // For Moonbeam testnet & mainnets
      moonbeam: process.env.MOONBEAM_API_KEY || "",
      moonriver: process.env.MOONBEAM_API_KEY || "",
      moonbaseAlpha: process.env.MOONBEAM_API_KEY || "",
      // For Harmony testnet & mainnet
      harmony: process.env.HARMONY_API_KEY || "",
      harmonyTest: process.env.HARMONY_API_KEY || "",
      // For Aurora testnet & mainnet
      aurora: process.env.AURORA_API_KEY || "",
      auroraTestnet: process.env.AURORA_API_KEY || "",
      // For Cronos testnet & mainnet
      cronos: process.env.CRONOS_API_KEY || "",
      cronosTestnet: process.env.CRONOS_API_KEY || "",
      // xdai and sokol don't need an API key, but you still need
      // to specify one; any string placeholder will work
      xdai: "wagmi",
      sokol: "wagmi",
    },
    customChains: [
      {
        network: "cronos",
        chainId: 25,
        urls: {
          apiURL: "https://api.cronoscan.com/api",
          browserURL: "https://cronoscan.com",
        },
      },
      {
        network: "cronosTestnet",
        chainId: 338,
        urls: {
          apiURL: "https://api-testnet.cronoscan.com/api",
          browserURL: "https://testnet.cronoscan.com",
        },
      },
    ],
  },
  tenderly: {
    username: "pcaversaccio",
    project: "project",
    forkNetwork: "",
    privateVerification: false,
    deploymentsDir: "deployments_tenderly",
  },
};

export default config;
