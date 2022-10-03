import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "./views";
import { ethers } from "hardhat";
import Topbar from "./components/Navigation/Topbar";
import { useEffect, useState } from "react";
import UserContext from "./context/UserContext";
import * as types from "./common/types";
import MosaicERC20Artifact from "../artifacts/contracts/MosaicERC20.sol/MosaicERC20.json";
import MosaicDAOArtifact from "../artifacts/contracts/MosaicDAO.sol/MosaicDAO.json";
import MosaicGovernorArtifact from "../artifacts/contracts/MosaicGovernor.sol/MosaicGovernor.json";
import TokenAirDropArtifact from "../artifacts/contracts/TokenAirDrop.sol/TokenAirDrop.json";

declare let window: any;

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState<types.IContractsList | null>(null);

  useEffect(() => {
    (async () => {
      if (window.ethereum.isConnected) onConnect();
    })();
  }, []);

  useEffect(() => {
    if (contracts["MosaicERC20"]) window.advanceBlock = advanceBlock;
  }, [!window.advanceBlock && contracts["MosaicERC20"]]);

  const onConnect = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // setWeb3(web3);
      const contractAddresses = require("./contracts/addresses.json");
      setAccount(account);
      setContracts({
        MosaicDAO: (await ethers.getContractAtFromArtifact(
          MosaicDAOArtifact,
          contractAddresses.MosaicDAO,
          signer
        )) as types.MosaicDAO,
        MosaicERC20: (await ethers.getContractAtFromArtifact(
          MosaicERC20Artifact,
          contractAddresses.MosaicERC20,
          signer
        )) as types.MosaicERC20,
        MosaicGovernor: (await ethers.getContractAtFromArtifact(
          MosaicGovernorArtifact,
          contractAddresses.MosaicGovernor,
          signer
        )) as types.MosaicGovernor,
        TokenAirDrop: (await ethers.getContractAtFromArtifact(
          TokenAirDropArtifact,
          contractAddresses.TokenAirDrop,
          signer
        )) as types.TokenAirDrop,
      });
    } catch {
      alert("failed");
    }
  };

  const advanceBlock = async (repeat = 1) => {
    try {
      for (; repeat > 0; repeat--) {
        await contracts["MosaicERC20"].transfer(
          "0x95b4A71dBF0160D936350c1fFB55049580a25288",
          1
        );
        const blockNumber = await web3.eth.getBlockNumber();
        console.log(blockNumber);
      }
    } catch (err) {
      console.log(err.toString());
    }
  };

  return (
    <UserContext.Provider
      value={{
        account,
        web3,
        contracts,
      }}
    >
      <Topbar onConnect={onConnect}></Topbar>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
