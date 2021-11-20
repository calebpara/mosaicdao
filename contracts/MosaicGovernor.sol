// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorProposalThreshold.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract MosaicGovernor is GovernorProposalThreshold, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(ERC20Votes _token, TimelockController timelock)
        Governor("MosaicGovernorAlpha")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(10)
        GovernorTimelockControl(timelock)
    {}

    function votingDelay() public pure override returns (uint256) {
        return 0; // 1 block, 1
    }

    function votingPeriod() public pure override returns (uint256) {
        return 10; // 1 week, 45818
    }

    function proposalThreshold() public pure override returns (uint256) {
        return 1e18;//1e18;
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
        override(Governor, GovernorProposalThreshold, IGovernor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }
    function _execute(
        uint256 proposalId, /* proposalId */
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal virtual override(GovernorTimelockControl, Governor) {
        return super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal virtual override(GovernorTimelockControl, Governor) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
    internal view virtual override(GovernorTimelockControl, Governor) returns (address) {
        return super._executor();
    }

    function state(uint256 proposalId) public view virtual override(GovernorTimelockControl, Governor) returns (ProposalState) {
        return super.state(proposalId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(GovernorTimelockControl, Governor) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}