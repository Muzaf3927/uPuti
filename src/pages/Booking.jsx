import { ArrowRight, MapPin, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

// shad ui
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { useParams } from "react-router-dom";

import { useGetData } from "@/api/api";
import { useI18n } from "@/app/i18n";

function TripBookingsList({ tripId }) {
  const { t } = useI18n();
  const { data, isLoading, error } = useGetData(`/trips/${tripId}/bookings`);
  if (isLoading) return <div className="text-sm">{t("booking.loading")}</div>;
  if (error) return <div className="text-sm text-red-600">Xatolik: {error.message}</div>;
  const bookings = data?.bookings || [];
  if (bookings.length === 0) return <div className="text-sm">{t("booking.none")}</div>;
  return (
    <div className="flex flex-col gap-3 mt-3">
      {bookings.map((b) => (
        <div key={b.id} className="border rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={b.user?.avatar || "https://github.com/shadcn.png"} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="font-semibold">{b.user?.name || "Foydalanuvchi"}</span>
              <span>{b.seats} ta o'rin • {b.status}</span>
              {b.offered_price ? <span>Taklif: {b.offered_price} so'm</span> : null}
              {b.comment ? <span className="text-gray-600">{b.comment}</span> : null}
            </div>
          </div>
          <Link
            to={`/chats?tripId=${tripId}&receiverId=${b.user?.id}`}
            className="inline-flex items-center gap-2 text-green-700 border-2 border-green-700 px-3 py-1 rounded-2xl hover:bg-green-700 hover:text-white transition"
          >
            <MessageCircle size={16} /> {t("booking.writePassenger")}
          </Link>
        </div>
      ))}
    </div>
  );
}

function Booking() {
  const { data: myBookingsRes, isPending: myBookingsLoading, error: myBookingsError } = useGetData("/bookings");
  const { data: myTripsRes, isPending: myTripsLoading, error: myTripsError } = useGetData("/my-trips");

  const myBookings = myBookingsRes?.bookings || [];
  const myTrips = myTripsRes?.trips || [];

  const [expandedTripIds, setExpandedTripIds] = useState([]);
  const toggleTrip = (id) => {
    setExpandedTripIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <>
      <Tabs defaultValue="fromMe" className="">
        <TabsList className="w-full rounded-2xl bg-white/70 backdrop-blur-sm">
          <TabsTrigger value="fromMe">Mening bronlarim</TabsTrigger>
          <TabsTrigger value="toMe">Mening safarımga bronlar</TabsTrigger>
        </TabsList>
        <TabsContent value="fromMe">
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="flex flex-col gap-4 py-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl">
              {myBookingsLoading ? (
                <div>Yuklanmoqda...</div>
              ) : myBookingsError ? (
                <div className="text-red-600">Xatolik: {myBookingsError.message}</div>
              ) : myBookings.length === 0 ? (
                <div>Hali bronlaringiz yo'q.</div>
              ) : (
                myBookings.map((b) => (
                  <div key={b.id} className="bg-white/80 backdrop-blur-sm border border-green-100 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8 sm:size-10">
                          <AvatarImage src={b.trip?.driver?.avatar || "https://github.com/shadcn.png"} />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div className="text-sm sm:text-base">
                          <h2 className="font-bold text-green-700">
                            {b.trip?.from_city} <ArrowRight size={14} className="inline" /> {b.trip?.to_city}
                          </h2>
                          <div className="text-gray-700">
                            {b.trip?.date} • {b.trip?.time}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm bg-green-700 text-white py-1 px-2 rounded-2xl">
                        {b.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span>{b.seats} ta o'rin</span>
                      {b.offered_price ? <span>Taklif: {b.offered_price} so'm</span> : <span>Narx: {b.trip?.price}</span>}
                    </div>
                    {b.comment ? <div className="text-sm text-gray-700 mt-1">{b.comment}</div> : null}
                    <Link
                      to={`/chats?tripId=${b.trip?.id}&receiverId=${b.trip?.driver?.id}`}
                      className="mt-3 inline-flex items-center justify-center gap-2 border-2 rounded-2xl py-1 px-3 border-green-700 text-green-700 hover:text-white hover:bg-green-700 transition-all duration-300 shadow"
                    >
                      <MessageCircle size={16} /> {t("booking.writeDriver")}
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="toMe">
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="flex flex-col gap-4 py-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl">
              {myTripsLoading ? (
                <div>Yuklanmoqda...</div>
              ) : myTripsError ? (
                <div className="text-red-600">Xatolik: {myTripsError.message}</div>
              ) : myTrips.length === 0 ? (
                <div>Hali siz yaratgan safarlar yo'q.</div>
              ) : (
                myTrips.map((t) => (
                  <div key={t.id} className="border rounded-2xl p-4 bg-white/80 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-green-700">
                        {t.from_city} <ArrowRight size={14} className="inline" /> {t.to_city}
                        <span className="ml-2 text-gray-600">{t.date} • {t.time}</span>
                      </div>
                      <button
                        onClick={() => toggleTrip(t.id)}
                        className="text-sm border rounded-xl px-2 py-1 bg-white hover:bg-green-50"
                      >
                        {expandedTripIds.includes(t.id) ? (
                          <span className="inline-flex items-center gap-1">Yopish <ChevronUp size={14} /></span>
                        ) : (
                          <span className="inline-flex items-center gap-1">Ko'rish <ChevronDown size={14} /></span>
                        )}
                      </button>
                    </div>
                    {expandedTripIds.includes(t.id) && (
                      <TripBookingsList tripId={t.id} />
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default Booking;
