pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 

contract MosaicERC20 is ERC20 {
    constructor() ERC20("MosaicERC20", "MOSAIC") {
        _mint(msg.sender, 1e21);
    }
}