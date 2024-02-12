import "./App.css";
import Register from "./components/Register";
import axios from "axios";
import { UserContextProvider } from "./context/UserContext";

function App() {
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;
  return (
    <div>
      <UserContextProvider>
        <Register />
      </UserContextProvider>
    </div>
  );
}

export default App;
