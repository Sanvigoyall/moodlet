import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./DarkModeContext";
import Home from "./Home";
import About from "./About";
import Auth from "./Auth";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import MoodyChat from "./MoodyChat";
import Journal from "./Journal";
import "./App.css";

function App() {
  return (
    <DarkModeProvider>
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
    </DarkModeProvider>
  );
}

export default App;
