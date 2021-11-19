const web3 = require("web3");

const MosaicERC20 = artifacts.require("MosaicERC20");
const MosaicGovernor = artifacts.require("MosaicGovernor");
const TokenAirDrop = artifacts.require("TokenAirDrop");
const MosaicDAO = artifacts.require("MDosaicDAO")

module.exports = async (deployer, network, accounts) => {
  const erc20 = await MosaicERC20.deployed();
  const tokenAirDrop = await TokenAirDrop.deployed();
  const governor = await MosaicGovernor.deployed();

  // Approve airdrop to transfer funds to requestors
  await erc20.approve(
    tokenAirDrop.address,
    new web3.utils.BN("1000000000000000000000") // 100 MOSAIC
  );

  // Airdrop each account 1 MOSAIC for science
  accounts.forEach(async account => {
    await erc20.approve(
      account,
      new web3.utils.BN("10000000000000000000") // 1 MOSAIC
    )
  });



  await deployer.deploy(MosaicGovernor, erc20.address);
};
