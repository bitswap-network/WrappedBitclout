import Web3 from "web3";
import WrappedBitCloutToken from "./contracts/WrappedBitCloutToken.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:7545"),
  },
  contracts: [WrappedBitCloutToken],
  events: {
    SimpleStorage: ["StorageSet"],
  },
};

export default options;
