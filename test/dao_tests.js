const MosaicERC20 = artifacts.require("MosaicERC20");
const MosaicGovernor = artifacts.require("MosaicGovernor");
const TokenAirDrop = artifacts.require("TokenAirDrop");
const MosaicDAO = artifacts.require("MosaicDAO")

contract("DAO Tests", async accounts => {
  before(async () => {
    erc20 = await MosaicERC20.deployed();
    tokenAirDrop = await TokenAirDrop.deployed();
    governor = await MosaicGovernor.deployed();
  });

  it("Propose an addition", async () => {
    const transferCalldata = web3.eth.abi.encodeFunctionCall({
      name: 'appendImage',
      type: 'function',
      inputs: [{
          type: 'string',
          name: 'uri'
      }]
    }, ['https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu']);
    await governor.propose(
      [MosaicDAO.address],
      [0],
      [transferCalldata],
      "Add the bathroom stall art to the gallery"
    );
  });

  it("Airdrop coins", async () => {
    // Airdrop each account 1 MOSAIC for science
    accounts.forEach(async account => {
      await erc20.approve(
        account,
        new web3.utils.BN("10000000000000000000") // 1 MOSAIC
      )
    });
  });

});