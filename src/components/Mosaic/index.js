import React, { useState, useEffect, Fragment } from "react";
import "./mosaic.css";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import { IMGRPC_ENDPOINT } from "../../api/constants.js";

export default function Mosaic() {
  useEffect(() => {}, []);

  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container">
      {/* {loading &&
            user.map((user)=> (
                // this is fetching sample data from randomuser.me
                // replace with our mosaic api/ ipfs etc etc 
                <div key={user.login.uuid}>
                    <img
                    className="hvr-grow"
                    style={{objectFit: "contain", height: 100, width: 100, padding: 1}} 
                    variant="top" 
                    src={user.picture.medium}
                    alt="item"
                    />
                </div>
            ))} */}

      <img
        src={IMGRPC_ENDPOINT}
        alt="mosaic"
        style={{
          objectFit: "contain",
          height: "100%",
          width: "100%",
          borderStyle: "solid",
          borderWidth: 2,
          borderColor: "black",
        }}
      />
    </div>
  );
}
