import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useRef, useEffect, useMemo } from "react";

// shadcn
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetUserChats,
  useGetChatMessages,
  useSendChatMessage,
  useGetData,
} from "@/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Check, CheckCheck, X, ArrowLeft, Send } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/app/i18n.jsx";
import { useSelector } from "react-redux";

function Chats() {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const initialTripId = params.get("tripId");
  const initialReceiverId = params.get("receiverId");
  // Получаем данные пользователя через API
  const { data: currentUser } = useGetData("/users/me");
  const currentUserId = currentUser?.id;
  

  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const queryClient = useQueryClient();
  
  const { data: chatsRes } = useGetUserChats();
  const chats = chatsRes?.chats || [];

  // Если есть параметры в URL, автоматически открываем чат
  useEffect(() => {
    if (initialTripId && initialReceiverId && chats.length > 0) {
      const chat = chats.find(
        (c) =>
          String(c.trip_id) === String(initialTripId) &&
          String(c.chat_partner_id) === String(initialReceiverId)
      );
      if (chat) {
        setSelectedChat(chat);
      }
    }
  }, [initialTripId, initialReceiverId, chats]);

  const { data: messagesRes } = useGetChatMessages(
    selectedChat?.trip_id,
    selectedChat?.chat_partner_id,
    Boolean(selectedChat?.trip_id && selectedChat?.chat_partner_id)
  );
  const messages = messagesRes?.messages || [];
  const sendMutation = useSendChatMessage(selectedChat?.trip_id);

  const handleSend = async () => {
    if (!message.trim() || !selectedChat?.chat_partner_id || !selectedChat?.trip_id) return;
    try {
      await sendMutation.mutateAsync({
        receiver_id: Number(selectedChat.chat_partner_id),
        message,
      });
      setMessage("");
      inputRef.current?.focus();
    } catch (_err) {}
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Обновляем URL без перезагрузки страницы
    navigate(`/chats?tripId=${chat.trip_id}&receiverId=${chat.chat_partner_id}`, { replace: true });
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    navigate('/chats', { replace: true });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // После открытия чата — обновим список чатов, чтобы обнулить непрочитанные
  useEffect(() => {
    if (selectedChat?.trip_id && selectedChat?.chat_partner_id) {
      queryClient.invalidateQueries({ queryKey: ["chats", "list"] });
    }
  }, [selectedChat?.trip_id, selectedChat?.chat_partner_id, queryClient]);

  // Если выбран чат, показываем интерфейс чата
  if (selectedChat) {
    return (
      <Card className="h-[100dvh] sm:h-full border py-0 relative rounded-3xl overflow-hidden shadow-sm">
        <CardContent className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-50">
          {/* Заголовок чата */}
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-white/80 backdrop-blur-sm">
            <Button
              onClick={handleBackToList}
              className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </Button>
            <Avatar className="size-10 ring-2 ring-white shadow">
              <AvatarFallback>
                {getInitials(selectedChat.partner?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-gray-900 truncate">
                {selectedChat.partner?.name || "Пользователь"}
              </span>
              <span className="text-sm text-gray-500 truncate">
                {selectedChat.trip?.from_city} → {selectedChat.trip?.to_city}
              </span>
            </div>
          </div>

          {/* Область сообщений */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-0.5 bg-gradient-to-b from-white/50 to-blue-50/50">
            
            {messages.map((msg) => {
              const isMyMessage = Number(msg.sender_id) === Number(currentUserId);
              
              return (
                <div
                  key={msg.id}
                  className={`flex w-full ${isMyMessage ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col max-w-[75%] ${isMyMessage ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-3 py-2 rounded-2xl shadow-sm relative ${
                        isMyMessage
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed pr-12">{msg.message}</p>
                      <div className={`absolute bottom-1 ${
                        isMyMessage ? "right-2" : "right-2"
                      } flex items-center gap-1`}>
                        <span className="text-xs opacity-70">
                          {new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {isMyMessage && (
                          <span>
                            {msg.is_read ? (
                              <CheckCheck className="w-3 h-3 text-blue-200" />
                            ) : (
                              <Check className="w-3 h-3 text-blue-200" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Поле ввода */}
          <div className="border-t bg-white/80 backdrop-blur-sm px-4 py-3">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Напишите сообщение..."
                className="flex-1 rounded-full border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                ref={inputRef}
                autoFocus
              />
              <Button
                onClick={handleSend}
                className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
                size="sm"
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Если чат не выбран, показываем список чатов
  return (
    <Card className="h-[100dvh] sm:h-full border py-0 relative rounded-3xl overflow-hidden shadow-sm">
      <CardContent className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Заголовок */}
        <div className="px-4 py-4 border-b bg-white/80 backdrop-blur-sm">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            Чаты
          </h1>
        </div>

        {/* Список чатов */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Пока нет чатов</h3>
              <p className="text-gray-500 text-sm">
                Начните общение с водителями или пассажирами
              </p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {chats.map((chat) => (
                <div
                  key={`${chat.trip_id}-${chat.chat_partner_id}`}
                  onClick={() => handleChatSelect(chat)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 cursor-pointer transition-colors group"
                >
                  <div className="relative">
                    <Avatar className="size-12 ring-2 ring-white shadow-sm">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {getInitials(chat.partner?.name)}
                      </AvatarFallback>
                    </Avatar>
                    {Number(chat.unread_count || 0) > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {chat.unread_count}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {chat.partner?.name || "Пользователь"}
                      </h3>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        {chat.last_message_at && (
                          <>
                            {new Date(chat.last_message_at).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit'
                            })}
                            {chat.last_message_is_read === true ? (
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            ) : (
                              <Check className="w-3 h-3 text-gray-400" />
                            )}
                          </>
                        )}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {chat.trip?.from_city} → {chat.trip?.to_city}
                    </p>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {Number(chat.trip?.price || 0).toLocaleString()} сум
                      </p>
                      <p className="text-xs text-gray-500">
                        {chat.trip?.date} • {chat.trip?.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default Chats;