const web3 = require("web3");

const MosaicERC20 = artifacts.require("MosaicERC20");
const MosaicDAO = artifacts.require("MosaicDAO");
const MosaicGovernor = artifacts.require("MosaicGovernor");
const TokenAirDrop = artifacts.require("TokenAirDrop");
const MosaicTimelock = artifacts.require("MosaicTimelock");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(MosaicTimelock, 0, [], []);
  const timelock = await MosaicTimelock.deployed();

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

  await deployer.deploy(MosaicGovernor, erc20.address, timelock.address);
  let mosaicGovernor = await MosaicGovernor.deployed();

  await deployer.deploy(MosaicDAO, 5);
  let mosaicDAO = await MosaicDAO.deployed();

  await mosaicDAO.transferOwnership(mosaicGovernor.address);
};
