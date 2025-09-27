import React from "react";
// shad cn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Car,
  Check,
  Link,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useGetData, usePostData, postData, useBookingsUnreadCount } from "@/api/api";
import { useI18n } from "@/app/i18n.jsx";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

function Requests() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  
  // API для моих pending запросов (где я пассажир)
  const { data: mineRes, isPending: mineLoading, error: mineError, refetch: refetchMine } = useGetData(
    "/bookings/my/pending"
  );
  
  // API для pending запросов на мои поездки (где я водитель)
  const { data: toMeRes, isPending: toMeLoading, error: toMeError, refetch: refetchToMe } = useGetData(
    "/bookings/to-my-trips/pending"
  );
  
  // Получаем количество непрочитанных сообщений
  const { data: unreadCounts } = useBookingsUnreadCount();

  const handleConfirm = async (bookingId) => {
    try {
      await postData(`/bookings/${bookingId}`, { status: "confirmed" });
      toast.success("Tasdiqlandi.");
      refetchMine();
      refetchToMe();
      queryClient.invalidateQueries({ queryKey: ["bookings", "unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
    } catch (e) {
      console.error(e);
      toast.error("Tasdiqlashda xatolik.");
    }
  };

  const handleDecline = async (bookingId) => {
    try {
      await postData(`/bookings/${bookingId}`, { status: "declined" });
      toast.success("Bekor qilindi.");
      refetchMine();
      refetchToMe();
      queryClient.invalidateQueries({ queryKey: ["bookings", "unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
    } catch (e) {
      console.error(e);
      toast.error("Bekor qilishda xatolik.");
    }
  };

  const mine = mineRes?.bookings || [];
  const toMe = toMeRes?.bookings || [];

  return (
    <Tabs defaultValue="allTrips" className="w-full">
      <TabsList className="px-2 w-full  mb-6">
        <TabsTrigger value="allTrips" className="relative">
          {t("requests.mineTab")}
          {unreadCounts?.my_pending_unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCounts.my_pending_unread > 9 ? '9+' : unreadCounts.my_pending_unread}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="myTrips" className="relative">
          {t("requests.toMeTab")}
          {unreadCounts?.to_my_trips_pending_unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCounts.to_my_trips_pending_unread > 9 ? '9+' : unreadCounts.to_my_trips_pending_unread}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="allTrips">
        <Card className="bg-gray-500/5">
          <CardContent className="flex flex-col gap-5 sm:py-6">
            {mineLoading ? (
              <div>{t("requests.loading")}</div>
            ) : mineError ? (
              <div className="text-red-600">Xatolik: {mineError.message}</div>
            ) : mine.length === 0 ? (
              <div>{t("requests.emptyMine")}</div>
            ) : (
              mine.map((b) => (
                <div key={b.id} className="bg-green-500/5 border border-green-100 p-2 sm:p-5 rounded-2xl">
                  <h2 className="flex items-center font-bold text-green-700">
                    <MapPin className="mr-2" />
                    {b.trip?.from_city}
                    <ArrowRight size={17} />
                    {b.trip?.to_city}
                  </h2>
                  <div className="flex justify-between mt-2 text-sm">
                    <p>
                      {b.trip?.date} • {b.trip?.time}
                    </p>
                    <span className="bg-green-700 text-white py-1 px-2 rounded-2xl">{t("requests.pending")}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span>
                      {b.seats} {t("requests.seats")}
                    </span>
                    {b.offered_price ? (
                      <span>
                        {t("requests.offer")}: {b.offered_price} сум
                      </span>
                    ) : (
                      <span>
                        {t("requests.price")}: {b.trip?.price} сум
                      </span>
                    )}
                  </div>
                  {b.comment ? (
                    <div className="text-sm sm:text-md bg-white border border-green-100 p-3 sm:p-5 rounded-2xl mt-2">
                      {b.comment}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="myTrips">
        <Card className="bg-gray-500/5">
          <CardContent className="flex flex-col gap-5 sm:py-6">
            {toMeLoading ? (
              <div>{t("requests.loading")}</div>
            ) : toMeError ? (
              <div className="text-red-600">Xatolik: {toMeError.message}</div>
            ) : toMe.length === 0 ? (
              <div>{t("requests.emptyToMe")}</div>
            ) : (
              toMe.map((b) => (
                <div key={b.id} className="bg-green-500/5 border border-green-100 p-2 sm:p-5 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Avatar className="size-8 sm:size-10">
                        <AvatarFallback>{getInitials(b.user?.name)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm sm:text-2xl">
                        <h2 className="font-bold text-green-700">{b.user?.name || "Foydalanuvchi"}</h2>
                      </div>
                    </div>
                    <p className="bg-green-700 text-white py-1 px-2 rounded-2xl text-sm sm:text-md">{t("requests.pending")}</p>
                  </div>
                  <div className="bg-white/70 border border-green-100 p-2 sm:p-4 rounded-2xl mt-2">
                    <h3 className="flex items-center font-bold text-green-700 text-sm">
                      <MapPin className="mr-2" />
                      {b.trip?.from_city}
                      <ArrowRight size={17} />
                      {b.trip?.to_city}
                    </h3>
                    <div className="flex justify-between mt-2 text-sm">
                      <p>
                        {b.trip?.date} • {b.trip?.time}
                      </p>
                      {b.offered_price ? (
                        <span>
                          {t("requests.offer")}: {b.offered_price} сум
                        </span>
                      ) : (
                        <span>
                          {t("requests.price")}: {b.trip?.price} сум
                        </span>
                      )}
                    </div>
                    {b.comment ? (
                      <div className="text-sm text-gray-700 mt-1">{b.comment}</div>
                    ) : null}
                  </div>
                  <div className="w-full flex gap-3 mt-3">
                    <button
                      onClick={() => handleConfirm(b.id)}
                      className="w-full flex justify-center items-center gap-2 bg-green-700 text-white rounded-3xl py-2 px-3 text-sm sm:text-base hover:shadow-[0px_54px_55px_theme(colors.green.700/0.25),0px_-12px_30px_theme(colors.green.700/0.12),0px_4px_6px_theme(colors.green.700/0.12),0px_12px_13px_theme(colors.green.700/0.17),0px_-3px_5px_theme(colors.green.700/0.09)] transition-all duration-300 cursor-pointer"
                    >
                      <Check size={16} /> {t("requests.accept")}
                    </button>
                    <button
                      onClick={() => handleDecline(b.id)}
                      className="w-full flex justify-center items-center gap-2 border border-amber-500 text-amber-500 rounded-3xl py-2 px-3 text-sm sm:text-base hover:shadow-[0px_-12px_30px_theme(colors.amber.500/0.12),0px_4px_6px_theme(colors.amber.500/0.12),0px_12px_13px_theme(colors.amber.500/0.17),0px_-3px_5px_theme(colors.amber.500/0.09)] transition-all duration-300 cursor-pointer"
                    >
                      <X size={16} /> {t("requests.decline")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default Requests;
