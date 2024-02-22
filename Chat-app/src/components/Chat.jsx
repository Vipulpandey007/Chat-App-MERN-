import { useContext, useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { UserContext } from "../context/UserContext";
import EmptyMessage from "./EmptyMessage";
import { uniqBy } from "lodash";
import axios from "axios";
import Users from "./Users";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(null);
  const [online, setOnline] = useState({});
  const [newMesssage, setNewMessage] = useState("");
  const [messages, setNewMessages] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState({});
  const messageRef = useRef();
  const { userEmail, id, setId, setUserEmail } = useContext(UserContext);

  useEffect(() => {
    connectToWs();
  }, []);

  const connectToWs = () => {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected trying to reconnect.");
        connectToWs();
      }, 1000);
    });
  };
  const showOnline = (peoples) => {
    const people = {};
    peoples.forEach(({ userId, email }) => {
      people[userId] = email;
    });
    setOnline(people);
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnline(messageData.online);
    } else if ("text" in messageData) {
      setNewMessages((prev) => [...prev, { ...messageData }]);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedPeople,
        text: newMesssage,
      })
    );
    setNewMessage("");
    setNewMessages((prev) => [
      ...prev,
      {
        text: newMesssage,
        sender: id,
        recipient: selectedPeople,
        _id: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    const div = messageRef.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlineUsers = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(online).includes(p._id));
      const offlineUser = {};
      offlineUsers.forEach((p) => {
        offlineUser[p._id] = p;
      });

      setOfflineUsers(offlineUsers);
    });
  }, [online]);

  useEffect(() => {
    if (selectedPeople) {
      axios.get("/messages/" + selectedPeople).then((res) => {
        setNewMessages(res.data);
      });
    }
  }, [selectedPeople]);

  const onlinePeople = { ...online };
  delete onlinePeople[id];

  const messageWithoutDuplicate = uniqBy(messages, "_id");

  const logout = () => {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUserEmail(null);
    });
  };

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />
          {Object.keys(onlinePeople).map((userId, i) => (
            <Users
              id={userId}
              key={i}
              online={true}
              email={onlinePeople[userId]}
              onClick={() => setSelectedPeople(userId)}
              selectedPeople={userId === selectedPeople}
            />
          ))}
          {Object.keys(offlineUsers).map((userId, i) => (
            <Users
              id={userId}
              key={i}
              online={false}
              email={offlineUsers[userId].email}
              onClick={() => setSelectedPeople(userId)}
              selectedPeople={userId === selectedPeople}
            />
          ))}
        </div>
        <div className="p-2 text-center flex items-center justify-center">
          <span className="mr-2 text-sm text-gray-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
            {userEmail}
          </span>
          <button
            onClick={logout}
            className="text-sm bg-blue-100 py-1 px-2 text-gray-500 border rounded-sm"
          >
            Logout
          </button>
        </div>
      </div>
      {!selectedPeople ? (
        <EmptyMessage />
      ) : (
        <div className="flex flex-col bg-blue-50 w-2/3 p-2">
          <div className="flex-grow">
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute inset-0">
                {messageWithoutDuplicate.map((m, i) => (
                  <div
                    key={i}
                    className={m.sender === id ? "text-right" : "text-left"}
                  >
                    <div
                      className={
                        "text-left inline-block p-2 my-2 rounded-lg text-sm " +
                        (m.sender === id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700")
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={messageRef}></div>
              </div>
            </div>
          </div>
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              value={newMesssage}
              onChange={(e) => setNewMessage(e.target.value)}
              type="text"
              placeholder="Type something..."
              className="bg-white border p-2 flex-grow rounded-lg"
            />
            <button
              className="bg-gray-500 p-2 text-white rounded-lg"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Chat;
