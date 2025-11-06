import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useGetData, getData, postData } from "@/api/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

import { History as HistoryIcon, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/app/i18n.jsx";
import EmptyState from "@/components/EmptyState.jsx";
import { useLocation } from "react-router-dom";

function History() {
  const { t } = useI18n();
  const location = useLocation();
  
  // Состояние пагинации
  const [driverPage, setDriverPage] = useState(1);
  const [passengerPage, setPassengerPage] = useState(1);
  const PER_PAGE = 5; // По 5 записей на страницу для истории
  
  const { data: asDriverRes, isPending: asDriverLoading, error: asDriverError, refetch: refetchAsDriver } = useGetData(`/trips/completed/mine?page=${driverPage}&per_page=${PER_PAGE}`);
  const { data: asPassengerRes, isPending: asPassengerLoading, error: asPassengerError, refetch: refetchAsPassenger } = useGetData(`/trips/completed/as-passenger?page=${passengerPage}&per_page=${PER_PAGE}`);

  const asDriver = asDriverRes?.data || [];
  const asPassenger = asPassengerRes?.data || [];

  // Временно закомментирована функциональность оценки
  // const [rateOpen, setRateOpen] = useState(false);
  // const [rateTarget, setRateTarget] = useState({ tripId: null, toUserId: null, toName: "" });
  // const [ratingValue, setRatingValue] = useState(5);
  // const [ratingComment, setRatingComment] = useState("");
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const queryClient = useQueryClient();

  // Автоматическое обновление данных при переходе на страницу
  useEffect(() => {
    if (location.pathname === "/history") {
      refetchAsDriver();
      refetchAsPassenger();
    }
  }, [location.pathname, refetchAsDriver, refetchAsPassenger]);

  // Обновление данных при изменении страниц
  useEffect(() => {
    refetchAsDriver();
  }, [driverPage, refetchAsDriver]);

  useEffect(() => {
    refetchAsPassenger();
  }, [passengerPage, refetchAsPassenger]);

  // Загружаем подтвержденные брони отдельно
  useEffect(() => {
    let isCancelled = false;
    async function loadBookings() {
      try {
        const confirmedBookingsRes = await getData("/bookings/to-my-trips/confirmed");
        if (!isCancelled) {
          setConfirmedBookings(confirmedBookingsRes?.bookings || []);
        }
      } catch (_e) {
        if (!isCancelled) {
          setConfirmedBookings([]);
        }
      }
    }
    loadBookings();
    return () => { isCancelled = true; };
  }, []);

  // Мемоизированный расчет доходов
  const driverTotals = useMemo(() => {
    if (!asDriver || asDriver.length === 0 || !confirmedBookings.length) {
      return { total: 0, byTrip: {} };
    }

    let grand = 0;
    const byTripLocal = {};
    
    // Группируем брони по поездкам
    const bookingsByTrip = {};
    confirmedBookings.forEach(booking => {
      const tripId = booking.trip.id;
      if (!bookingsByTrip[tripId]) {
        bookingsByTrip[tripId] = [];
      }
      bookingsByTrip[tripId].push(booking);
    });
    
    // Считаем суммы для каждой поездки
    for (const t of asDriver) {
      const tripBookings = bookingsByTrip[t.id] || [];
      const tripSum = tripBookings.reduce((sum, b) => {
        // если есть offered_price, считаем его как итог за бронирование, иначе считаем цена*места
        const add = b.offered_price ? Number(b.offered_price) : Number(t.price) * Number(b.seats || 1);
        return sum + (isNaN(add) ? 0 : add);
      }, 0);
      byTripLocal[t.id] = tripSum;
      grand += tripSum;
    }

    return { total: grand, byTrip: byTripLocal };
  }, [asDriver, confirmedBookings]);

  const Empty = () => (
    <EmptyState title={t("history.empty")} />
  );

  const currency = (n) => `${Number(n || 0).toLocaleString("ru-RU")} сум`;

  const TripItem = ({ t: trip, showEarn = false, role = "driver" }) => (
    <div
      className="border rounded-3xl p-3 sm:p-4 bg-card/90 backdrop-blur-sm shadow-[0_6px_18px_rgba(59,130,246,0.12)] ring-1 ring-blue-200/60"
      style={{ backgroundImage: "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(79,70,229,0.1))" }}
    >
      <div className="flex flex-col gap-2">
        {/* Route and Status Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-base min-w-0">
            <span className="truncate">{trip.from_city}</span>
            <span className="text-primary">→</span>
            <span className="truncate">{trip.to_city}</span>
          </div>
          <span className="text-xs bg-primary text-primary-foreground py-1 px-2 rounded-2xl whitespace-nowrap">{t("history.completed")}</span>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span>{trip.date}</span>
          <span>•</span>
          <span>{trip.time}</span>
        </div>

        {/* Driver Info - показываем разную информацию в зависимости от роли */}
        <div className="flex items-center gap-3">
          <Avatar className="size-8 ring-2 ring-white shadow">
            <AvatarFallback>
              {role === "driver" 
                ? getInitials("Вы") // Показываем "Вы" для водителя
                : getInitials(trip?.driver?.name)
              }
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 text-sm text-gray-800">
            {role === "driver" ? (
              <>
                <span className="font-medium truncate">{t("history.yourTrip")}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">💰 {currency(trip.price || 0)}</span>
              </>
            ) : (
              <>
                <span className="font-medium truncate">{trip.driver?.name}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">⭐ {trip.driver?.rating}</span>
              </>
            )}
          </div>
        </div>

        {/* Earnings or Rating Button */}
        <div className="flex items-center justify-between">
          {showEarn ? (
            <span className="text-xs bg-amber-100 text-amber-800 py-1 px-2 rounded-2xl border border-amber-200">
              {t("history.earned")}: {currency(driverTotals.byTrip[trip.id] || 0)}
            </span>
          ) : null}
          
          {/* Временно закомментирована функциональность оценки */}
          {/* {role === "driver" && Array.isArray(trip.participants) && trip.participants.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {trip.participants.map((p, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  {p.can_rate ? (
                    <button
                      onClick={() => {
                        setRateTarget({ tripId: trip.id, toUserId: p.user?.id, toName: p.user?.name || "" });
                        setRatingValue(5);
                        setRatingComment("");
                        setRateOpen(true);
                      }}
                      className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white"
                      type="button"
                    >
                      {t("history.rate")}
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-500">{t("history.rated")}</span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
          
          {role === "passenger" && trip.can_rate ? (
            <button
              onClick={() => {
                setRateTarget({ tripId: trip.id, toUserId: trip.driver?.id, toName: trip.driver?.name || "" });
                setRatingValue(5);
                setRatingComment("");
                setRateOpen(true);
              }}
              className="text-xs px-3 py-1 rounded-full bg-amber-500 text-white"
              type="button"
            >
              {t("history.rateDriver")}
            </button>
          ) : null} */}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="shadow-lg border">
      <CardContent className="py-6 rounded-3xl bg-card/90 backdrop-blur-sm">
        <Tabs defaultValue="asDriver" onValueChange={(value) => {
          // Сбрасываем страницы при переключении вкладок
          if (value === "asDriver") {
            setDriverPage(1);
          } else if (value === "asPassenger") {
            setPassengerPage(1);
          }
        }}>
          <TabsList className="px-1 sm:px-2 w-full mb-4 sm:mb-6">
            <TabsTrigger value="asDriver" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-center">{t("history.driverTab")}</TabsTrigger>
            <TabsTrigger value="asPassenger" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-center">{t("history.passengerTab")}</TabsTrigger>
          </TabsList>
          <TabsContent value="asDriver">
            {asDriver && asDriver.length > 0 ? (
              <div className="mb-4 p-4 rounded-2xl border bg-white/80 backdrop-blur-sm text-primary shadow-sm">
                <div className="text-sm">{t("history.totalEarn")}</div>
                <div className="text-2xl font-bold">{currency(driverTotals.total)}</div>
              </div>
            ) : null}
            {asDriverLoading ? (
              <div>Yuklanmoqda...</div>
            ) : asDriverError ? (
              <div className="text-red-600">Xatolik: {asDriverError.message}</div>
            ) : asDriver.length === 0 ? (
              <Empty />
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  {asDriver.map((trip) => (
                    <TripItem key={trip.id} t={trip} showEarn role="driver" />
                  ))}
                </div>
                {/* Пагинация для водителя */}
                <div className="flex items-center justify-center gap-3 px-4 py-2 mt-4">
                  <Button 
                    variant="outline" 
                    disabled={driverPage === 1} 
                    onClick={() => setDriverPage((p) => Math.max(1, p - 1))} 
                    aria-label="Prev page"
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">{driverPage}</span>
                  <Button
                    variant="outline"
                    disabled={Array.isArray(asDriver) && asDriver.length < PER_PAGE}
                    onClick={() => setDriverPage((p) => p + 1)}
                    aria-label="Next page"
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="asPassenger">
            {asPassengerLoading ? (
              <div>Yuklanmoqda...</div>
            ) : asPassengerError ? (
              <div className="text-red-600">Xatolik: {asPassengerError.message}</div>
            ) : asPassenger.length === 0 ? (
              <Empty />
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  {asPassenger.map((trip) => (
                    <TripItem key={trip.id} t={trip} role="passenger" />
                  ))}
                </div>
                {/* Пагинация для пассажира */}
                <div className="flex items-center justify-center gap-3 px-4 py-2 mt-4">
                  <Button 
                    variant="outline" 
                    disabled={passengerPage === 1} 
                    onClick={() => setPassengerPage((p) => Math.max(1, p - 1))} 
                    aria-label="Prev page"
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">{passengerPage}</span>
                  <Button
                    variant="outline"
                    disabled={Array.isArray(asPassenger) && asPassenger.length < PER_PAGE}
                    onClick={() => setPassengerPage((p) => p + 1)}
                    aria-label="Next page"
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Временно закомментирован диалог оценки */}
      {/* <Dialog open={rateOpen} onOpenChange={setRateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("history.ratingTitle")} {rateTarget.toName}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRatingValue(n)}
                  className="p-1"
                  type="button"
                  aria-label={`Rate ${n}`}
                >
                  <Star
                    className={`${ratingValue >= n ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm">{ratingValue} / 5</span>
            </div>
            <Input
              placeholder={t("history.ratingComment")}
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
            />
            <div className="w-full flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-1/2 rounded-2xl">{t("history.cancel")}</Button>
              </DialogClose>
              <Button
                className="w-1/2 bg-green-600 rounded-2xl"
                onClick={async () => {
                  if (!rateTarget.tripId || !rateTarget.toUserId) return;
                  try {
                    await postData(`/ratings/${rateTarget.tripId}/to/${rateTarget.toUserId}`, {
                      rating: ratingValue,
                      comment: ratingComment || null,
                    });
                    setRateOpen(false);
                    // обновим данные историй
                    queryClient.invalidateQueries({ queryKey: ["data", "/trips/completed/mine"] });
                    queryClient.invalidateQueries({ queryKey: ["data", "/trips/completed/as-passenger"] });
                  } catch (_e) {}
                }}
                type="button"
              >
                {t("history.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </Card>
  );
}

export default History;
