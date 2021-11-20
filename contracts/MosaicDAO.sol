// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol"; 

contract MosaicDAO is Ownable {
  string[] public gallery; 
  uint256 public galleryWidth; 

  constructor(uint256 width) {
    galleryWidth = width; 
  }

  function getGalleryList() view external returns(string[] memory) {
    return gallery; 
  }

  function appendImage(string memory uri) external onlyOwner {
    gallery.push(uri);
  }
  function removeImage(uint index) external onlyOwner { 
    delete gallery[index];
  }
}