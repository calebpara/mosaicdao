import React, { useContext, useEffect, useState, useRef } from "react";
import ActionPanel from "../../components/ActionPanel";
import UserContext from "../../context/UserContext";
import Mosaic from '../../components/Mosaic';
import {Container} from 'react-bootstrap'
import {Col, Row, Button} from 'react-bootstrap'
import Activity from '../../components/Activity';
import logo from '../../assets/images/colorlogo.png'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import FormCheck from 'react-bootstrap/FormCheck'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import axios from 'axios'

function Home() {
  const [showResults, setShowResults] = useState(0)

  const [selectedState, setselectedState] = useState(
    {
        image:null,
        user:null,
        votes: null,
        address: null,
        number: null,
    }
)
  
  const[selectedImage ,setSelectedImage] = useState(0)

  const [modal, setModal] = useState(false);

  const [description, setDescription] = useState('');

  const { contracts, account } = useContext(UserContext);
  const [userERC20Balance, setUserERC20Balance] = useState(0.0);

      useEffect(() => {
        getUser()
    }, [])

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUser = async () => {
        try {
            // sample data from randomuser.me
            // replace with our mosaic api/ ipfs etc etc 
            const res = await axios.get("https://randomuser.me/api/?results=100");
            setUser(res.data.results);
            setLoading(true);
        } catch (err) {
            alert(err.message);
        }
    };

  

  const onClick = (e, val) => {
    setShowResults(e.target.value)
    console.log(e.target.value)
  }


  const Remove = () => (
    <>
    <div className="container">
      {loading &&
      user.map((user, index)=> (
          // this is fetching sample data from randomuser.me
          // replace with our mosaic api/ ipfs etc etc 
          <div key={user.login.uuid}>
              <img
              onClick={e => setSelectedImage(index)}
              className="hvr-grow"
              style={{objectFit: "contain", height: 100, width: 100, padding: 1}} 
              variant="top" 
              src={user.picture.medium}
              alt="item"
              />
          </div>
        ))}
    </div>
    <div>
      <h5>Remove:</h5>
      {/* <img
      className="hvr-grow"
      style={{objectFit: "contain", height: 100, width: 100, padding: 1}} 
      variant="top" 
      src={}
      alt="item"
      /> */}
    </div>
    </>
  )

  const Add = () => (
    <>
    <Form.Group controlId="formFile" style={{marginTop: 16}}>
    <Form.Label>Choose an image (must be 256x256 pixels)</Form.Label>
    <Form.Control type="file" />
    </Form.Group>
    </>
  )


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
    <>
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
              marginTop: 32
            }}
          />
          {/* <h1 style={{textAlign: 'center', paddingTop: 32, fontWeight: 900}}>MosaicDAO</h1> */}
          <h4 style={{textAlign: 'center', paddingTop: 16}}>Collaborative art curation, redefined.</h4>
        <Button 
        variant="dark" 
        size="lg" 
        style={{width: 200, borderRadius: 0, marginTop: 32}} 
        className="hvr-grow"
        onClick={() => {
          setModal(true);
        }}
        >
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

        <Row style={{ paddingBottom: '4vh', paddingTop: '4vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF1F4'}}>
          <h7 style={{textAlign: 'center', fontWeight: 800}}>@2021 MosaicDAO</h7>
        </Row>
    </Container>


    <Modal
    size="lg"
    show={modal}
    onHide={() => setModal(false)}
    aria-labelledby="example-modal-sizes-title-lg"
    >
    <Modal.Header closeButton>
      <Modal.Title id="example-modal-sizes-title-lg">
      <h5 style={{fontWeight: 600}}>
        Create a proposal
      </h5>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>

    <Form.Select aria-label="Default select example" onChange={onClick}>

      <option value={0}>
      Add an Image
      </option>

      <option value={1}>
      Remove an Image
      </option>

    </Form.Select>

    <div>
    { showResults === 0 ? <Remove /> : <Add /> }
    </div>

    <div style={{marginTop: 40}}>
        <h5 style={{fontWeight: 800}}>Propsal Description:</h5>
    </div>

    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
    <Form.Control 
    value = {description}
    onChange={e => setDescription(e.target.value)}
    as="textarea" 
    rows={10} 
    placeholder="Describe your proposal"
    />
    </Form.Group>

    <div style={{display: 'flex', justifyContent: 'center'}}>
    <Button 
      variant="dark" 
      size="lg" 
      style={{width: 200, borderRadius: 0, marginTop: 20, marginBottom: 20}} 
      className="hvr-grow"
      onClick={() => {
        console.log(description)
      }}
      >
        Submit Proposal
      </Button>
    </div>
    </Modal.Body>
  </Modal>
  </>

  );
}

export default Home;
