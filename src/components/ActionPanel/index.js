import { Tabs, Tab, AppBar } from "@material-ui/core";
import { useState } from "react";

const TabPanel = ({ children, index, value }) => {
  return <div>{index == value && "test"}</div>;
};

export default function ActionPanel({ children }) {
  const [value, setValue] = useState(0);
  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={(e, val) => {
            setValue(val);
          }}
        >
          <Tab label="Activity" />
          <Tab label="Proposals" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}></TabPanel>
      <TabPanel value={value} index={1}></TabPanel>
    </div>
  );
}
