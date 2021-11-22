import React, { useContext, useEffect, useState, useRef } from "react";
import ActionPanel from "../../components/ActionPanel";
import UserContext from "../../context/UserContext";
import Mosaic from "../../components/Mosaic";
import { Container } from "react-bootstrap";
import { Col, Row, Button } from "react-bootstrap";
import Activity from "../../components/Activity";
import logo from "../../assets/images/moslogo.png";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormCheck from "react-bootstrap/FormCheck";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Web3Storage, File } from "web3.storage/dist/bundle.esm.min.js";
import axios from "axios";

function Home() {
  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGExN0U3MjFjOTNEN0NCOTFhQTI5RDg3ODRmODAwNkEzODQ0NTAyNTUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzAyMjU0NDUyNjksIm5hbWUiOiJoYWxsb2ZmYW1lIn0._2Gp6-5tNmY8JPEyv4Wph1B1CpYD36DxqMBZkvp-T74";

  const [showResults, setShowResults] = useState(0);

  const [selectedState, setselectedState] = useState({
    image: null,
    user: null,
    votes: null,
    address: null,
    number: null,
  });

  const [selectedImage, setSelectedImage] = useState(-1);

  const [modal, setModal] = useState(false);
  const [image, setImage] = useState(null);
  const [imageLabel, setImageLabel] = useState("");
  const [description, setDescription] = useState("");
  const [gallery, setGallery] = useState({ width: 0, images: [] });

  const { contracts, account, web3 } = useContext(UserContext);
  const [userERC20Balance, setUserERC20Balance] = useState(0.0);
  const [minProposalERC20Balance, setMinProposalERC20Balance] = useState(0.0);

  useEffect(() => {
    if (contracts["MosaicDAO"] && contracts["MosaicDAO"].address)
      populateGallery();
  }, [contracts]);

  const [loading, setLoading] = useState(false);

  const populateGallery = async () => {
    let tup = await contracts["MosaicDAO"].methods.getGalleryList().call();
    let images = tup[0].map((e, i) => {
      return { uri: e, id: tup[1][i] };
    });
    try {
      setGallery({
        width: await contracts["MosaicDAO"].methods.galleryWidth().call(),
        images: images,
      });
      setLoading(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const uploadFile = (e) => {
    let input = e.target;
    var reader;

    if (input.files && input.files[0]) {
      reader = new FileReader();

      reader.onload = (e) => {
        setImage(e.target.result);
      };

      reader.readAsArrayBuffer(input.files[0]);
    }
  };

  const onClick = (e, val) => {
    setShowResults(e.target.value);
  };

  const Remove = () => (
    <>
      <div className="container">
        {loading &&
          gallery.images.map((image) => (
            // this is fetching sample data from randomuser.me
            // replace with our mosaic api/ ipfs etc etc
            <div key={image.id}>
              <img
                onClick={(e) => setSelectedImage(image.id)}
                className="hvr-grow"
                style={{
                  objectFit: "contain",
                  height: 100,
                  width: 100,
                  padding: selectedImage == image.id ? 0 : 1,
                  borderStyle: "solid",
                  borderWidth: selectedImage == image.id ? 2 : 0,
                  borderColor: "black",
                }}
                variant="top"
                src={image.uri}
                alt="item"
              />
            </div>
          ))}
      </div>
      <div>
        {/* <img
      className="hvr-grow"
      style={{objectFit: "contain", height: 100, width: 100, padding: 1}} 
      variant="top" 
      src={}
      alt="item"
      /> */}
      </div>
    </>
  );

  const Add = () => (
    <>
      <Form.Group controlId="exampleForm.formFile" style={{ marginTop: 16 }}>
        <Form.Label>Choose an image (must be 256x256 pixels)</Form.Label>
        <Form.Control type="file" onChange={uploadFile} />
      </Form.Group>
    </>
  );

  // Run once when page loaded
  useEffect(() => {
    refreshPage();
  }, [contracts]);

  const refreshPage = async () => {
    if (contracts["MosaicERC20"] && contracts["MosaicERC20"].address) {
      console.log(
        (await contracts["MosaicERC20"].methods.balanceOf(account).call()) /
          Math.pow(10, await contracts["MosaicERC20"].methods.decimals().call())
      );
      setUserERC20Balance(
        (await contracts["MosaicERC20"].methods.balanceOf(account).call()) /
          Math.pow(10, await contracts["MosaicERC20"].methods.decimals().call())
      );
    }

    if (contracts["MosaicGovernor"] && contracts["MosaicGovernor"].address) {
      console.log(
        (await contracts["MosaicGovernor"].methods.proposalThreshold().call()) /
          Math.pow(10, await contracts["MosaicERC20"].methods.decimals().call())
      );
      setMinProposalERC20Balance(
        (await contracts["MosaicGovernor"].methods.proposalThreshold().call()) /
          Math.pow(10, await contracts["MosaicERC20"].methods.decimals().call())
      );
    }
  };

  const onRequestAirDrop = async () => {
    try {
      await contracts["TokenAirDrop"].methods.claim().send();
      refreshPage();
    } catch (err) {
      console.log(err);
    }
  };

  const onPropose = async () => {
    try {
      if (showResults == 0) {
        // TODO: Fix web3.storage related issues
        const fileName = "image.png";
        const storageClient = new Web3Storage({ token: API_KEY });
        const f = new File([image], fileName, { type: "image/png" });
        console.log(image);
        const imgURL =
          "https://ipfs.io/ipfs/" +
          (await storageClient.put([f])) +
          "/" +
          fileName;
        console.log(imgURL);
        const transferCalldata = web3.eth.abi.encodeFunctionCall(
          {
            name: "appendImage",
            type: "function",
            inputs: [
              {
                type: "string",
                name: "uri",
              },
            ],
          },
          [imgURL]
        );
        const proposal = await contracts["MosaicGovernor"].methods
          .proposeWithDetails(
            [contracts["MosaicDAO"].options.address],
            [0],
            [transferCalldata],
            description,
            imgURL,
            0,
            "Add"
          )
          .send();
      } else {
        if (selectedImage == -1) return;
        const imgURL = await contracts["MosaicDAO"].methods
          .getImage(selectedImage)
          .call();
        const transferCalldata = web3.eth.abi.encodeFunctionCall(
          {
            name: "removeImage",
            type: "function",
            inputs: [
              {
                type: "uint256",
                name: "index",
              },
            ],
          },
          [selectedImage]
        );
        const proposal = await contracts["MosaicGovernor"].methods
          .proposeWithDetails(
            [contracts["MosaicDAO"].options.address],
            [0],
            [transferCalldata],
            description,
            imgURL,
            selectedImage,
            "Remove"
          )
          .send();
      }
      window.location.href = "/";
    } catch (err) {
      alert(err.toString());
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

        <Row
          style={{
            paddingBottom: "6vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              height: "auto",
              width: 400,
              marginTop: 32,
            }}
          />
          {/* <h1 style={{textAlign: 'center', paddingTop: 32, fontWeight: 900}}>MosaicDAO</h1> */}
          <h4 style={{ textAlign: "center", paddingTop: 16 }}>
            Collaborative art curation, redefined.
          </h4>
          <Button
            variant="dark"
            size="lg"
            style={{ width: 200, borderRadius: 0, marginTop: 32 }}
            className="hvr-grow"
            onClick={() => {
              setModal(true);
            }}
          >
            Create a proposal
          </Button>
        </Row>

        <Row style={{ paddingBottom: "10vh" }}>
          <Col sm={{ span: 8, order: 2 }} style={{ paddingTop: "6vh" }}>
            <Mosaic />
          </Col>
          <Col sm={{ span: 4, order: 1 }} style={{ paddingTop: "6vh" }}>
            <Activity />
          </Col>
        </Row>

        <Row
          style={{
            paddingBottom: "4vh",
            paddingTop: "4vh",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#EEF1F4",
          }}
        >
          <h7 style={{ textAlign: "center", fontWeight: 800 }}>
            @2021 MosaicDAO
          </h7>
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
            <h5 style={{ fontWeight: 600 }}>Create a proposal</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select aria-label="Default select example" onChange={onClick}>
            <option value={0}>Add an Image</option>

            <option value={1}>Remove an Image</option>
          </Form.Select>

          <div>{showResults == 0 ? <Add /> : <Remove />}</div>

          <div style={{ marginTop: 40 }}>
            <h5 style={{ fontWeight: 800 }}>Proposal Description:</h5>
          </div>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              as="textarea"
              rows={10}
              placeholder="Describe your proposal"
            />
          </Form.Group>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="dark"
              size="lg"
              style={{
                width: 200,
                borderRadius: 0,
                marginTop: 20,
                marginBottom: 20,
              }}
              className="hvr-grow"
              onClick={onPropose}
              disabled={userERC20Balance < minProposalERC20Balance}
            >
              {userERC20Balance < minProposalERC20Balance - 5
                ? "Insufficient Tokens (" +
                  minProposalERC20Balance.toString() +
                  ")"
                : "Submit Proposal"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Home;
