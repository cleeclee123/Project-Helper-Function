import React from "react";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import { UserAuth } from "../firebase/AuthContext";
import { useNavigate } from "react-router-dom";

const HandleDashboard = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  if (user) {
    return <Dashboard/>
  } else {
    navigate("/home");
  } 
};

export default HandleDashboard;