import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import {Button} from 'react-bootstrap'

export default function Activity() {

    const [view, setView] = useState('ongoing')

    const [modalState, setModalState] = useState(
        {
            image:null,
            user:null,
            votes: null,
            address: null,
            number: null,
        }
    )

    const [modal, setModal] = useState(false);

    const handleClick = (viewState) => {
        setView(viewState)
    }

    useEffect(() => {
        getUser()
    }, [])

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUser = async () => {
        try {
            // sample data from randomuser.me
            // replace with our mosaic api/ ipfs etc etc 
            const res = await axios.get("https://randomuser.me/api/?results=50");
            setUser(res.data.results);
            setLoading(true);
        } catch (err) {
            alert(err.message);
        }
    };

    function Ongoing() {
        return(
        <>
        <div>
        <div style={{display: 'flex', paddingTop: 0, paddingBottom: 8}}>
            <div className="hvr-grow" style={{flex: 1, cursor: 'pointer'}}
            onClick={() => handleClick('ongoing')}
            >
                <h5 style={{textAlign: 'center', fontWeight: 800}}>
                    Ongoing proposals
                </h5>
            </div>
            <div className="hvr-grow" style={{flex: 1, cursor: 'pointer'}}
            onClick={() => handleClick('history')}
            >
                <h5 style={{textAlign: 'center', fontWeight: 800}}>
                    Proposal history
                </h5>
            </div>
            
        </div>
        <ul style={{ height: '700px', overflowY: 'scroll'}}>
            {loading &&
            user.map((user)=> (
                // this is fetching sample data from randomuser.me
                // replace with our mosaic api/ ipfs etc etc 
                <div className="hvr-grow-small" style={{backgroundColor: '#F8F8F8', marginBottom: 4, borderStyle: 'solid', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 0, paddingTop: 8, paddingLeft: 8, paddingRight: 8, flexDirection: 'row', display: 'flex', justifyContent: 'space-between', cursor: 'pointer'}}
                onClick={() => { 
                    setModal(true);
                    setModalState({
                        image: user.picture.medium,
                        votes: user.registered.age,
                        address: user.login.md5,
                        number: user.location.postcode,
                    })
                }}
                >
                    <div>
                        <h8 style={{fontWeight: 600, color: '#8A8A8A'}}>
                        #{user.location.postcode} 
                        </h8>

                        {/* <h8 style={{fontWeight: 400, color: '#38A0FF', paddingLeft: 8}}>
                        Ends in:
                        </h8>
                        
                        <h8 style={{fontWeight: 400, color: '#38A0FF', paddingLeft: 8}}>
                        12:34
                        </h8> */}

                        <h5 style={{marginTop: 4}}> 
                            Add Image
                        </h5>

                        <h6 style={{marginTop: 16}}> 
                            Votes: {user.registered.age}
                        </h6>
                    </div>
                    <div>
                    <img
                    className="hvr-grow"
                    style={{objectFit: "contain", height: 80, width: 80, padding: 1}} 
                    variant="top" 
                    src={user.picture.medium}
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
            Propsal #{modalState.number} by 0x{modalState.address}
          </h6>
          <h5 style={{fontWeight: 600}}>
            Add Image
          </h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <img
            objectFit="cover"
            style={{ height: 'auto', width: 360, padding: 1, resize: ''}} 
            variant="top" 
            src={modalState.image}
            alt="item"
            />
        </div>

        <div style={{marginTop: 40}}>
            <h5 style={{fontWeight: 800}}>Propsal Description:</h5>
        </div>

        <div style={{marginTop: 16}}>
            <h6 style={{fontWeight: 500}}>
            Lorem ipsum ipsum ipsum Lorem ipsum ipsum ipsum Lorem ipsum 
            ipsum ipsum Lorem ipsum ipsum ipsum Lorem ipsum ipsum ipsum
            Lorem ipsum ipsum ipsum Lorem ipsum ipsum ipsum Lorem ipsum 
            ipsum ipsum Lorem ipsum ipsum ipsum Lorem ipsum ipsum ipsum
            </h6>
        </div>

        <div style={{marginTop: 40}}>
            <h5 style={{fontWeight: 800}}>Should this image be added?</h5>
        </div>

        <div style={{marginTop: 16}}>
            <h6 style={{fontWeight: 600}}>
            Votes for
            </h6>
            <h6 style={{fontWeight: 600}}>
            Votes against
            </h6>
        </div>


        </Modal.Body>
      </Modal>
      </>
        )
    }

    function History() {
        return(
        <div style={{backgroundColor: 'red' }}>
        <div style={{display: 'flex', paddingTop: 16, paddingBottom: 8}}>
            <div style={{flex: 1, backgroundColor: 'red'}}
            onClick={() => handleClick('ongoing')}
            >
                <h5 style={{textAlign: 'center'}}>
                    Ongoing proposals
                </h5>
            </div>
            <div style={{flex: 1}}
            onClick={() => handleClick('history')}
            >
                <h5 style={{textAlign: 'center'}}>
                    Proposal history
                </h5>
            </div>
            
        </div>
        <ul style={{ height: '700px', overflowY: 'scroll'}}>
            {loading &&
            user.map((user)=> (
                // this is fetching sample data from randomuser.me
                // replace with our mosaic api/ ipfs etc etc 
                <div style={{backgroundColor: '#F8F8F8', marginBottom: 4, borderStyle: 'solid', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 0}}>
                    <h7>
                    Image added
                    </h7>
                    <img
                    className="hvr-grow"
                    style={{objectFit: "contain", height: 80, width: 80, padding: 1}} 
                    variant="top" 
                    src={user.picture.medium}
                    alt="item"
                    />
                    
                </div>
            ))}
        </ul>
        </div>
        )
    }

    return (
        <div>
            {(() => {
                switch (view) {
                case 'ongoing':
                    return <Ongoing handleClick={handleClick} />
                case 'history':
                    return <History handleClick={handleClick} />
                default:
                    return null
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
    )
}
