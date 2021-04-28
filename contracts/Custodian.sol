// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./WrappedBitCloutToken.sol";

contract Custodian is OwnableUpgradeable {
  
  WrappedBitCloutToken public token;

  //Variables
  mapping (address => string) public bitCloutAddresses;
  mapping (address => bool) public authorizedCustodians;
  
  modifier onlyCustodian() {
    require(authorizedCustodians[msg.sender] == true, "Custodian: caller is not the custodian");
    _;
  }
  
  function addCustodian(address _custodianAddress, string memory _custodianBitCloutAddress) public onlyOwner {
    require(_custodianAddress != address(0), "account is the zero address");

    bytes32 _addressBTCLTHash = keccak256(bytes(_custodianBitCloutAddress));

    require(_addressBTCLTHash != keccak256(bytes("")), 'you must supply a custodian eth address');

    authorizedCustodians[_custodianAddress] = true;
    bitCloutAddresses[_custodianAddress] = _custodianBitCloutAddress;
  }

  function removeCustodian(address _custodianAddress) public onlyOwner {
    require(_custodianAddress != address(0), "account is the zero address");

    authorizedCustodians[_custodianAddress] = false;
    bitCloutAddresses[_custodianAddress] = "";
  }

}
