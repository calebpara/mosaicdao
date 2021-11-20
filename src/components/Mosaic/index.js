import React, {useState, useEffect, Fragment} from 'react'
import './mosaic.css'
import axios from 'axios'
import {Col, Row} from 'react-bootstrap'


export default function Mosaic() {

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

    return (
        <div className="container">
            {loading &&
            user.map((user)=> (
                // this is fetching sample data from randomuser.me
                // replace with our mosaic api/ ipfs etc etc 
                <div key={user.login.uuid}>
                    <img
                    style={{objectFit: "contain", height: 100, width: 100, padding: 1}} 
                    variant="top" 
                    src={user.picture.medium}
                    alt="item"
                    />
                </div>
            ))}
        </div>
    )
}