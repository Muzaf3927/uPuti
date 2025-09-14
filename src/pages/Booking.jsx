import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Booking() {
  return (
    <>
      <Card>
        <CardContent className="flex flex-col gap-5 py-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Avatar className="size-8 sm:size-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="text-sm sm:text-2xl">
                <h2 className="font-bold text-green-700">Sergey Volkov</h2>
                <span>⭐ 4.6</span>
              </div>
            </div>
            <span className="text-sm sm:text-md bg-green-700 text-white py-1 px-2 rounded-2xl">
              Tasdiqlangan
            </span>
          </div>
          <div className="bg-green-500/5 border border-green-100 p-5 rounded-2xl">
            <h2 className="flex items-center font-bold text-green-700">
              <MapPin className="mr-2" />
              Toshkent
              <ArrowRight size={17} />
              Farg'ona
            </h2>
            <div className="flex flex-col sm:flex-row justify-between mt-2">
              <p>20 yanvar 8:00 da</p>
              <h2 className="font-bold">45 000 so'm</h2>
            </div>
          </div>
          <Link
            to="/chats"
            className="flex items-center justify-center gap-4 border-2 rounded-2xl py-1 border-green-700 text-green-700 hover:text-white hover:bg-green-700 transition-all duration-300"
          >
            <MessageCircle /> Haydovchiga yozish
          </Link>
        </CardContent>
      </Card>
    </>
  );
}

export default Booking;
