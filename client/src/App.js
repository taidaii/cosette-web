import logo from './logo-cosette.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./views/Home";
import About from './views/About';
import Tutorial from './views/Tutorial';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/tutorial" element={<Tutorial />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
