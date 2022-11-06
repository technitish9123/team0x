import dotenv from "dotenv";
import NFTBridge from "../artifacts/contracts/BaseBridge/NFTCollectionBridgeWrapper.sol/NFTCollectionBridgeWrapper.json";
import {
  web3EThProviderHTTP,
  web3BinanceProvider,
  web3POLYProviderHTTP,
} from "./config/config";
import {
  NFT_BRDIGE_RINKBEY,
  NFT_BRDIGE_POLYGON,
  NFT_BRDIGE_BSC,
} from "./constants/constants";

dotenv.config();

// ADMIN CREDENTIALS
const adminPrivKey = process.env.PRIVATE_KEY;

// ETHEREUM PROVIDER && ETH_BRIDGE CONTRACT INIT
const web3ETH = web3EThProviderHTTP();

const { address: adminETH } = web3ETH.eth.accounts.wallet.add(adminPrivKey);

const ETHBridgeInstance = new web3ETH.eth.Contract(
  NFTBridge.abi,
  NFT_BRDIGE_RINKBEY
);
