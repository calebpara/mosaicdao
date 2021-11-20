import React, {useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import ModalDialog from 'react-bootstrap/ModalDialog'
import ModalHeader from 'react-bootstrap/ModalHeader'
import ModalTitle from 'react-bootstrap/ModalTitle'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalFooter from 'react-bootstrap/ModalFooter'

export default function Activity() {

    const [view, setView] = useState('ongoing')

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
                <div style={{backgroundColor: '#F8F8F8', marginBottom: 4, borderStyle: 'solid', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 0, paddingTop: 8, paddingLeft: 8, paddingRight: 8, flexDirection: 'row', display: 'flex', justifyContent: 'space-between'}}
                onClick={() => setModal(true)}
                >
                    <div>
                        <h8 style={{fontWeight: 600, color: '#8A8A8A'}}>
                        #1234 
                        </h8>

                        <h8 style={{fontWeight: 400, color: '#38A0FF', paddingLeft: 8}}>
                        Ends in:
                        </h8>
                        
                        <h8 style={{fontWeight: 400, color: '#38A0FF', paddingLeft: 8}}>
                        12:34
                        </h8>

                        <h6 style={{marginTop: 4}}> 
                            Proposal Title
                        </h6>

                        <h6 style={{marginTop: 16}}> 
                            Votes: 1234
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
        <Modal
        centered={true}
        show={modal}
        onHide={() => setModal(false)}
        >
        <div style={{width: '600px'}}>
            <h3>Proposal #1234</h3>
        </div>
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
