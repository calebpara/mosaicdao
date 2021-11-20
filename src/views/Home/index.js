import { Button, Grid } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import ActionPanel from "../../components/ActionPanel";
import UserContext from "../../context/UserContext";
import Mosaic from '../../components/Mosaic';
import {Container} from 'react-bootstrap'
import {Col, Row} from 'react-bootstrap'
import Activity from '../../components/Activity';

function Home() {
  const { contracts, account } = useContext(UserContext);
  const [userERC20Balance, setUserERC20Balance] = useState(0.0);

  // Run once when page loaded
  useEffect(() => {
    refreshPage();
  }, [contracts]);

  const refreshPage = async () => {
    if (contracts["MosaicERC20"])
      setUserERC20Balance(
        (await contracts["MosaicERC20"].methods.balanceOf(account).call()) /
          Math.pow(10, await contracts["MosaicERC20"].methods.decimals().call())
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
    <Container fluid>

        {/* <p>Token Balance: {userERC20Balance}</p>
        <Button variant="outlined">Vote</Button>
        <Button variant="outlined" onClick={onRequestAirDrop}>
          Request Airdrop
        </Button> */}

        <Row style={{paddingTop: '6vh', paddingBottom: '6vh'}}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <h1>Welcome to MosaicDAO</h1>
          <h3>We're creating the world's most collaborative NFT, owned by the DAO.</h3>
        </div>
        </Row>

        <Row style={{paddingTop: '6vh', paddingBottom: '10vh'}}>
          <Col sm={4} >
          <Activity />
          </Col>
          <Col sm={8}>
            <Mosaic />
          </Col>
        </Row>
    </Container>

  );
}

export default Home;
