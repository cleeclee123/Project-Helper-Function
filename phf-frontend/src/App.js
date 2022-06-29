import "./App.css";
import { createContext, useState } from "react";
import ReactSwitch from "react-switch";
import NavbarComp from "./components/NavbarComp";
import { Routes, Route, Router } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Code from "./components/Code";

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" id={theme}>
        <NavbarComp />
        <div className="switch">
          <label> {theme === "light" ? "Light Mode" : "Dark Mode"} </label>
          <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
        </div>        
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
