pragma solidity ^0.4.18;

contract ChatWei {

 struct ContractProperties {
    address ChatWeiOwner;
		address[] registeredUsersAddress;
 }

 ContractProperties contractProperties;

  function ChatWei() public {
    // Constructor
		contractProperties.ChatWeiOwner = msg.sender;
  }

  function getContractProperties() public view returns (address, address[]) {
    return (contractProperties.ChatWeiOwner, contractProperties.registeredUsersAddress);
  }

}
