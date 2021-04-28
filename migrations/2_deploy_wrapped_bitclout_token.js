const WrappedBitCloutToken = artifacts.require('WrappedBitCloutToken');
const Merchant = artifacts.require('Merchant');

const { deployProxy } = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer) {
  let tokenContract = await deployProxy(WrappedBitCloutToken, ["Wrapped BitClout", "WBTCLT"],  { deployer, unsafeAllowCustomTypes : false, initializer: 'initialize' });

  await deployProxy(Merchant, [web3.utils.toWei('0.01', "ether"), tokenContract.address],  { deployer, unsafeAllowCustomTypes : false, initializer: 'initialize' });

};