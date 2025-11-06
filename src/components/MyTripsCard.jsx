import React, { useState } from "react";
import { safeLocalStorage } from "@/lib/localStorage";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TimePicker from "@/components/ui/time-picker";
import { Textarea } from "@/components/ui/textarea";

import {
  ArrowRight,
  Calendar,
  Car,
  ChevronDown,
  CircleCheck,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  MoveRight,
  Pencil,
  Phone,
  Route,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { useI18n } from "@/app/i18n.jsx";
import { useGetData } from "@/api/api";
import { usePostData, useDeleteData, postData } from "@/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useKeyboardInsets } from "@/hooks/useKeyboardInsets.jsx";

function MyTripsCard({ trip }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { keyboardInset, viewportHeight } = useKeyboardInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  // Временно закомментирована функциональность оценки пассажиров
  // const [ratePassengersOpen, setRatePassengersOpen] = useState(false);
  // const [ratingValue, setRatingValue] = useState(5);
  // const [ratingComment, setRatingComment] = useState("");
  // const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [form, setForm] = useState({
    from_city: trip.from_city || "",
    to_city: trip.to_city || "",
    date: trip.date || "",
    time: trip.time || "",
    seats: trip.seats_total || "",
    price: trip.price ? Number(trip.price).toLocaleString() : "",
    note: trip.note || "",
    carModel: trip.carModel || "",
    carColor: trip.carColor || "",
    numberCar: trip.numberCar || "",
  });

  const queryClient = useQueryClient();
  const updateMutation = usePostData(`/trips/${trip.id}`);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Очищаем цену от пробелов перед отправкой
      const cleanPrice = form.price ? String(form.price).replace(/\s/g, "") : "";
      
      await updateMutation.mutateAsync({
        from_city: form.from_city,
        to_city: form.to_city,
        date: form.date,
        time: form.time,
        seats: Number(form.seats),
        price: cleanPrice ? Number(cleanPrice) : null,
        note: form.note || null,
        carModel: form.carModel,
        carColor: form.carColor,
        numberCar: (form.numberCar || "").toUpperCase(),
      });
      toast.success("Safar yangilandi.");
      setEditOpen(false);
      // Обновляем все возможные запросы поездок (включая с фильтрами)
      queryClient.invalidateQueries({ queryKey: ["data"] });
    } catch (err) {
      toast.error("Yangilashda xatolik.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      await postData(`/trips/${trip.id}/delete-proxy`, {});
    } catch (_e) {}
    try {
      // Основной DELETE
      const res = await fetch((import.meta.env.VITE_API_BASE || "https://blabla-main.laravel.cloud/api") + `/trips/${trip.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${safeLocalStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Safar o'chirildi.");
      // Обновляем все возможные запросы поездок (включая с фильтрами)
      queryClient.invalidateQueries({ queryKey: ["data"] });
    } catch (err) {
      toast.error("O'chirishda xatolik.");
    }
  };

  const handleComplete = async () => {
    try {
      console.log("Завершение поездки:", trip.id);
      await postData(`/trips/${trip.id}/complete`, {});
      toast.success(t("myTripsCard.completeToast"));
      // Обновляем все возможные запросы поездок (включая с фильтрами)
      queryClient.invalidateQueries({ queryKey: ["data"] });
      
      // Временно закомментирована функциональность оценки пассажиров
      // if (confirmedBookings.length > 0) {
      //   setRatePassengersOpen(true);
      // }
    } catch (err) {
      console.error("Ошибка при завершении поездки:", err);
      toast.error(t("myTripsCard.completeError"));
    }
  };

  // Временно закомментированы функции для оценки пассажиров
  // const handleRatePassenger = async () => {
  //   const currentPassenger = confirmedBookings[currentPassengerIndex];
  //   if (!currentPassenger) return;

  //   try {
  //     await postData(`/ratings/${trip.id}/to/${currentPassenger.user?.id}`, {
  //       rating: ratingValue,
  //       comment: ratingComment || null,
  //     });

  //     // Переходим к следующему пассажиру или закрываем диалог
  //     if (currentPassengerIndex < confirmedBookings.length - 1) {
  //       setCurrentPassengerIndex(currentPassengerIndex + 1);
  //       setRatingValue(5);
  //       setRatingComment("");
  //     } else {
  //       setRatePassengersOpen(false);
  //       setCurrentPassengerIndex(0);
  //       setRatingValue(5);
  //       setRatingComment("");
  //       toast.success(t("history.ratingSubmitted"));
  //     }
  //   } catch (err) {
  //     toast.error("Ошибка при отправке оценки");
  //   }
  // };

  // const handleSkipRating = () => {
  //   // Переходим к следующему пассажиру или закрываем диалог
  //   if (currentPassengerIndex < confirmedBookings.length - 1) {
  //     setCurrentPassengerIndex(currentPassengerIndex + 1);
  //     setRatingValue(5);
  //     setRatingComment("");
  //   } else {
  //     setRatePassengersOpen(false);
  //     setCurrentPassengerIndex(0);
  //     setRatingValue(5);
  //     setRatingComment("");
  //   }
  // };

  // Используем данные пассажиров из trip объекта (приходят с /my-trips API)
  const pendingRequests = trip.pending_passengers || [];
  const confirmedBookings = trip.confirmed_passengers || [];
  
  const tripBookingsLoading = false; // Данные уже загружены с trip
  const tripBookingsError = null;

  const handleConfirm = async (bookingId) => {
    try {
      await postData(`/bookings/${bookingId}`, { status: "confirmed" });
      toast.success(t("myTripsCard.acceptedToast"));
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "unread-count"] });
    } catch (e) {
      toast.error(t("requests.acceptError"));
    }
  };
  const handleDecline = async (bookingId) => {
    try {
      await postData(`/bookings/${bookingId}`, { status: "declined" });
      toast.success(t("myTripsCard.declinedToast"));
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "unread-count"] });
    } catch (e) {
      toast.error(t("requests.declineError"));
    }
  };

  // Функции для звонков и чата
  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    } else {
      toast.error("Telefon raqami mavjud emas");
    }
  };

  const handleChat = (passengerId, passengerName) => {
    // Закрываем диалог бронирований
    setBookingsOpen(false);
    // Переходим на страницу чатов с конкретным пассажиром
    // Используем receiverId вместо user, так как Chats.jsx ожидает receiverId
    navigate(`/chats?receiverId=${passengerId}&tripId=${trip.id}`);
  };

  // По умолчанию карточки закрыты на всех устройствах
  React.useEffect(() => {
    setIsExpanded(false);
  }, []);

  return (
    <Card
      onClick={() => setIsExpanded((v) => !v)}
      className="shadow-lg rounded-3xl bg-card/90 backdrop-blur-sm border w-full cursor-pointer py-0 ring-1 ring-blue-200/60 shadow-[0_10px_30px_rgba(59,130,246,0.15)] dark:bg-card/90"
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(79,70,229,0.12))",
      }}
    >
      <CardContent className={`flex flex-col ${isExpanded ? 'p-4 sm:p-5 gap-3 pb-0' : 'px-2 py-1 gap-1'}`}>
        <div className="flex items-center justify-between gap-2 text-primary font-bold text-sm sm:text-lg">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="text-primary" />
            <span className="truncate max-w-[70vw] sm:max-w-none">{trip.from_city}</span>
            <Route className="text-primary" />
            <span className="truncate max-w-[70vw] sm:max-w-none">{trip.to_city}</span>
          </div>
          {/* Expand indicator */}
          <ChevronDown 
            className={`text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`} 
            size={20}
          />
        </div>
        <div className={`grid grid-cols-2 ${isExpanded ? 'sm:grid-cols-4 gap-3' : 'gap-1'} text-sm text-gray-700`}>
          <span className="flex items-center gap-1"><Calendar size={16} className="text-primary" /> {trip.date}</span>
          <span className="flex items-center gap-1"><Clock size={16} className="text-primary" /> {trip.time}</span>
          {isExpanded && (
            <>
              <span className="flex items-center gap-1"><Users size={16} /> {trip.seats_total} {t("tripsCard.seats")}</span>
              <span className="flex items-center gap-1"><Car size={16} className="text-primary" /> {trip.carModel}</span>
            </>
          )}
        </div>
        {/* В компактном виде показываем модель авто справа от даты/времени на мобильном */}
        {!isExpanded && (
          <div className="flex items-center justify-between text-gray-700">
            <span className="inline-flex items-center gap-1 text-gray-700"><Car size={16} className="text-primary" /> {trip.carModel || ""}</span>
            <span className="font-extrabold text-gray-900 whitespace-nowrap text-sm">{Number(trip.price).toLocaleString()} сум</span>
          </div>
        )}
        
        {/* Отображение комментария при раскрытии */}
        {isExpanded && trip.note && (
          <div className="text-xs sm:text-sm text-gray-700 bg-white rounded-2xl p-3 border">
            {trip.note}
          </div>
        )}
      </CardContent>
      {isExpanded && (
      <CardFooter className="w-full pt-0" onClick={(e) => e.stopPropagation()}>
        {/* В развернутом виде добавим строку с номером авто */}
        <div className="w-full hidden sm:block">
          <span className="inline-flex items-center gap-1 border rounded-md px-2 py-0.5">{trip.numberCar || "Bo'sh"}</span>
        </div>
        {/* Mobile layout ≤ 640px: grid 3 text buttons above, 2 icon buttons on right below */}
        <div className="w-full sm:hidden">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 border rounded-md px-2 py-0.5">{trip.numberCar || "Bo'sh"}</span>
            <span className="font-extrabold text-gray-900 whitespace-nowrap text-sm">{Number(trip.price).toLocaleString()} сум</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <Button onClick={() => setRequestsOpen(true)} className="min-h-9 px-2 py-2 rounded-full bg-primary text-primary-foreground text-[10px] leading-tight flex items-center gap-1 justify-center whitespace-normal text-center">
              <Mail className="size-4" />
              <span>{t("myTripsCard.requests")}</span>
              {pendingRequests.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </Button>
            <Button onClick={() => setBookingsOpen(true)} className="min-h-9 px-2 py-2 rounded-full bg-secondary text-secondary-foreground text-[10px] leading-tight flex items-center gap-1 justify-center whitespace-normal text-center">
              <CircleCheck className="size-4" />
              <span>{t("myTripsCard.bookings")}</span>
              {confirmedBookings.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {confirmedBookings.length}
                </span>
              )}
            </Button>
            <Button onClick={handleComplete} className="min-h-9 px-2 py-2 rounded-full bg-destructive hover:brightness-110 text-white text-[10px] leading-tight flex items-center gap-1 justify-center whitespace-normal text-center col-span-2">
              <CircleCheck className="size-4" />
              <span>{t("myTripsCard.complete")}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button onClick={() => setEditOpen(true)} className="h-9 w-9 rounded-full bg-white border hover:bg-accent/40 flex items-center justify-center" aria-label={t("myTripsCard.edit")} title={t("myTripsCard.edit")}>
              <Pencil className="size-5 text-gray-700" />
            </Button>
            <Button onClick={handleDelete} className="h-9 w-9 rounded-full bg-white border border-destructive/40 text-destructive hover:bg-red-50 flex items-center justify-center" aria-label={t("myTripsCard.delete")} title={t("myTripsCard.delete")}>
              <Trash2 className="size-5" />
            </Button>
          </div>
        </div>
        {/* Desktop ≥ 640px: previous inline layout */}
        <div className="w-full hidden sm:flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Цена для больших экранов */}
            <span className="font-extrabold text-gray-900 whitespace-nowrap text-sm mr-4">
              {Number(trip.price).toLocaleString()} сум
            </span>
            <Button onClick={() => setRequestsOpen(true)} className="h-10 px-3 rounded-full bg-primary text-primary-foreground hover:brightness-110 flex items-center gap-2 text-sm sm:text-base relative">
              <Mail className="size-4" />
              <span className="text-sm">{t("myTripsCard.requests")}</span>
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </Button>
            <Button onClick={() => setBookingsOpen(true)} className="h-10 px-3 rounded-full bg-secondary text-secondary-foreground hover:brightness-110 flex items-center gap-2 text-sm sm:text-base relative">
              <CircleCheck className="size-4" />
              <span className="text-sm">{t("myTripsCard.bookings")}</span>
              {confirmedBookings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {confirmedBookings.length}
                </span>
              )}
            </Button>
            <Button onClick={handleComplete} className="h-10 px-3 rounded-full bg-destructive text-white hover:brightness-110 flex items-center gap-2 text-sm sm:text-base">
              <CircleCheck className="size-4" />
              <span className="text-sm">{t("myTripsCard.complete")}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setEditOpen(true)} className="h-10 w-10 rounded-full bg-white border hover:bg-gray-50 flex items-center justify-center" aria-label={t("myTripsCard.edit")} title={t("myTripsCard.edit")}>
              <Pencil className="size-5 text-gray-700" />
            </Button>
            <Button onClick={handleDelete} className="h-10 w-10 rounded-full bg-white border border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center" aria-label={t("myTripsCard.delete")} title={t("myTripsCard.delete")}>
              <Trash2 className="size-5" />
            </Button>
          </div>
        </div>
      </CardFooter>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-sm sm:max-w-md mx-2 sm:mx-4 overflow-hidden rounded-2xl ring-1 ring-blue-200/60 shadow-[0_10px_28px_rgba(59,130,246,0.18)] bg-card/90 backdrop-blur-sm overscroll-contain touch-pan-y" style={{ backgroundImage: "linear-gradient(135deg, rgba(59,130,246,0.20), rgba(79,70,229,0.14))", maxHeight: viewportHeight ? Math.min(760, viewportHeight - 8) : '80vh' }}>
          <DialogHeader>
            <DialogTitle>Safarni tahrirlash</DialogTitle>
            <DialogDescription className="sr-only">Trip edit dialog</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto pr-1" style={{ maxHeight: viewportHeight ? viewportHeight - 120 : '70vh', paddingBottom: keyboardInset ? keyboardInset : undefined }}>
          <form onSubmit={handleUpdate} className="flex flex-col gap-3">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="from_city">Qayerdan</Label>
              <Input id="from_city" name="from_city" value={form.from_city} onChange={handleChange} className="bg-white h-9" />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="to_city">Qayerga</Label>
              <Input id="to_city" name="to_city" value={form.to_city} onChange={handleChange} className="bg-white h-9" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="date">Sana</Label>
                <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} className="bg-white h-9" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="time">Vaqt</Label>
                <TimePicker id="time" value={form.time} onChange={(v) => setForm((prev) => ({ ...prev, time: v }))} className="w-full bg-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="seats">O'rindiqlar</Label>
                <Input id="seats" name="seats" value={form.seats} onChange={handleChange} className="bg-white h-9" />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="price">Narx</Label>
                <Input id="price" name="price" value={form.price}
                  onChange={(e) => {
                    const digits = String(e.target.value).replace(/\D/g, "");
                    const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    handleChange({ target: { name: 'price', value: formatted } });
                  }}
                  placeholder="100 000" className="pr-16 bg-white h-9" />
              </div>
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="note">Izoh</Label>
              <Input id="note" name="note" value={form.note} onChange={handleChange} className="bg-white h-9" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="carModel">Mashina</Label>
                <Input id="carModel" name="carModel" value={form.carModel} onChange={handleChange} className="bg-white h-9" />
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="carColor">Rangi</Label>
                <Input id="carColor" name="carColor" value={form.carColor} onChange={handleChange} className="bg-white h-9" />
              </div>
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="numberCar">Raqam</Label>
              <Input id="numberCar" name="numberCar" className="uppercase bg-white h-9" value={form.numberCar} onChange={handleChange} />
            </div>
            <div className="w-full flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-1/2 rounded-2xl">Bekor qilish</Button>
              </DialogClose>
              <Button type="submit" className="w-1/2 bg-primary text-primary-foreground rounded-2xl">Saqlash</Button>
            </div>
          </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Requests Dialog */}
      <Dialog open={requestsOpen} onOpenChange={setRequestsOpen}>
        <DialogContent className="max-w-sm sm:max-w-md mx-2 sm:mx-4 overflow-hidden rounded-2xl">
          <DialogHeader className="pb-2 relative">
            <DialogTitle className="text-base sm:text-lg">
              {t("myTripsCard.requests")} ({pendingRequests.length})
            </DialogTitle>
            <DialogDescription className="sr-only">Requests list dialog</DialogDescription>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-accent/50 rounded-full"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col gap-2 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
            {tripBookingsLoading ? (
              <div className="text-center py-3 text-sm">{t("myTripsCard.loading")}</div>
            ) : tripBookingsError ? (
              <div className="text-red-600 text-center py-3 text-sm">Xatolik: {tripBookingsError.message}</div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Users className="mx-auto mb-2 text-gray-400" size={24} />
                <p className="text-sm">{t("myTripsCard.noRequests")}</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="border border-blue-200 rounded-xl p-2.5 sm:p-3 shadow-[0_6px_18px_rgba(59,130,246,0.12)] ring-1 ring-blue-200/60 hover:shadow-[0_8px_22px_rgba(59,130,246,0.16)] transition-shadow"
                  style={{ backgroundImage: "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(79,70,229,0.1))" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8 sm:size-10 ring-1 ring-white shadow-sm">
                      <AvatarFallback className="font-semibold text-xs">
                        {getInitials(request.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      {/* Имя и статус */}
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {request.user?.name || "Foydalanuvchi"}
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                          {request.status}
                        </span>
                      </div>
                      
                      {/* Детали запроса */}
                      <div className="text-xs text-gray-600 mb-1.5">
                        <span className="font-medium">{request.seats} {t("tripsCard.seats")}</span>
                        {request.offered_price && (
                          <span className="ml-2 text-primary font-semibold">
                            {Number(request.offered_price).toLocaleString()} сум
                          </span>
                        )}
                      </div>
                      
                      {/* Комментарий */}
                      {request.comment && (
                        <div className="text-xs text-gray-500 mb-2 italic">
                          "{request.comment}"
                        </div>
                      )}
                      
                      {/* Кнопки действий */}
                      <div className="flex gap-1.5">
                        <Button
                          onClick={() => handleConfirm(request.id)}
                          className="flex items-center justify-center gap-1 bg-primary text-primary-foreground hover:brightness-110 text-xs px-2.5 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex-1"
                        >
                          <CircleCheck className="w-3.5 h-3.5" />
                          <span>{t("myTripsCard.accept")}</span>
                        </Button>
                        <Button
                          onClick={() => handleDecline(request.id)}
                          variant="outline"
                          className="flex items-center justify-center gap-1 border-red-600 text-red-600 hover:bg-red-50 text-xs px-2.5 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{t("myTripsCard.decline")}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bookings Dialog */}
      <Dialog open={bookingsOpen} onOpenChange={setBookingsOpen}>
        <DialogContent className="max-w-sm sm:max-w-md mx-2 sm:mx-4 overflow-hidden rounded-2xl">
          <DialogHeader className="pb-2 relative">
            <DialogTitle className="text-base sm:text-lg">
              {t("myTripsCard.bookings")} ({confirmedBookings.length})
            </DialogTitle>
            <DialogDescription className="sr-only">Bookings list dialog</DialogDescription>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-accent/50 rounded-full"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col gap-2 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
            {tripBookingsLoading ? (
              <div className="text-center py-3 text-sm">{t("myTripsCard.loading")}</div>
            ) : tripBookingsError ? (
              <div className="text-red-600 text-center py-3 text-sm">Xatolik: {tripBookingsError.message}</div>
            ) : confirmedBookings.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Users className="mx-auto mb-2 text-gray-400" size={24} />
                <p className="text-sm">{t("myTripsCard.noBookings")}</p>
              </div>
            ) : (
              confirmedBookings.map((passenger) => (
                <div
                  key={passenger.id}
                  className="border border-blue-200 rounded-xl p-2.5 sm:p-3 shadow-[0_6px_18px_rgba(59,130,246,0.12)] ring-1 ring-blue-200/60 hover:shadow-[0_8px_22px_rgba(59,130,246,0.16)] transition-shadow"
                  style={{ backgroundImage: "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(79,70,229,0.1))" }}
                >
                  <div className="flex items-start gap-2.5">
                    <Avatar className="size-8 sm:size-10 ring-1 ring-white shadow-sm mt-0.5">
                      <AvatarFallback className="font-semibold text-xs">
                        {getInitials(passenger.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      {/* Имя и рейтинг */}
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {passenger.name || "Foydalanuvchi"}
                        </h3>
                        {passenger.rating && (
                          <div className="flex items-center gap-0.5 bg-yellow-100 px-1.5 py-0.5 rounded-full">
                            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-yellow-700">{passenger.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Номер телефона и места */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <Phone className="w-2.5 h-2.5 text-primary" />
                        <span className="text-xs font-medium text-gray-700">{passenger.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Users className="w-2.5 h-2.5 text-blue-600" />
                        <span className="text-xs font-medium text-gray-700">{passenger.seats} {t("tripsCard.seats")}</span>
                      </div>
                      
                      {/* Кнопки действий */}
                      <div className="flex gap-2 -ml-8">
                        <Button
                          onClick={() => handleCall(passenger.phone)}
                          className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:brightness-110 text-xs px-2.5 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{t("myTripsCard.callPassenger")}</span>
                        </Button>
                        <Button
                          onClick={() => handleChat(passenger.id, passenger.name)}
                          variant="outline"
                          className="flex items-center justify-center gap-1.5 border-primary text-primary hover:bg-accent/50 text-xs px-2.5 py-1.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{t("myTripsCard.writePassenger")}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Временно закомментирован диалог для оценки пассажиров */}
      {/* <Dialog open={ratePassengersOpen} onOpenChange={setRatePassengersOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t("history.ratingTitle")} ({currentPassengerIndex + 1}/{confirmedBookings.length})
            </DialogTitle>
          </DialogHeader>
          
          {confirmedBookings[currentPassengerIndex] && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="size-10">
                  <AvatarFallback>
                    {getInitials(confirmedBookings[currentPassengerIndex].user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {confirmedBookings[currentPassengerIndex].user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {confirmedBookings[currentPassengerIndex].user?.phone}
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= ratingValue
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratingComment">
                  {t("history.ratingComment")}
                </Label>
                <Textarea
                  id="ratingComment"
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Оставьте комментарий (необязательно)"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSkipRating}
                  variant="outline"
                  className="flex-1"
                >
                  {currentPassengerIndex < confirmedBookings.length - 1 ? t("history.skip") : t("history.finish")}
                </Button>
                <Button
                  onClick={handleRatePassenger}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {currentPassengerIndex < confirmedBookings.length - 1 ? t("history.next") : t("history.finish")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </Card>
  );
}

export default MyTripsCard;
