const MosaicERC20 = artifacts.require("MosaicERC20");
const MosaicGovernor = artifacts.require("MosaicGovernor");
const TokenAirDrop = artifacts.require("TokenAirDrop");

module.exports = async (deployer) => {
  await deployer.deploy(MosaicERC20);
  const erc20 = await MosaicERC20.deployed();

  await deployer.deploy(TokenAirDrop);
  const tokenAirDrop = await TokenAirDrop.deployed();

  // Approve airdrop to transfer funds to requestors
  await erc20.methods.approve(tokenAirDrop.address, 1e18);

  await deployer.deploy(MosaicGovernor, erc20.address);
};
