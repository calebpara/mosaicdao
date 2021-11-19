// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// THIS IS NOT INTENDED FOR PRODUCTION USE, ONLY FOR TESTING
contract TokenAirDrop is Ownable {
    mapping(address => bool) _claimed; 
    ERC20 token;
    uint256 airdropAmount;

    constructor(ERC20 _token, uint256 _airdropAmount) {
        airdropAmount = _airdropAmount;
        token = _token;
    }

    function claim() external {
        // require(!_claimed[tx.origin], "You already claimed the tokens once!");
        // _claimed[tx.origin] = true;
        // token.transferFrom(owner(), msg.sender, airdropAmount);
    }

    function remainingTokens() external view returns (uint256) {
        return token.allowance(owner(), address(this));
    }
}
