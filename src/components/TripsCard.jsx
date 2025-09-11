import React from "react";

import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  MoveRight,
  Route,
  Users,
} from "lucide-react";

function TripsCard({ trip }) {
  return (
    <Card key={trip.id} className="shadow-md rounded-2xl">
      <CardContent className="p-4 space-y-2 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          {/* From → To */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-bold flex items-center">
              <MapPin className="text-green-400 mr-1" /> {trip.from}{" "}
              <ArrowRight size={17} /> {trip.to}
            </p>
          </div>

          {/* Date / Time / Seats */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
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

        <div className="text-right">
          <p className="text-3xl font-bold">{trip.price}</p>
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
