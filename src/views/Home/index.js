
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import Mosaic from '../../components/Mosaic';
import {Container} from 'react-bootstrap'
import {Col, Row, Button} from 'react-bootstrap'
import Activity from '../../components/Activity';
import logo from '../../assets/images/moslogo.png'

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

        <Row style={{ paddingBottom: '6vh', alignItems: 'center', justifyContent: 'center'}}>
        <img
            src={logo}
            alt="logo"
            style={{
              height: 'auto', 
              width: 400, 
            }}
          />
          <h4 style={{textAlign: 'center', paddingTop: 32}}>We're redefining collaborative art curation.</h4>
        <Button variant="dark" size="lg" style={{width: 200, borderRadius: 0, marginTop: 32}} className="hvr-grow">
          Create a proposal
        </Button>
        </Row>

        <Row style={{paddingBottom: '10vh'}}>
        <Col sm={{span: 8, order: 2}} style={{paddingTop: '6vh'}}>
            <Mosaic />
          </Col>
          <Col sm={{span: 4, order: 1}} style={{paddingTop: '6vh'}}>
          <Activity />
          </Col>
          
        </Row>

        <Row style={{ paddingBottom: '6vh', alignItems: 'center', justifyContent: 'center'}}>
          <h7 style={{textAlign: 'center', fontWeight: 800}}>@2021 MosaicDAO</h7>
        </Row>
    </Container>
  );
}

export default Home;
