const web3 = require("web3");

const MosaicERC20 = artifacts.require("MosaicERC20");
const MosaicGovernor = artifacts.require("MosaicGovernor");
const TokenAirDrop = artifacts.require("TokenAirDrop");

module.exports = async (deployer) => {
  await deployer.deploy(MosaicERC20);
  const erc20 = await MosaicERC20.deployed();

  await deployer.deploy(
    TokenAirDrop,
    erc20.address,
    new web3.utils.BN("10000000000000000") // 0.01 MOSAIC
  );
  const tokenAirDrop = await TokenAirDrop.deployed();

  // Approve airdrop to transfer funds to requestors
  await erc20.approve(
    tokenAirDrop.address,
    new web3.utils.BN("1000000000000000000000") // 100 MOSAIC
  );

  await deployer.deploy(MosaicGovernor, erc20.address);
};
