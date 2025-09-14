import React, { useState } from "react";

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

function TripsCard({ trip }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
  };

  return isOpen ? (
    <Card
      className="shadow-md rounded-2xl bg-green-300/5"
      onClick={() => setIsOpen(false)}
    >
      <CardContent className="p-4 flex flex-col items-center gap-3">
        <div className="flex justify-between items-center w-full">
          {/* Driver */}
          <div className="flex items-center gap-1 text-sm">
            <Avatar className="size-10 sm:size-13">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col ml-2">
              <span className="text-md sm:text-xl  font-bold">
                {trip.driver}
              </span>
              <span>⭐ {trip.rating}</span>
            </div>
          </div>
          <p className="inline-block mt-2 text-sm sm:text-md px-3 py-1 rounded-full bg-green-600 text-white">
            {trip.status}
          </p>
        </div>

        <div className="flex justify-between items-center p-3 sm:p-6 border-2 border-gray-400 bg-green-500/5 rounded-2xl text-green-700 w-full">
          <div className="flex gap-3 items-center">
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <Car className="size-8" />{" "}
              <span className="font-bold text-sm sm:text-xl">Toyota Camry</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-10">
            <span>Oq</span>
            <span className="border-2 border-gray-400 px-2 rounded-md">
              01A123BC
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {/* From → To */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm sm:text-lg font-bold flex items-center text-green-700">
              <MapPin className="text-green-700 mr-1" /> {trip.from}{" "}
              <ArrowRight size={17} /> {trip.to}
            </p>
          </div>

          {/* Date / Time / Seats / Price*/}
          <div className="grid grid-cols-2 items-center gap-4 text-sm sm:text-md text-green-600">
            <span className="flex items-center gap-1">
              <Calendar size={16} className="text-gray-400" /> {trip.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} className="text-gray-400" /> {trip.time}
            </span>
            <span className="flex items-center gap-1">
              <Users size={16} className="text-gray-400" /> {trip.seats} мест
            </span>
            <p className="text-xs md:text-xl font-bold text-black">
              {trip.price}
            </p>
          </div>
        </div>
        <p className="rounded-2xl text-sm p-2 sm:p-4 bg-white w-full">
          Komfort safar, konditsioner
        </p>
        <div className="w-full flex gap-3">
          <button
            onClick={handleClick}
            className="bg-green-700 h-10 text-sm  rounded-2xl text-white w-full"
          >
            Bron qilish
          </button>
          <button
            onClick={handleClick}
            className="w-full bg-white h-10 text-sm  border-green-700 text-green-700  border-2 rounded-2xl"
          >
            Narx taklif qilish
          </button>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card
      className="shadow-md rounded-2xl px-2 "
      onClick={() => setIsOpen(true)}
    >
      <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          {/* From → To */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-bold flex items-center">
              <MapPin className="text-green-400 mr-1" /> {trip.from}{" "}
              <ArrowRight size={17} /> {trip.to}
            </p>
          </div>

          {/* Date / Time / Seats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 ">
            <span className="flex items-center gap-1">
              <Calendar size={16} /> {trip.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} /> {trip.time}
            </span>
            <span className="flex items-center gap-1">
              <Users size={16} /> {trip.seats} мест
            </span>
          </div>

          {/* Driver */}
          <div className="flex items-center gap-1 text-sm">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span>{trip.driver}</span>
            <span>⭐ {trip.rating}</span>
          </div>
        </div>

        <div className="text-right  ss:relative">
          <p className="sm:text-md md:text-3xl font-bold">{trip.price}</p>
          {/* Status */}
          <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-green-600 text-white">
            {trip.status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default TripsCard;
