export {};

const { ethers, network } = require("hardhat");
const web3 = require("web3");

const main = async () => {
  const MosaicERC20 = await ethers.getContractFactory("MosaicERC20");
  const MosaicDAO = await ethers.getContractFactory("MosaicDAO");
  const MosaicGovernor = await ethers.getContractFactory("MosaicGovernor");
  const TokenAirDrop = await ethers.getContractFactory("TokenAirDrop");
  const constants = require("./constants.json");

  const mosaicERC20 = await MosaicERC20.deploy();
  await mosaicERC20.deployed();

  const tokenAirDrop = await TokenAirDrop.deploy(
    mosaicERC20.address,
    web3.utils.toWei("10", "ether")
  );

  mosaicERC20.approve(tokenAirDrop.address, web3.utils.toWei("1000", "ether"));

  const mosaicGovernor = await MosaicGovernor.deploy(
    mosaicERC20.address,
    constants.timeFactor[network.name],
    web3.utils.toWei(constants.proposalMinimum, "ether"),
    constants.quorumFraction
  );

  const mosaicDAO = await MosaicDAO.deploy(5);

  saveFrontendFiles({
    MosaicERC20: mosaicERC20.address,
    TokenAirDrop: tokenAirDrop.address,
    MosaicGovernor: mosaicGovernor.address,
    MosaicDAO: mosaicDAO.address,
  });
};

const saveFrontendFiles = (tokens) => {
  const fs = require("fs");
  const outputDir = __dirname + "/../src/contracts";

  fs.writeFileSync(outputDir + "/addresses.json", JSON.stringify(tokens));

  console.log("Contract addresses saved: \n", tokens);
};

main().then(() => process.exit(0));
