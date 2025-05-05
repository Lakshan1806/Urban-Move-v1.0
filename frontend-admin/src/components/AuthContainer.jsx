import { useContext } from "react";
import { UserContext } from "../context/userContext";
import SignIn from "../pages/SignIn";
import { Navigate } from "react-router-dom";

function AuthContainer() {
  const { user } = useContext(UserContext);

  return user ? <Navigate to="/dashboard"/> : <SignIn />;
}

export default AuthContainer;
