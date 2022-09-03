import React from 'react';
import "./App.css";
import { createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ReactSwitch from "react-switch";
import NavbarHandler from "./components/Handler_Navbar";
import DashboardHandler from "./components/Handler_Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Footer from "./components/Footer";
import { AuthContextProvider } from "./firebase/AuthContext";

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <AuthContextProvider>
          <NavbarHandler />
          <div className="App" id={theme}>
            <div className="switch">
              {" "}
              <ReactSwitch
                onChange={toggleTheme}
                checked={theme === "dark"}
              />{" "}
            </div>
            <div className="home-app">
              <Routes>
                <Route path="/" element={<Navigate replace to="/home" />} />
                <Route exact path="/home" element={<Home />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<DashboardHandler />} />
              </Routes>
            </div>
          </div>
        </AuthContextProvider>
        <br></br><br></br>
        <Footer />
      </ThemeContext.Provider>
    </Router>
  );
}

export default App;
