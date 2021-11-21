const Web3 = require("web3");
var web3 = new Web3(Web3.givenProvider);

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
    new Web3.utils.BN("10000000000000000") // 0.01 MOSAIC
  );
  const tokenAirDrop = await TokenAirDrop.deployed();

  // Approve airdrop to transfer funds to requestors
  await erc20.approve(
    tokenAirDrop.address,
    new Web3.utils.BN("1000000000000000000000") // 100 MOSAIC
  );

  await deployer.deploy(MosaicGovernor, erc20.address, timelock.address);
  let mosaicGovernor = await MosaicGovernor.deployed();

  await deployer.deploy(MosaicDAO, 5);
  let mosaicDAO = await MosaicDAO.deployed();

  await mosaicDAO.appendImage(
    "https://bafybeiau2675bek3hsschrxqn43ohuygj42sqsjzqvv3q4ksknfrqphdsa.ipfs.dweb.link/img1.jpg"
  );
  await mosaicDAO.appendImage(
    "https://bafybeih4ooehbzdomc26uzfswirbsobavftrurveig6hyaqe3upkpnwloe.ipfs.dweb.link/img2.jpg"
  );

  await mosaicDAO.transferOwnership(mosaicGovernor.address);

  const transferCalldata = web3.eth.abi.encodeFunctionCall(
    {
      name: "appendImage",
      type: "function",
      inputs: [
        {
          type: "string",
          name: "uri",
        },
      ],
    },
    ["https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu"]
  );

  const proposal = await mosaicGovernor.proposeWithDetails(
    [MosaicDAO.address],
    [0],
    [transferCalldata],
    "Add the bathroom stall art to the gallery",
    "https://ipfs.io/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu",
    "Add"
  );

  console.log(await mosaicGovernor.getPastEvents("ProposalCreated"));
};
