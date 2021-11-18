import logo from './logo.svg';
import './App.css';
import { Route, Redirect, Routes } from "react-router-dom";
import {Home} from "./views"
import 
function App() {
  return (
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
  );
}

export default App;
