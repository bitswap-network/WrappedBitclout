const Merchant = artifacts.require('Merchant');
const WrappedBitCloutToken = artifacts.require('WrappedBitCloutToken');

const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time
} = require('@openzeppelin/test-helpers');

contract("Merchant", accounts => {
  let contract;
  let token;
  let custodian = {
    address: accounts[1],
    publicKey: 'BC1YLhDyLxfj2kEF42drYxB14JoGUHfDmqZ7NZnYJxTK71SPXRzBDgQ',
  };

  beforeEach('setup contract for each test', async function () {
    token = await WrappedBitCloutToken.new();
    token.initialize('Wrapped BitClout', 'WBTCLT');

    contract = await Merchant.new();
    contract.initialize(web3.utils.toWei('0.01', "ether"), token.address);

    let cus = await contract.addCustodian(custodian.address, custodian.publicKey, {from: accounts[0]});
  });

  it("should create a transaction request", async () => {
    let btclt = 5;
    let address = 'BC1YLgqq1aPDi8dJEhx7M2HeDoE9skzcSpNDQW5Koh4ousRgBcFfnfW';

    const tx = await contract.authorizeDeposit(btclt, address, custodian.address, {value: web3.utils.toWei('0.01', "ether")});
    
    const { logs } = tx;
    assert.ok(Array.isArray(logs));
    assert.equal(logs.length, 1);

    expectEvent(tx, 'OpenDeposit', {
      amountBTCLT: new BN(btclt),
      addressBTCLT: address
    });

    let balance = await web3.eth.getBalance(contract.address);
    assert.equal(balance, web3.utils.toWei('0.01', "ether"));
  });

  it("should fail when there is an existing open deposit", async () => {
    let btclt = 5;
    let address = 'BC1YLgqq1aPDi8dJEhx7M2HeDoE9skzcSpNDQW5Koh4ousRgBcFfnfW';
    let err = null;

    //first deposit
    await contract.authorizeDeposit(btclt, address, custodian.address, {value: web3.utils.toWei('0.01', "ether")});

    try {
      //second deposit
      const tx = await contract.authorizeDeposit(btclt + 2, address, custodian.address, {value: web3.utils.toWei('0.01', "ether")});
    } catch(error) {
      err = error;
    }
    
    assert.ok(err instanceof Error);
  });

  it("should create a new deposit after the 4 hour time-lock has lapsed", async () => {
    let btclt = 5;
    let address = 'BC1YLgqq1aPDi8dJEhx7M2HeDoE9skzcSpNDQW5Koh4ousRgBcFfnfW';

    //first deposit
    await contract.authorizeDeposit(btclt, address, custodian.address, {value: web3.utils.toWei('0.01', "ether")});

    await time.increase(time.duration.hours(5));

    //second deposit
    const tx = await contract.authorizeDeposit(btclt + 2, address, custodian.address, {value: web3.utils.toWei('0.01', "ether")});

    let balance = await web3.eth.getBalance(contract.address);
    assert.equal(balance, web3.utils.toWei('0.02', "ether"));

    expectEvent(tx, 'OpenDeposit', {
      amountBTCLT: new BN(btclt + 2),
      addressBTCLT: address
    });
  });

  it("should fail when no fee is paid", async () => {
    let btclt = 5;
    let address = 'BC1YLgqq1aPDi8dJEhx7M2HeDoE9skzcSpNDQW5Koh4ousRgBcFfnfW';
    let err = null;

    try {
      const tx = await contract.authorizeDeposit(btclt, address, custodian.address, {value: web3.utils.toWei('0', "ether")});
    } catch(error) {
      err = error;
    }
    
    assert.ok(err instanceof Error);
  });

  it("should fail when the wrong fee is paid", async () => {
    let btclt = 5;
    let address = 'BC1YLgqq1aPDi8dJEhx7M2HeDoE9skzcSpNDQW5Koh4ousRgBcFfnfW';
    let err = null;

    try {
      const tx = await contract.authorizeDeposit(btclt, address, custodian.address, {value: web3.utils.toWei('0.02', "ether")});
    } catch(error) {
      err = error;
    }
    
    assert.ok(err instanceof Error);
  });

  it("should fail when no bitclout amount is submitted", async () => {
    let btclt = 0;
    let address = 'BC1YLgqq1aPDi8dJEhx7M2HeDoE9skzcSpNDQW5Koh4ousRgBcFfnfW';
    let err = null;

    try {
      const tx = await contract.authorizeDeposit(btclt, address, custodian.address, {value: web3.utils.toWei('0.01', "ether")});
    } catch(error) {
      err = error;
    }
    
    assert.ok(err instanceof Error);
  });

  it("should fail when no bitclout address is submitted", async () => {
    let btclt = 5;
    let address = '';
    let err = null;
    
    try {
      const tx = await contract.authorizeDeposit(btclt, address, custodian.address, {value: web3.utils.toWei('0.01', "ether")});
    } catch(error) {
      err = error;
    }
    
    assert.ok(err instanceof Error);
  });


  //should mint tokens
  it("should mint tokens after successful deposit", async () => {
    let btclt = 5;
    let address = 'BC1YLgqq1aPDi8dJEhx7M2HeDoE9skzcSpNDQW5Koh4ousRgBcFfnfW';
 
    const deposit = await contract.authorizeDeposit(btclt, address, custodian.address, {from: accounts[1], value: web3.utils.toWei('0.01', "ether")});

    const mint = await contract.mintWBTCLT(address, {from: accounts[0]});

    expectEvent(mint, 'DepositMinted', {
      amountWBTCLT: new BN(btclt),
      receiver: accounts[1]
    });
  });

});