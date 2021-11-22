import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./loader.css";

function Loader() {
  return (
    <div>
      <CircularProgress size={120} />
    </div>
  );
}

export default Loader;
