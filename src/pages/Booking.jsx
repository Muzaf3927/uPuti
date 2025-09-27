import { ArrowRight, MapPin, MessageCircle, ChevronDown, ChevronUp, Phone } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

// shad ui
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

import { useParams } from "react-router-dom";

import { useGetData, useBookingsUnreadCount } from "@/api/api";
import { useI18n } from "@/app/i18n.jsx";


function Booking() {
  const { t } = useI18n();
  
  // API для моих подтвержденных броней (где я пассажир)
  const { data: myConfirmedBookingsRes, isPending: myConfirmedBookingsLoading, error: myConfirmedBookingsError } = useGetData("/bookings/my/confirmed");
  
  // API для подтвержденных броней на мои поездки (где я водитель)
  const { data: confirmedBookingsToMyTripsRes, isPending: confirmedBookingsToMyTripsLoading, error: confirmedBookingsToMyTripsError } = useGetData("/bookings/to-my-trips/confirmed");
  
  // Получаем количество непрочитанных сообщений
  const { data: unreadCounts } = useBookingsUnreadCount();

  const myConfirmedBookings = myConfirmedBookingsRes?.bookings || [];
  const confirmedBookingsToMyTrips = confirmedBookingsToMyTripsRes?.bookings || [];

  // Группируем брони по поездкам для второй вкладки
  const bookingsByTrip = React.useMemo(() => {
    const grouped = {};
    confirmedBookingsToMyTrips.forEach(booking => {
      const tripId = booking.trip.id;
      if (!grouped[tripId]) {
        grouped[tripId] = {
          trip: booking.trip,
          bookings: []
        };
      }
      grouped[tripId].bookings.push(booking);
    });
    return grouped;
  }, [confirmedBookingsToMyTrips]);

  return (
    <>
      <Tabs defaultValue="fromMe" className="">
        <TabsList className="px-1 sm:px-2 w-full mb-4 sm:mb-6">
          <TabsTrigger value="fromMe" className="relative text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-center">
            {t("booking.myBookings")}
            {unreadCounts?.my_confirmed_unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
                {unreadCounts.my_confirmed_unread > 9 ? '9+' : unreadCounts.my_confirmed_unread}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="toMe" className="relative text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-center">
            {t("booking.toMe")}
            {unreadCounts?.to_my_trips_confirmed_unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
                {unreadCounts.to_my_trips_confirmed_unread > 9 ? '9+' : unreadCounts.to_my_trips_confirmed_unread}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fromMe">
          <Card className="rounded-3xl shadow-sm">
            <CardContent className="flex flex-col gap-4 py-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl">
              {myConfirmedBookingsLoading ? (
                <div>Yuklanmoqda...</div>
              ) : myConfirmedBookingsError ? (
                <div className="text-red-600">Xatolik: {myConfirmedBookingsError.message}</div>
              ) : myConfirmedBookings.length === 0 ? (
                <div>Hali tasdiqlangan bronlaringiz yo'q.</div>
              ) : (
                myConfirmedBookings.map((b) => (
                  <div key={b.id} className="bg-white/80 backdrop-blur-sm border border-green-100 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8 sm:size-10">
                          <AvatarFallback>{getInitials(b.trip?.driver?.name)}</AvatarFallback>
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
                        Подтверждено
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
              {confirmedBookingsToMyTripsLoading ? (
                <div>Yuklanmoqda...</div>
              ) : confirmedBookingsToMyTripsError ? (
                <div className="text-red-600">Xatolik: {confirmedBookingsToMyTripsError.message}</div>
              ) : Object.keys(bookingsByTrip).length === 0 ? (
                <div>Hali sizning safarlaringizga tasdiqlangan bronlar yo'q.</div>
              ) : (
                Object.values(bookingsByTrip).map(({ trip, bookings }) => (
                  <div key={trip.id} className="border rounded-2xl p-4 bg-white/80 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-green-700">
                        {trip.from_city} <ArrowRight size={14} className="inline" /> {trip.to_city}
                        <span className="ml-2 text-gray-600">{trip.date} • {trip.time}</span>
                      </div>
                    </div>
                    
                    {/* Показываем брони для этой поездки */}
                    <div className="flex flex-col gap-2 mt-3">
                      {bookings.map((b) => (
                        <div key={b.id} className="bg-white/90 border border-green-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <Avatar className="size-10 sm:size-12 flex-shrink-0">
                                <AvatarFallback className="text-sm font-semibold">{getInitials(b.user?.name)}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col gap-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{b.user?.name || "Foydalanuvchi"}</span>
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Подтверждено</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                  <span>{b.seats} мест</span>
                                  {b.offered_price ? (
                                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                      Предложение: {b.offered_price} сум
                                    </span>
                                  ) : (
                                    <span>Цена: {trip.price} сум</span>
                                  )}
                                </div>
                                {b.user?.phone && (
                                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                                    <Phone size={12} />
                                    <span>+998{b.user.phone}</span>
                                  </div>
                                )}
                                {b.comment && (
                                  <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2 mt-1">
                                    "{b.comment}"
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 flex-shrink-0">
                              <Link
                                to={`/chats?tripId=${trip.id}&receiverId=${b.user?.id}`}
                                className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                              >
                                <MessageCircle size={14} />
                                <span className="hidden sm:inline">Написать</span>
                              </Link>
                              {b.user?.phone && (
                                <a
                                  href={`tel:+998${b.user.phone}`}
                                  className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                                >
                                  <Phone size={14} />
                                  <span className="hidden sm:inline">Позвонить</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
