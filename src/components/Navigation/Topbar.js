import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle, Loyalty } from "@material-ui/icons";
import UserContext from "../../context/UserContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "32px",
  },
  title: {
    flexGrow: 0,
    textAlign: "left",
    marginRight: "20px",
  },
  spacer: {
    flexGrow: 1,
  },
  spinner: {
    marginRight: "8px",
  },
}));

export default function Topbar({ onConnect }) {
  const classes = useStyles();

  const [isConnecting, setIsConnecting] = useState(false);

  const { account } = useContext(UserContext);

  const handleConnect = () => {
    setIsConnecting(true);
    onConnect();
  };

  const ConnectBtn = isConnecting ? (
    <Button
      color="inherit"
      onClick={handleConnect}
      variant="contained"
      disabled
    >
      <CircularProgress size={24} className={classes.spinner} />
      Connecting
    </Button>
  ) : (
    <Button color="primary" onClick={handleConnect} variant="contained">
      Connect
    </Button>
  );

  return (
    <>
      <AppBar position="static" color="transparent" className={classes.root}>
        <Toolbar>
          {/* <img
            src={require("../../resources/openlabs6-03.png")}
            style={{
              width: 198,
              height: 55,
              marginRight: 10,
              marginTop: 5,
              marginBottom: 5,
            }}
          ></img> */}

          <div className={classes.spacer}></div>
          {account ? (
            <Button color="inherit" variant="contained" disabled>
              {account.substr(0, 10) + "..."}
            </Button>
          ) : (
            ConnectBtn
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
