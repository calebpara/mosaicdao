pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol"; 

contract MosaicDAO is Ownable {
  string[] public gallery; 

  function appendImage(string memory uri) external {
    gallery.push(uri);
  }
  function removeImage(uint index) external { 
    delete gallery[index];
  }
}