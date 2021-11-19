import logo from "./logo.svg";
import "./App.css";
import { Route, Redirect, Routes } from "react-router-dom";
import { Home } from "./views";
import getWeb3 from "./getWeb3";
import Topbar from "./components/Navigation/Topbar";
import { useEffect, useState } from "react";
import UserContext from "./context/UserContext";

import MosaicERC20 from "./contracts/MosaicERC20.json";
import MosaicDAO from "./contracts/MosaicDAO.json";
import MosaicGovernor from "./contracts/MosaicGovernor.json";
import TokenAirDrop from "./contracts/TokenAirDrop.json";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState({
    MosaicDAO: null,
    MosaicERC20: null,
    MosaicGovernor: null,
    TokenAirDrop: null,
  });

  useEffect(() => {
    (async () => {
      if (window.ethereum.isConnected) onConnect();
    })();
  }, []);

  const onConnect = async () => {
    try {
      const web3 = await getWeb3();
      const account = (await web3.eth.getAccounts())[0];
      const networkId = await web3.eth.net.getId();

      setWeb3(web3);
      setAccount(account);
      setContracts({
        MosaicDAO: new web3.eth.Contract(
          MosaicDAO.abi,
          MosaicDAO.networks[networkId] &&
            MosaicDAO.networks[networkId].address,
          { from: account, gasLimit: 60000 }
        ),
        MosaicERC20: new web3.eth.Contract(
          MosaicERC20.abi,
          MosaicERC20.networks[networkId] &&
            MosaicERC20.networks[networkId].address,
          { from: account, gasLimit: 60000 }
        ),
        MosaicGovernor: new web3.eth.Contract(
          MosaicGovernor.abi,
          MosaicGovernor.networks[networkId] &&
            MosaicGovernor.networks[networkId].address,
          { from: account, gasLimit: 60000 }
        ),
        TokenAirDrop: new web3.eth.Contract(
          TokenAirDrop.abi,
          TokenAirDrop.networks[networkId] &&
            TokenAirDrop.networks[networkId].address,
          { from: account, gasLimit: 60000 }
        ),
      });
    } catch {
      alert("failed");
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
        <Route exact path="/" element={<Home />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
