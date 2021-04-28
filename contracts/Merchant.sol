// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "./Custodian.sol";

contract Merchant is Custodian {
  //Variables

  uint256 public swapFee;

  struct Deposit {
    address sender;
    uint amount;
    bytes32 bitCloutAddress;
    bool claimed;
    uint timestamp;
  }

  Deposit[] internal depositArray;
  uint public depositArrayIndex;

  mapping (bytes32 => address) public bitCloutDepositIndex;
  mapping (address => Deposit) public deposits;
  
  //Events

  /* 
   * Fires when a request to swap BitCLout for Wrapped BitClout is successful.
   */
  event OpenDeposit(uint256 amountBTCLT, string addressBTCLT);
  event DepositMinted(uint256 amountWBTCLT, address receiver);

  //Functions
  function initialize(uint256 _swapFee, address _tokenAddress) public virtual {
    swapFee = _swapFee;
    token = WrappedBitCloutToken(_tokenAddress);
  }

  function currentDeposit(bytes32 _bitCloutAddress) public view returns (uint amount, uint timestamp, bool claimed, bool isExpired) {
    Deposit memory deposit = deposits[bitCloutDepositIndex[keccak256(abi.encodePacked(_bitCloutAddress))]];

    return(deposit.amount, deposit.timestamp, deposit.claimed, checkExpiredDeposit(deposit));
  }

  function isExpiredDeposit(address sender) public view returns(bool isActive) {
    return checkExpiredDeposit(deposits[sender]);
  }

  function checkExpiredDeposit(Deposit memory deposit) public view returns(bool isActive) {
    if(deposit.amount > 0) {
      /*
       * There is an existing deposit, validate if it's still active.
      */
      if(deposit.claimed != true && block.timestamp < (deposit.timestamp + 4 hours) ) {
        return false;
      } 
    } 

    return true;
  }

  function authorizeDeposit(uint256 _bitCloutAmount, string memory _bitCloutAddress, address _custodian) external payable {
    require(_bitCloutAmount > 0, 'you must submit an amount of BitClout greater than 0');
    
    // Check if BitClout public key isn't empty.
    // Maybe make this more robust ie. check address length matches standard BTCLT public key length
    bytes32 _bitCloutAddressHash = keccak256(bytes(_bitCloutAddress));

    require(_bitCloutAddressHash != keccak256(bytes("")), 'you must submit your BitClout public key to receive your wBTCLT');

    //
    require(authorizedCustodians[address(_custodian)] == true, 'custodian not found');
    /*
     * Replace with Chainlink oracle price calls.
     * Swap fee = % fee * (BitClout price in BTC / ETH price in BTC)
     */
    require(msg.value == swapFee, 'you must pay the exact fee');
    
    /*
     * Only allow one open transaction per BitClout address
     */
    require(isExpiredDeposit(msg.sender) == true, 'you can only have one deposit open at a time');

    //clear to create new deposit
    deposits[msg.sender] = Deposit(msg.sender, _bitCloutAmount, _bitCloutAddressHash, false, block.timestamp);
    bitCloutDepositIndex[_bitCloutAddressHash] = msg.sender;

    //Add open deposit
    //deposits.push(Deposit(_bitCloutAmount, _addressBTCLTHash, false, block.timestamp));

    emit OpenDeposit(_bitCloutAmount, _bitCloutAddress);
  }

  function mintWBTCLT(string memory _bitCloutAddress) external onlyOwner {
    bytes32 _bitCloutAddressHash = keccak256(bytes(_bitCloutAddress));
    require(_bitCloutAddressHash != keccak256(bytes("")), 'you must submit your BitClout public key to receive your wBTCLT');

    Deposit memory deposit = deposits[bitCloutDepositIndex[_bitCloutAddressHash]];

    require(deposit.sender != address(0), 'missing original sender address');

    require(isExpiredDeposit(deposit.sender) == false, 'you can only have one deposit open at a time');

    token.mint(deposit.sender, deposit.amount);

    emit DepositMinted(deposit.amount, deposit.sender);
  }

}
