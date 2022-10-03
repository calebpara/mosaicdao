require("@nomiclabs/hardhat-ethers");
require("@typechain/hardhat");

module.exports = {
  solidity: "0.8.3",
  typechain: {
    target: "ethers-v5",
    outDir: "src/types",
  },
};
