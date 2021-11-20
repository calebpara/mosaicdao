const MosaicERC20 = artifacts.require("MosaicERC20");
const MosaicGovernor = artifacts.require("MosaicGovernor");
const TokenAirDrop = artifacts.require("TokenAirDrop");
const MosaicDAO = artifacts.require("MosaicDAO")

contract("Governance Tests", async accounts => {
  before(async () => {
    erc20 = await MosaicERC20.deployed();
    tokenAirDrop = await TokenAirDrop.deployed();
    governor = await MosaicGovernor.deployed();
    mosaicDAO = await MosaicDAO.deployed();
  });

  it("Propose and Vote", async () => {
    accounts.forEach(async account => {
      await erc20.approve(
        account,
        new web3.utils.BN("10000000000000000000") // 1 MOSAIC
      )
    });
    accounts.forEach(account => {tokenAirDrop.claim(
      { from: account }
    )});
    const transferCalldata = web3.eth.abi.encodeFunctionCall({
      name: 'appendImage',
      type: 'function',
      inputs: [{
          type: 'string',
          name: 'uri'
      }]
    }, ['https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu']);
    const proposal = await governor.propose(
      [MosaicDAO.address],
      [0],
      [transferCalldata],
      "Add the bathroom stall art to the gallery"
    );

    const id = proposal.logs[0].args.proposalId;

    accounts.forEach(async account => {
      await governor.castVote(id, 1, {from: account})
    });

    console.log(id.toString());
    const res = await governor.state(id);
    console.log(res.toString());
    console.log(await governor.votingDelay().toString());
    console.log(await governor.votingPeriod().toString());



  });


});