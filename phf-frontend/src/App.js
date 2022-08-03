import "./App.css";
import { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReactSwitch from "react-switch";
import NavbarComp from "./components/NavbarComp";
import Home from "./components/Home";
import Footer from "./components/Footer";

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <NavbarComp />
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
              <Route exact path="/login" />
              <Route exact path="/scraper" element={<Home />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </ThemeContext.Provider>
    </Router>
  );
}

export default App;
