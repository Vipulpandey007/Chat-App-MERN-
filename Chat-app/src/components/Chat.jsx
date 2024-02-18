import { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "../context/UserContext";
import EmptyMessage from "./EmptyMessage";
import Message from "./Message";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(null);
  const [online, setOnline] = useState({});
  const { id } = useContext(UserContext);
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

    if ("online" in messageData) {
      showOnline(messageData.online);
    }
  };

  const onlinePeople = { ...online };
  delete onlinePeople[id];
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
      {!selectedPeople ? <EmptyMessage /> : <Message />}
    </div>
  );
};
export default Chat;
