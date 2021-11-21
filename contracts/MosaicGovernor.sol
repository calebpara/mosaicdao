// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorProposalThreshold.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";

contract MosaicGovernor is GovernorProposalThreshold, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {

    event ProposalDetails(uint256 proposalId, uint256 incrementingId, string uri, string action);

    uint256 totalProposals = 0; 
    uint256 _votingPeriod = 1000;
    uint256 _proposalThreshold = 1e18;

    constructor(ERC20Votes _token, uint256 vperiod, uint256 pthreshold, uint256 quorumfrac)
        Governor("MosaicGovernorAlpha")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(quorumfrac)
    {
        _votingPeriod = vperiod;
        _proposalThreshold = pthreshold;
    }

    function votingDelay() public pure override returns (uint256) {
        return 0; // 1 block, 1
    }

    function votingPeriod() public view override returns (uint256) {
        return _votingPeriod; // 1 week, 45818
    }

    function proposalThreshold() public view override returns (uint256) {
        return _proposalThreshold;//1e18;
    }

    // The following functions are overrides required by Solidity.

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotes)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor, GovernorProposalThreshold)
        returns (uint256)
    {
        return 0;
    }

    // This is a temporary unsafe implementation 
    function proposeWithDetails(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description, string memory uri, string memory action)
        public
        returns (uint256 proposalId)
    {
        proposalId = super.propose(targets, values, calldatas, description);
        emit ProposalDetails(proposalId, totalProposals, uri, action); 
        totalProposals += 1; 
    }


    function _execute(
        uint256 proposalId, /* proposalId */
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal virtual override(Governor) {
        return super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal virtual override(Governor) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
    internal view virtual override(Governor) returns (address) {
        return super._executor();
    }

    function state(uint256 proposalId) public view virtual override(Governor) returns (ProposalState) {
        return super.state(proposalId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(Governor) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}