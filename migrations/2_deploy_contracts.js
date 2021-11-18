const MuralERC20 = artifacts.require("MuralERC20");
const MuralGovernor = artifacts.require("MuralGovernor");

module.exports = async (deployer) => {
  await deployer.deploy(MuralERC20);
  let erc20 = await MuralERC20.deployed();
  await deployer.deploy(MuralGovernor, erc20.address);
};
