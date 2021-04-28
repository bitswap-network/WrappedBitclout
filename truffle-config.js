require('dotenv').config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_KEY || "";
const METAMASK_MNEUMONIC = process.env.METAMASK_MNEUMONIC || "";

const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: { // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(METAMASK_MNEUMONIC, "https://ropsten.infura.io/v3/XXX")
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(METAMASK_MNEMONIC, "https://kovan.infura.io/v3/XXX")
      },
      network_id: 1,
      gas: 4000000
    }
  },
  compilers: {
    solc: {
      version: '0.8.3'
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: ETHERSCAN_API_KEY
  }
};
