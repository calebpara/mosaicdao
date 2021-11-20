// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 

contract MosaicERC20 is ERC20 {

    constructor() ERC20("MosaicERC20", "MOSAIC") {
        uint256 _totalSupply = 1e21; 
        _mint(msg.sender, _totalSupply);
    }

}