import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetData, getData, postData } from "@/api/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

import { History as HistoryIcon, Star } from "lucide-react";
import { useI18n } from "@/app/i18n.jsx";

function History() {
  const { t } = useI18n();
  const { data: asDriverRes, isPending: asDriverLoading, error: asDriverError } = useGetData("/trips/completed/mine");
  const { data: asPassengerRes, isPending: asPassengerLoading, error: asPassengerError } = useGetData("/trips/completed/as-passenger");

  const asDriver = asDriverRes?.trips || [];
  const asPassenger = asPassengerRes?.trips || [];

  const [driverTotals, setDriverTotals] = useState({ total: 0, byTrip: {} });
  const [rateOpen, setRateOpen] = useState(false);
  const [rateTarget, setRateTarget] = useState({ tripId: null, toUserId: null, toName: "" });
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    let isCancelled = false;
    async function calcTotals() {
      if (!asDriver || asDriver.length === 0) {
        if (!isCancelled) setDriverTotals({ total: 0, byTrip: {} });
        return;
      }
      try {
        let grand = 0;
        const byTripLocal = {};
        for (const t of asDriver) {
          // получаем брони для каждой поездки
          const res = await getData(`/trips/${t.id}/bookings`);
          const bookings = res?.bookings || [];
          const confirmed = bookings.filter((b) => b.status === "confirmed");
          const tripSum = confirmed.reduce((sum, b) => {
            // если есть offered_price, считаем его как итог за бронирование, иначе считаем цена*места
            const add = b.offered_price ? Number(b.offered_price) : Number(t.price) * Number(b.seats || 1);
            return sum + (isNaN(add) ? 0 : add);
          }, 0);
          byTripLocal[t.id] = tripSum;
          grand += tripSum;
        }
        if (!isCancelled) setDriverTotals({ total: grand, byTrip: byTripLocal });
      } catch (_e) {
        if (!isCancelled) setDriverTotals({ total: 0, byTrip: {} });
      }
    }
    calcTotals();
    return () => { isCancelled = true; };
  }, [asDriver]);

  const Empty = () => (
    <Card className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 py-20 rounded-3xl shadow-sm">
      <div className="rounded-full bg-gray-500/6 w-20 h-20 flex items-center justify-center">
        <HistoryIcon />
      </div>
      <h2>{t("history.empty")}</h2>
    </Card>
  );

  const currency = (n) => `${Number(n || 0).toLocaleString("ru-RU")} сум`;

  const TripItem = ({ t, showEarn = false, role = "driver" }) => (
    <div className="border rounded-2xl p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar className="size-8 ring-2 ring-white shadow">
          <AvatarImage src={t?.driver?.avatar || "https://github.com/shadcn.png"} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm">
          <span className="font-semibold">{t.from_city} → {t.to_city}</span>
          <span className="text-gray-600">{t.date} • {t.time}</span>
          {role === "driver" && Array.isArray(t.participants) && t.participants.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {t.participants.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 border rounded-full px-2 py-1">
                  <span className="text-xs">{p.user?.name}</span>
                  {p.can_rate ? (
                    <button
                      onClick={() => {
                        setRateTarget({ tripId: t.id, toUserId: p.user?.id, toName: p.user?.name || "" });
                        setRatingValue(5);
                        setRatingComment("");
                        setRateOpen(true);
                      }}
                      className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-white"
                      type="button"
                    >
                      Оценить
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-500">оценено</span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
          {role === "passenger" && t.can_rate ? (
            <div className="mt-2">
              <button
                onClick={() => {
                  setRateTarget({ tripId: t.id, toUserId: t.driver?.id, toName: t.driver?.name || "" });
                  setRatingValue(5);
                  setRatingComment("");
                  setRateOpen(true);
                }}
                className="text-xs px-3 py-1 rounded-full bg-amber-500 text-white"
                type="button"
              >
                Оценить водителя
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showEarn ? (
          <span className="text-xs bg-amber-100 text-amber-800 py-1 px-2 rounded-2xl border border-amber-200">
            Заработано: {currency(driverTotals.byTrip[t.id] || 0)}
          </span>
        ) : null}
        <span className="text-xs bg-green-700 text-white py-1 px-2 rounded-2xl">completed</span>
      </div>
    </div>
  );

  return (
    <Card>
      <CardContent className="py-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl">
        <Tabs defaultValue="asDriver">
          <TabsList className="w-full">
            <TabsTrigger value="asDriver">{t("history.driverTab")}</TabsTrigger>
            <TabsTrigger value="asPassenger">{t("history.passengerTab")}</TabsTrigger>
          </TabsList>
          <TabsContent value="asDriver">
            {asDriver && asDriver.length > 0 ? (
              <div className="mb-4 p-4 rounded-2xl border bg-white/80 backdrop-blur-sm text-green-800 shadow-sm">
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
              <div className="flex flex-col gap-3">
                {asDriver.map((t) => (
                  <TripItem key={t.id} t={t} showEarn role="driver" />
                ))}
              </div>
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
              <div className="flex flex-col gap-3">
                {asPassenger.map((t) => (
                  <TripItem key={t.id} t={t} role="passenger" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Rate Dialog */}
      <Dialog open={rateOpen} onOpenChange={setRateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оценка пользователю {rateTarget.toName}</DialogTitle>
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
              placeholder="Комментарий (необязательно)"
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
            />
            <div className="w-full flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-1/2 rounded-2xl">Отмена</Button>
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
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default History;
