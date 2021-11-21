import React, { useState, useEffect, Fragment, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";
import "hammerjs";
import UserContext from "../../context/UserContext";

const [firstSeries, secondSeries, thirdSeries] = [[1], [5], [2]];

export default function Activity() {
  const { contracts, account } = useContext(UserContext);
  const [view, setView] = useState("ongoing");

  const [modalState, setModalState] = useState({
    image: null,
    user: null,
    votes: null,
    address: null,
    number: null,
  });

  const [modal, setModal] = useState(false);

  const handleClick = (viewState) => {
    setView(viewState);
  };

  useEffect(() => {
    if (contracts["MosaicGovernor"]) {
      populateEvents();
    }
  }, [contracts]);

  const [ongoing, setOngoing] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globals, setGlobals] = useState({
    totalSupply: 1,
  });

  const populateEvents = async () => {
    try {
      // sample data from randomuser.me
      // replace with our mosaic api/ ipfs etc etc
      const res = await axios.get("https://randomuser.me/api/?results=50");

      setGlobals({
        totalSupply: await contracts["MosaicERC20"].methods
          .totalSupply()
          .call(),
      });

      let ProposalDetails = await contracts["MosaicGovernor"].getPastEvents(
        "ProposalDetails",
        {
          fromBlock: 1,
        }
      );
      let ProposalCreations = await contracts["MosaicGovernor"].getPastEvents(
        "ProposalCreated",
        {
          fromBlock: 1,
        }
      );

      let Proposals = await ProposalCreations.map(async (obj, i) => {
        let dict = Object.assign({}, obj, ProposalDetails[i].returnValues);
        console.log(numFor);

        let numFor = (
          await contracts["MosaicGovernor"].getPastEvents("VoteCast", {
            fromBlock: dict.returnValues.startBlock,
            toBlock: dict.returnValues.endBlock,
            proposalId: dict.proposalId,
            support: 0,
          })
        ).reduce((a, b) => a + b.returnValues.weight, 0);

        let numAgainst = (
          await contracts["MosaicGovernor"].getPastEvents("VoteCast", {
            fromBlock: dict.returnValues.startBlock,
            toBlock: dict.returnValues.endBlock,
            proposalId: dict.proposalId,
            support: 1,
          })
        ).reduce((a, b) => a + b.returnValues.weight, 0);

        dict["numFor"] = numFor;
        dict["numAgainst"] = numAgainst;
        dict["quorum"] = await contracts["MosaicGovernor"].methods
          .quorum(dict.returnValues.endBlock)
          .call();

        return dict;
      });
      setOngoing(Proposals);
      setLoading(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const vote = async (id, support) => {
    await contracts["MosaicGovernor"].castVote(id, support, { from: account });
  };

  function Ongoing() {
    return (
      <>
        <div>
          <div style={{ display: "flex", paddingTop: 0, paddingBottom: 12 }}>
            <div
              className="hvr-grow"
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => handleClick("ongoing")}
            >
              <h5 style={{ textAlign: "center", fontWeight: 800 }}>
                Ongoing proposals
              </h5>
            </div>
            <div
              className="hvr-grow"
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => handleClick("history")}
            >
              <h5 style={{ textAlign: "center", fontWeight: 800 }}>
                Proposal history
              </h5>
            </div>
          </div>
          <ul style={{ height: "700px", overflowY: "scroll" }}>
            {ongoing &&
              ongoing.map((entry) => (
                // this is fetching sample data from randomuser.me
                // replace with our mosaic api/ ipfs etc etc
                <div
                  className="hvr-grow-small"
                  style={{
                    backgroundColor: "#F8F8F8",
                    marginBottom: 4,
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#EAEAEA",
                    borderRadius: 0,
                    paddingTop: 8,
                    paddingLeft: 8,
                    paddingRight: 8,
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={async () => {
                    setModalState({
                      image: entry.uri,
                      address: entry.returnValues.proposer,
                      number: entry.incrementingId,
                      description: entry.returnValues.description,
                      numFor: entry.numFor,
                      numAgainst: entry.numAgainst,
                      quorum: entry.quorum,
                    });
                    setModal(true);
                  }}
                >
                  <div>
                    <h8 style={{ fontWeight: 600, color: "#8A8A8A" }}>
                      #{entry.incrementingId} - {entry.action}
                    </h8>

                    {/* <h8 style={{fontWeight: 400, color: '#38A0FF', paddingLeft: 8}}>
                        Ends in:
                        </h8>
                        
                        <h8 style={{fontWeight: 400, color: '#38A0FF', paddingLeft: 8}}>
                        12:34
                        </h8> */}

                    <h5 style={{ marginTop: 4 }}>
                      {entry.returnValues.description.substr(0, 40) +
                        (entry.returnValues.description.length > 40
                          ? "..."
                          : "")}
                    </h5>

                    <h6 style={{ marginTop: 16 }}>
                      {/* Votes: {numFor + numAgainst} */}
                    </h6>
                  </div>
                  <div>
                    <img
                      className="hvr-grow"
                      style={{
                        objectFit: "contain",
                        height: 80,
                        width: 80,
                        padding: 1,
                      }}
                      variant="top"
                      src={entry.uri}
                      alt="item"
                    />
                  </div>
                </div>
              ))}
          </ul>
        </div>

        {/*------------ ONGOING PROPOSAL MODAL -------------------*/}

        <Modal
          size="lg"
          show={modal}
          onHide={() => setModal(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              <h6>
                Proposal #{modalState.number} by 0x{modalState.address}
              </h6>
              <h5 style={{ fontWeight: 600 }}>Add Image</h5>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                objectFit="cover"
                style={{ height: "auto", width: 320, padding: 1, resize: "" }}
                variant="top"
                src={modalState.image}
                alt="item"
              />
            </div>

            <div style={{ marginTop: 40 }}>
              <h5 style={{ fontWeight: 800 }}>Propsal Description:</h5>
            </div>

            <div style={{ marginTop: 16 }}>
              <h6 style={{ fontWeight: 500 }}>{modalState.description}</h6>
            </div>

            <div style={{ marginTop: 40 }}>
              <h5 style={{ fontWeight: 800 }}>Should this image be added?</h5>
              <Chart>
                <ChartSeries>
                  <ChartSeriesItem
                    color="#149638"
                    type="bar"
                    stack={{ type: "100%" }}
                    data={firstSeries}
                  />
                  <ChartSeriesItem
                    color="#DD2E2E"
                    type="bar"
                    data={secondSeries}
                  />
                  <ChartSeriesItem
                    color="lightgray"
                    type="bar"
                    data={thirdSeries}
                  />
                </ChartSeries>
              </Chart>
            </div>

            <div>
              <h6 style={{ fontWeight: 600, color: "#149638" }}>
                Votes for: {modalState.numFor}
              </h6>
              <h6 style={{ fontWeight: 600, color: "#DD2E2E" }}>
                Votes against: {modalState.numAgainst}
              </h6>
              <h6 style={{ fontWeight: 600, color: "#282828" }}>
                Votes until quorum: {modalState.quorum}
              </h6>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 16,
              }}
            >
              <Button
                variant="dark"
                size="lg"
                style={{
                  width: 160,
                  borderRadius: 0,
                  marginTop: 20,
                  marginBottom: 20,
                  marginRight: 8,
                  backgroundColor: "#149638",
                  borderWidth: 0,
                  fontWeight: 600,
                }}
                className="hvr-grow"
                onClick={() => {
                  vote();
                }}
              >
                Vote For
              </Button>

              <Button
                variant="dark"
                size="lg"
                style={{
                  width: 160,
                  borderRadius: 0,
                  marginTop: 20,
                  marginBottom: 20,
                  marginLeft: 8,
                  backgroundColor: "#DD2E2E",
                  borderWidth: 0,
                  fontWeight: 600,
                }}
                className="hvr-grow"
                // onClick={() => {
                //     console.log(description)
                // }}
              >
                Vote Against
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  function History() {
    return (
      <div style={{ backgroundColor: "red" }}>
        <div style={{ display: "flex", paddingTop: 16, paddingBottom: 8 }}>
          <div
            style={{ flex: 1, backgroundColor: "red" }}
            onClick={() => handleClick("ongoing")}
          >
            <h5 style={{ textAlign: "center" }}>Ongoing proposals</h5>
          </div>
          <div style={{ flex: 1 }} onClick={() => handleClick("history")}>
            <h5 style={{ textAlign: "center" }}>Proposal history</h5>
          </div>
        </div>
        <ul style={{ height: "700px", overflowY: "scroll" }}>
          {loading &&
            history.map((user) => (
              // this is fetching sample data from randomuser.me
              // replace with our mosaic api/ ipfs etc etc
              <div
                style={{
                  backgroundColor: "#F8F8F8",
                  marginBottom: 4,
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderColor: "#EAEAEA",
                  borderRadius: 0,
                }}
              >
                <h7>Image added</h7>
                <img
                  className="hvr-grow"
                  style={{
                    objectFit: "contain",
                    height: 80,
                    width: 80,
                    padding: 1,
                  }}
                  variant="top"
                  src={user.picture.medium}
                  alt="item"
                />
              </div>
            ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      {(() => {
        switch (view) {
          case "ongoing":
            return <Ongoing handleClick={handleClick} />;
          case "history":
            return <History handleClick={handleClick} />;
          default:
            return null;
        }
      })()}
    </div>

    // <div>
    // <div style={{display: 'flex', paddingTop: 16, paddingBottom: 8}}>
    //     <div style={{flex: 1}}>
    //         <h5 style={{textAlign: 'center'}}>
    //             Ongoing proposals
    //         </h5>
    //     </div>
    //     <div style={{flex: 1}}>
    //         <h5 style={{textAlign: 'center'}}>
    //             Mosaic Activity
    //         </h5>
    //     </div>

    // </div>
    // <ul style={{ height: '700px', overflowY: 'scroll'}}>
    //     {loading &&
    //     user.map((user)=> (
    //         // this is fetching sample data from randomuser.me
    //         // replace with our mosaic api/ ipfs etc etc
    //         <div style={{backgroundColor: '#F8F8F8', marginBottom: 4, borderStyle: 'solid', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 0}}>
    //             <h7>
    //             Image added
    //             </h7>
    //             <img
    //             className="hvr-grow"
    //             style={{objectFit: "contain", height: 80, width: 80, padding: 1}}
    //             variant="top"
    //             src={user.picture.medium}
    //             alt="item"
    //             />

    //         </div>
    //     ))}
    // </ul>
    // </div>
  );
}
