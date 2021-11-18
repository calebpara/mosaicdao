import React from "react";

const UserContext = React.createContext({
  account: null,
  web3: null,
  contracts: null,
});

export default UserContext;
