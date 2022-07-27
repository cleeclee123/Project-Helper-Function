import "./App.css";
import { createContext, useState } from "react";
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
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <NavbarComp />
      <div className="App" id={theme}>
        <div className="switch">
          <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
        </div>
        <div className="home-app">
          <Home/>
        </div> 
      </div>
      <Footer/>
    </ThemeContext.Provider>
  );
}

export default App;
