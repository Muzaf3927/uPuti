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

function MyTripsCard({ trip }) {
  return (
    <Card className="shadow-md rounded-2xl px-2 ">
      <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          {/* From → To */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-bold flex items-center">
              <MapPin className="text-green-400 mr-1" /> {trip.from_city}{" "}
              <ArrowRight size={17} /> {trip.to_city}
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
              <Users size={16} /> {trip.seats} o'rindiq
            </span>
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

export default MyTripsCard;
