import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useRef, useEffect } from "react";

// shadcn
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Dummy data
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const chatsData = {
  1: [
    { from: "me", text: "Hi Alice!" },
    { from: "Alice", text: "Hello!" },
  ],
  2: [
    { from: "me", text: "Hey Bob!" },
    { from: "Bob", text: "Hey, what's up?" },
  ],
  3: [
    { from: "me", text: "Hi Charlie!" },
    { from: "Charlie", text: "Hi there!" },
  ],
};

function Chats() {
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState(chatsData);
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (message.trim() === "") return;
    setChats((prev) => ({
      ...prev,
      [selectedUserId]: [
        ...prev[selectedUserId],
        { from: "me", text: message },
      ],
    }));
    setMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, selectedUserId]);

  return (
    <Card className="h-full border py-0 relative">
      {/* User List */}
      <CardContent className="flex px-0 relative h-full bg-green-500/5 rounded-2xl">
        <div className="flex flex-col">
          {users.map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger
                onClick={() => setSelectedUserId(user.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg mb-1 transition-colors ${
                  selectedUserId === user.id
                    ? "bg-blue-100 font-bold"
                    : "hover:bg-blue-50"
                }`}
                type="button"
              >
                <span className="size-5 sm:size-10 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold">
                  {user.name[0]}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Chat Window */}
        <div className=" flex flex-col bg-white overflow-y-clip w-full">
          <div className="border-b px-6 py-4 flex items-center gap-3">
            <div className="size-5 sm:size-10 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold">
              {users.find((u) => u.id === selectedUserId)?.name[0]}
            </div>
            <span className="font-semibold text-sm sm:text-lg">
              {users.find((u) => u.id === selectedUserId)?.name}
            </span>
          </div>
          <div className="px-6 py-4 pb-20 overflow-y-scroll flex flex-col gap-2 h-[300px]">
            {(chats[selectedUserId] || []).map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.from === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`inline-block text-sm sm:text-lg px-4 py-2 rounded-2xl max-w-[60%] shadow ${
                    msg.from === "me"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="px-6 py-4 border-t flex justify-between gap-2 bg-gray-50 absolute bottom-0 w-[74%] overflow-hidden">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="px-2 w-20 py-1 text-sm sm:px-4 sm:py-2 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-blue-300"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="sm:px-6 sm:py-2 px-3 py-1 text-sm rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
              type="button"
            >
              Send
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Chats;
