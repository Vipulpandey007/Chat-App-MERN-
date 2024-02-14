import Register from "./components/Register";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
export default function Routes() {
  const { userEmail, id } = useContext(UserContext);
  if (userEmail) {
    return "Logged in";
  }

  return <Register />;
}
