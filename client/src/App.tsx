import { useEffect, useState } from "react";
import io from "socket.io-client";
import { v4 } from "uuid";

const ENDPOINT = "http://localhost:3000";
let socket;

function App() {
  const [isJoined, setIsJoined] = useState(false);
  const [userId] = useState(v4());
  const [messageInput, setMessageInput] = useState("");
  const [chat, setChat] = useState([]);
  function joinChat() {
    setIsJoined(true);
    socket.emit("send-user-connected", userId);
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("first-message", (msg) => {
      console.log(msg);
    });

    socket.on("user-connected", (users) => {
      console.log(users);
    });

    // socket.on("chat-message", (data) => {
    //   setChat((prevChat) => [...prevChat, data]);
    // });

    socket.on("match", (data) => {
      console.log("Match: ", data);
      let recipientSocketId;
      if (data.firstUser.userId == userId) {
        recipientSocketId = data.secondUser.socketId;
      } else {
        recipientSocketId = data.firstUser.socketId;
      }
      socket.emit("match-back", {
        ...data,
        recipientSocketId: recipientSocketId,
        msg: "Hello",
      });
    });

    socket.on("match-back-chat-message", (msg) => {
      console.log(msg);
    });

    return () => {
      socket.off("first-message");
    };
  }, []);

  function sendMessage() {
    socket.emit("send-chat-message", messageInput);
  }

  if (!isJoined) {
    return (
      <div className="bg-orange-100 flex justify-center">
        <button
          onClick={joinChat}
          className="my-16 bg-orange-600 hover:opacity-90 text-white py-2 px-4 text-xl rounded-md"
        >
          Join Chat
        </button>
      </div>
    );
  }
  return (
    <div className="bg-orange-100 flex flex-col items-center gap-4 pt-4 pb-16">
      <div className="text-2xl">Omegle Clone</div>
      <div className="text-lg">User Id: {userId}</div>
      <div className=""></div>
      <div className="border-2 bg-gray-50 rounded-lg border-black w-2/3 h-[300px] overflow-y-auto">
        {chat.map((message, index) => {
          return (
            <div
              key={index}
              className="bg-orange-700 text-white mx-2 p-2 text-lg rounded-md shadow-md w-2/3"
            >
              {message}
            </div>
          );
        })}
      </div>
      <div className="w-2/3 flex gap-2">
        <textarea
          className="w-full rounded-md shadow-md px-1"
          placeholder="You're now chatting with a stranger. Say Hi!"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-orange-600 hover:opacity-90 text-white px-4 my-2 rounded-md text-xl shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
