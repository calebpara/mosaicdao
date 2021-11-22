import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AccountCircle, Loyalty } from "@material-ui/icons";
import UserContext from "../../context/UserContext";
import logo from "../../assets/images/moslogo.png";
import discord from "../../assets/images/discord.png";
import twitter from "../../assets/images/twitter.png";
import liquidityPool from "../../assets/images/cash-back.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "32px",
    backgroundColor: "#EEF1F4",
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
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

  const { account, contracts } = useContext(UserContext);

  const handleConnect = () => {
    setIsConnecting(true);
    onConnect();
  };

  const onLiquidity = async () => {
    try {
      await contracts["TokenAirDrop"].methods.claim().send();
    } catch (err) {
      alert(err.toString());
    }
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
      <div position="static" color="transparent" className={classes.root}>
        <Toolbar>
          <a href="/">
            <img
              src={logo}
              alt="logo"
              style={{
                width: "auto",
                height: 32,
                marginRight: 10,
                marginTop: 5,
                marginBottom: 5,
              }}
            ></img>
          </a>

          <div className={classes.spacer}></div>
          <Tooltip title={"Claim MOSAIC Tokens"}>
            <a className="hvr-grow">
              <img
                src={liquidityPool}
                alt="twitter"
                onClick={onLiquidity}
                style={{
                  width: "auto",
                  height: 32,
                  marginRight: 10,
                  marginTop: 5,
                  marginBottom: 5,
                }}
              />
            </a>
          </Tooltip>

          {/* <a className="hvr-grow">
          <img
            src={twitter}
            alt="twitter"
            style={{
              width: 'auto',
              height: 32,
              marginRight: 10,
              marginTop: 5,
              marginBottom: 5,
            }}
          />
          </a>

          <a className="hvr-grow">
          <img
            src={discord}
            alt="discord"
            style={{
              width: 'auto',
              height: 32,
              marginRight: 10,
              marginTop: 5,
              marginBottom: 5,
            }}
          />
          </a> */}

          {account ? (
            <Button color="dark" variant="contained" disabled>
              {account.substr(0, 10) + "..."}
            </Button>
          ) : (
            ConnectBtn
          )}
        </Toolbar>
      </div>
    </>
  );
}
