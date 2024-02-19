import { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "../context/UserContext";
import EmptyMessage from "./EmptyMessage";
import { uniqBy } from "lodash";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(null);
  const [online, setOnline] = useState({});
  const { id } = useContext(UserContext);
  const [newMesssage, setNewMessage] = useState("");
  const [messages, setNewMessages] = useState([]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  const showOnline = (peoples) => {
    const people = {};
    peoples.forEach(({ userId, email }) => {
      people[userId] = email;
    });
    setOnline(people);
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    console.log(e, messageData);
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
      { text: newMesssage, sender: id, recipient: selectedPeople },
    ]);
  };

  const onlinePeople = { ...online };
  delete onlinePeople[id];

  const messageWithoutDuplicate = uniqBy(messages, "id");

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 ">
        <Logo />

        {Object.keys(onlinePeople).map((userId, i) => (
          <div
            onClick={() => setSelectedPeople(userId)}
            className={
              "border-b border-gray-100  flex items-center gap-2 cursor-pointer " +
              (userId === selectedPeople ? "bg-blue-50" : "")
            }
            key={i}
          >
            {userId === selectedPeople && (
              <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
            )}
            <div className="flex gap-2 py-2 pl-4 items-center">
              <Avatar email={online[userId]} userId={userId} />
              <span className="text-gray-700">{online[userId]}</span>
            </div>
          </div>
        ))}
      </div>
      {!selectedPeople ? (
        <EmptyMessage />
      ) : (
        <div className="flex flex-col bg-blue-50 w-2/3 p-2">
          <div className="flex-grow">
            {messageWithoutDuplicate.map((m, i) => (
              <div key={i}>
                sender:{m.sender}
                <br />
                my id :{id}
                {m.text}
              </div>
            ))}
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
