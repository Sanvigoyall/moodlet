import { BrowserRouter, Routes, Route } from "react-router-dom";
import Journal from "./Journal";
import Home from "./Home";
import About from "./About";
import Auth from "./Auth";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import MoodyChat from "./MoodyChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<MoodyChat />} />
        <Route path="/journal" element={<Journal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;