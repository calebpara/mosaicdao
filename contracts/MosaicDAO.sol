// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol"; 

contract MosaicDAO is Ownable {
  mapping(uint256=>string) private _gallery; 
  uint256[] private _galleryIndices; 
  uint256 private counter = 0;

  uint256 public galleryWidth; 

  constructor(uint256 width) {
    galleryWidth = width; 
  }

  function getGalleryList() view external returns(string[] memory, uint256[] memory) {
    string[] memory gallery = new string[](_galleryIndices.length);
    for (uint i = 0; i < _galleryIndices.length; i++) gallery[i] = _gallery[_galleryIndices[i]];
    return (gallery, _galleryIndices); 
  }

  function getImage(uint index) view external returns(string memory) {
    require(bytes(_gallery[index]).length != 0, "MosaicDAO: Given image index does not exist");
    return _gallery[index];
  }

  function appendImage(string memory uri) external onlyOwner {
    _galleryIndices.push(counter);
    _gallery[counter] = uri;
    counter++;
  }

  function removeImage(uint index) external onlyOwner { 
    require (index < counter && bytes(_gallery[index]).length != 0, "MosaicDAO: Removing non-existent image");
    for (uint i = 0; i < _galleryIndices.length; i++) {
      if (_galleryIndices[i] == index) delete _galleryIndices[i];
    }
    delete _gallery[index];
  }
}