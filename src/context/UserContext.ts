import React from "react";

interface UserContextInterface {
  account: string;
  web3: any;
  contracts: any;
}

const UserContext = React.createContext<UserContextInterface | null>(null);

export default UserContext;
