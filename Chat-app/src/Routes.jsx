import Register from "./components/Register";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import Chat from "./components/Chat";
export default function Routes() {
  const { userEmail, id } = useContext(UserContext);
  if (userEmail) {
    return <Chat />;
  }

  return <Register />;
}
