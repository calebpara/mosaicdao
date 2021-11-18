import React from "react";

const UserContext = React.createContext({
  account: null,
  web3: null,
  MuralDAOContract: null,
});

export default UserContext;
