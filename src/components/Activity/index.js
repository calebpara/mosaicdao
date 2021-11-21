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

export default function Activity() {
  const { contracts, account, web3 } = useContext(UserContext);
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
    decimals: 1,
  });

  const populateEvents = async () => {
    setLoading(true);
    const blockNumber = (await web3.eth.getBlockNumber()) - 1;
    console.log(blockNumber);
    // sample data from randomuser.me
    // replace with our mosaic api/ ipfs etc etc
    const res = await axios.get("https://randomuser.me/api/?results=50");

    setGlobals({
      totalSupply: await contracts["MosaicERC20"].methods.totalSupply().call(),
      decimals: await contracts["MosaicERC20"].methods.decimals().call(),
    });

    console.log(contracts["MosaicGovernor"]);

    let ProposalDetails = await contracts["MosaicGovernor"].getPastEvents(
      "ProposalDetails",
      {
        fromBlock: 21741190,
      }
    );
    let ProposalCreations = await contracts["MosaicGovernor"].getPastEvents(
      "ProposalCreated",
      {
        fromBlock: 21741190,
      }
    );

    let Proposals = await Promise.all(
      ProposalCreations.map(async (obj, i) => {
        let dict = Object.assign({}, obj, ProposalDetails[i].returnValues);

        let votes = await contracts["MosaicGovernor"].methods
          .proposalVotes(dict.proposalId)
          .call();

        let numFor = votes[1];
        let numAgainst = votes[0];

        dict["numFor"] = numFor;
        dict["numAgainst"] = numAgainst;
        dict["quorum"] = await contracts["MosaicGovernor"].methods
          .quorum(
            blockNumber > parseInt(dict.returnValues.endBlock)
              ? parseInt(dict.returnValues.endBlock)
              : blockNumber
          )
          .call();
        dict["state"] = parseInt(
          await contracts["MosaicGovernor"].methods
            .state(dict.proposalId)
            .call()
        );
        return dict;
      })
    );
    console.log(Proposals);

    setOngoing(Proposals.filter((proposal) => proposal.state in [0, 1, 4]));
    setHistory(Proposals.filter((proposal) => proposal.state in [7]));
    setLoading(false);
  };

  const vote = async (id, support) => {
    // Execute
    if (support == -1) {
      try {
        await contracts["MosaicGovernor"].methods
          .execute(id)
          .send({ from: account });
      } catch (err) {
        alert(err.toString());
      }
      return;
    }
    await contracts["MosaicGovernor"].methods
      .castVote(id, support)
      .send({ from: account });
  };

  const conditionalButtons = (state) => {
    switch (state) {
      case 0:
      case 1:
        return (
          <>
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
                vote(modalState.proposalId, 1);
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
              onClick={() => {
                vote(modalState.proposalId, 0);
              }}
            >
              Vote Against
            </Button>
          </>
        );

      case 4:
        return (
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
            onClick={() => {
              vote(modalState.proposalId, -1);
            }}
          >
            Execute
          </Button>
        );
      default:
        return <></>;
    }
  };

  function ListProposals({ proposals, label }) {
    return (
      <>
        <div>
          <ul style={{ height: "700px", overflowY: "scroll" }}>
            {proposals.length > 0 &&
              proposals.map((entry) => (
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
                      startBlock: entry.returnValues.startBlock,
                      endBlock: entry.returnValues.endBlock,
                      numFor: entry.numFor,
                      numAgainst: entry.numAgainst,
                      quorum: entry.quorum,
                      proposalId: entry.proposalId,
                      state: entry.state,
                    });
                    console.log(entry.returnValues);
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
                      {entry.returnValues &&
                        entry.returnValues.description.substr(0, 40) +
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
                    data={[(modalState.numFor / globals.totalSupply) * 100]}
                  />
                  <ChartSeriesItem
                    color="#DD2E2E"
                    type="bar"
                    data={[(modalState.numAgainst / globals.totalSupply) * 100]}
                  />
                  <ChartSeriesItem
                    color="lightgray"
                    type="bar"
                    data={[
                      Math.max(
                        0,
                        ((modalState.quorum -
                          (modalState.numFor + modalState.numAgainst)) /
                          globals.totalSupply) *
                          100
                      ),
                    ]}
                  />
                  <ChartSeriesItem
                    color="#eeeeee"
                    type="bar"
                    data={[
                      (1 -
                        Math.max(
                          modalState.numAgainst + modalState.numFor,
                          modalState.quorum
                        ) /
                          globals.totalSupply) *
                        100,
                    ]}
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
              <h6 style={{ fontWeight: 600, color: "#282828" }}>
                Block #{modalState.startBlock} - Block #{modalState.endBlock}
              </h6>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 16,
              }}
            >
              {conditionalButtons(modalState.state)}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  return (
    <>
      <div style={{ display: "flex", paddingTop: 0, paddingBottom: 12 }}>
        <div
          className="hvr-grow"
          style={{ flex: 1, cursor: "pointer" }}
          onClick={() => handleClick("ongoing")}
        >
          <h5 style={{ textAlign: "center", fontWeight: 800 }}>
            Ongoing Proposals
          </h5>
        </div>
        <div
          className="hvr-grow"
          style={{ flex: 1, cursor: "pointer" }}
          onClick={() => handleClick("history")}
        >
          <h5 style={{ textAlign: "center", fontWeight: 800 }}>History</h5>
        </div>
      </div>
      <div>
        {(() => {
          switch (view) {
            case "ongoing":
              return (
                <ListProposals proposals={ongoing} handleClick={handleClick} />
              );
            case "history":
              return (
                <ListProposals proposals={history} handleClick={handleClick} />
              );
            default:
              return null;
          }
        })()}
      </div>
    </>
  );
}
