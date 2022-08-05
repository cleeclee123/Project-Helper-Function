import NavbarNorm from "./NavbarComp";
import NavbarUser from "./NavbarUser";
import { UserAuth } from "../firebase/AuthContext";

const handleNavbar = () => {
  const { user } = UserAuth();
  if (user) {
    return <NavbarUser/>
  } else {
    return <NavbarNorm/>
  } 
};

export default handleNavbar;