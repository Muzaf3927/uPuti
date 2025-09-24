import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useRef, useEffect, useMemo } from "react";

// shadcn
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useLocation } from "react-router-dom";
import { useGetUserChats, useGetChatMessages, useSendChatMessage } from "@/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Check, CheckCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function Chats() {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialTripId = params.get("tripId");
  const initialReceiverId = params.get("receiverId");

  const [selected, setSelected] = useState({ tripId: initialTripId, receiverId: initialReceiverId });
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);
  const queryClient = useQueryClient();
  const { data: chatsRes } = useGetUserChats();
  const chats = chatsRes?.chats || [];
  const selectedChat = chats.find(
    (c) => String(c.trip_id) === String(selected.tripId) && String(c.chat_partner_id) === String(selected.receiverId)
  );
  const { data: messagesRes } = useGetChatMessages(selected.tripId, selected.receiverId, Boolean(selected.tripId && selected.receiverId));
  const messages = messagesRes?.messages || [];
  const sendMutation = useSendChatMessage(selected.tripId);

  const handleSend = async () => {
    if (!message.trim() || !selected.receiverId || !selected.tripId) return;
    try {
      await sendMutation.mutateAsync({ receiver_id: Number(selected.receiverId), message });
      setMessage("");
    } catch (_err) {}
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selected]);

  // После открытия чата — обновим список чатов, чтобы обнулить непрочитанные
  useEffect(() => {
    if (selected.tripId && selected.receiverId) {
      queryClient.invalidateQueries({ queryKey: ["chats", "list"] });
    }
  }, [selected.tripId, selected.receiverId, queryClient]);

  return (
    <Card className="h-full border py-0 relative">
      {/* User List */}
      <CardContent className="flex px-0 relative h-full bg-green-500/5 rounded-2xl">
        <div className="flex flex-col w-24 sm:w-56 border-r bg-white/60">
          {chats.map((c) => (
            <Tooltip key={`${c.trip_id}-${c.chat_partner_id}`}>
              <TooltipTrigger
                onClick={() => setSelected({ tripId: c.trip_id, receiverId: c.chat_partner_id })}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg mb-1 transition-colors ${
                  String(selected.tripId) === String(c.trip_id) && String(selected.receiverId) === String(c.chat_partner_id)
                    ? "bg-blue-100 font-bold"
                    : "hover:bg-blue-50"
                }`}
                type="button"
              >
                <Avatar className="size-6 sm:size-10">
                  <AvatarImage src={c.partner?.avatar || "https://github.com/shadcn.png"} />
                  <AvatarFallback>{c.partner?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col text-sm min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold truncate">{c.partner?.name || "User"}</span>
                    {Number(c.unread_count || 0) > 0 ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white">{c.unread_count}</span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 truncate">
                    <span className="truncate">{c.trip?.from_city} → {c.trip?.to_city}</span>
                    {/* статус последнего сообщения */}
                    {c.last_message_is_read === true ? (
                      <CheckCheck className="size-3 text-green-600" />
                    ) : (
                      <Check className="size-3 text-gray-400" />
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{c.partner?.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {chats.length === 0 && (
            <div className="text-xs text-gray-500 px-4 py-3">Hozircha chatlar yo'q</div>
          )}
        </div>

        {/* Chat Window */}
        <div className=" flex flex-col bg-white overflow-y-clip w-full">
          <div className="border-b px-6 py-4 flex items-center gap-3 bg-gradient-to-r from-green-100 to-blue-100">
            {selectedChat ? (
              <>
                <Avatar className="size-6 sm:size-10">
                  <AvatarImage src={selectedChat.partner?.avatar || "https://github.com/shadcn.png"} />
                  <AvatarFallback>{selectedChat.partner?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm sm:text-lg">
                  {selectedChat.partner?.name}
                </span>
                <span className="text-xs text-gray-500">{selectedChat.trip?.from_city} → {selectedChat.trip?.to_city}</span>
              </>
            ) : (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MessageCircle size={16} /> Chatni tanlang
              </div>
            )}
          </div>
          <div className="px-6 py-4 pb-24 overflow-y-scroll flex flex-col gap-3 h-[calc(100vh-260px)]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id !== selected.receiverId ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`inline-block text-sm sm:text-base px-4 py-2 rounded-2xl max-w-[70%] shadow ${
                    msg.sender_id !== selected.receiverId
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-900 border"
                  }`}
                >
                  {msg.message}
                </span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="px-4 py-3 border-t flex items-center gap-2 bg-white sticky bottom-0 w-full">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Xabar yozing..."
              className="px-4 py-3 text-sm sm:text-base rounded-full border focus:outline-none focus:ring-2 focus:ring-green-300 w-full"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={!selected.tripId || !selected.receiverId}
            />
            <Button
              onClick={handleSend}
              className="sm:px-6 sm:py-3 px-4 py-3 text-sm rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              type="button"
              disabled={!selected.tripId || !selected.receiverId}
            >
              Отправить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Chats;
