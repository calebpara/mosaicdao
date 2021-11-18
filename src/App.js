import logo from "./logo.svg";
import "./App.css";
import { Route, Redirect, Routes } from "react-router-dom";
import { Home } from "./views";
import getWeb3 from "./getWeb3";
import Topbar from "./components/Navigation/Topbar";
import { useState } from "react";
import UserContext from "./context/UserContext";

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  const onConnect = async () => {
    try {
      const web3 = await getWeb3();
      const account = (await web3.eth.getAccounts())[0];
      console.log(account);
      setWeb3(web3);
      setAccount(account);
    } catch {
      alert("failed");
    }
  };

  return (
    <UserContext.Provider
      value={{
        account,
        web3,
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
