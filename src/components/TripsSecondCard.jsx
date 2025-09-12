import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import {
  ArrowRight,
  Calendar,
  Car,
  Clock,
  MapPin,
  MoveRight,
  Route,
  Users,
} from "lucide-react";

function TripsSecondCard({ trip }) {
  return (
    <Card className="shadow-md rounded-2xl bg-green-300/5">
      <CardContent className="p-4 space-y-2 flex flex-col items-center gap-3">
        <div className="flex justify-between items-center w-full">
          {/* Driver */}
          <div className="flex items-center gap-1 text-sm">
            <Avatar className="size-13">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col ml-2">
              <span className="text-xl font-bold">{trip.driver}</span>
              <span>⭐ {trip.rating}</span>
            </div>
          </div>
          <p className="inline-block mt-2 text-md px-3 py-1 rounded-full bg-green-600 text-white">
            {trip.status}
          </p>
        </div>

        <div className="flex justify-between p-6 border-2 border-gray-400 bg-green-500/5 rounded-2xl text-green-700 w-full">
          <div className="flex gap-3 items-center">
            <Car /> <span className="font-bold text-xl">Toyota Camry</span>
            <span>Oq</span>
          </div>
          <span className="border-2 border-gray-400 px-2 rounded-md">
            01A123BC
          </span>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {/* From → To */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-bold flex items-center text-green-700">
              <MapPin className="text-green-700 mr-1" /> {trip.from}{" "}
              <ArrowRight size={17} /> {trip.to}
            </p>
          </div>

          {/* Date / Time / Seats / Price*/}
          <div className="grid grid-cols-2 items-center gap-4 text-md text-green-600">
            <span className="flex items-center gap-1">
              <Calendar size={16} className="text-gray-400" /> {trip.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} className="text-gray-400" /> {trip.time}
            </span>
            <span className="flex items-center gap-1">
              <Users size={16} className="text-gray-400" /> {trip.seats} мест
            </span>
            <p className="text-xl font-bold text-black">{trip.price}</p>
          </div>
        </div>
        <p className="rounded-2xl p-4 bg-white w-full">
          Komfort safar, konditsioner
        </p>
        <div className="w-full flex gap-3">
          <button className="bg-green-700 rounded-2xl text-white w-full">
            Bron qilish
          </button>
          <button className="w-full bg-white border-green-700 text-green-700  border-2 rounded-2xl">
            Narx taklif qilish
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default TripsSecondCard;
