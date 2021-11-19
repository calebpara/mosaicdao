import { Button } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";

function Home() {
  const { contracts, account } = useContext(UserContext);
  const [userERC20Balance, setUserERC20Balance] = useState(0.0);

  // Run once when page loaded
  useEffect(() => {
    refreshPage();
  }, []);

  const refreshPage = async () => {
    if (contracts["MosaicERC20"])
      setUserERC20Balance(
        await contracts["MosaicERC20"].methods.balanceOf(account).call()
      );
  };

  const onRequestAirDrop = async () => {
    try {
      await contracts["TokenAirDrop"].methods.claim().send();
      refreshPage();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Token Balance: {userERC20Balance}</p>
        <Button variant="outlined">Vote</Button>
        <Button variant="outlined" onClick={onRequestAirDrop}>
          Request Airdrop
        </Button>
      </header>
    </div>
  );
}

export default Home;
