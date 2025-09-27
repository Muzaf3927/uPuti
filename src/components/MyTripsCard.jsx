import React, { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ArrowRight,
  Calendar,
  Car,
  CircleCheck,
  Clock,
  Mail,
  MapPin,
  MoveRight,
  Pencil,
  Route,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "./ui/button";
import { useI18n } from "@/app/i18n.jsx";
import { useGetData } from "@/api/api";
import { usePostData, useDeleteData, postData } from "@/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function MyTripsCard({ trip }) {
  const { t } = useI18n();
  const [editOpen, setEditOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [form, setForm] = useState({
    from_city: trip.from_city || "",
    to_city: trip.to_city || "",
    date: trip.date || "",
    time: trip.time || "",
    seats: trip.seats || "",
    price: trip.price || "",
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
      await updateMutation.mutateAsync({
        from_city: form.from_city,
        to_city: form.to_city,
        date: form.date,
        time: form.time,
        seats: Number(form.seats),
        price: Number(form.price),
        note: form.note || null,
        carModel: form.carModel,
        carColor: form.carColor,
        numberCar: (form.numberCar || "").toUpperCase(),
      });
      toast.success("Safar yangilandi.");
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
      queryClient.invalidateQueries({ queryKey: ["data", "/trips"] });
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
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Safar o'chirildi.");
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
      queryClient.invalidateQueries({ queryKey: ["data", "/trips"] });
    } catch (err) {
      toast.error("O'chirishda xatolik.");
    }
  };

  const handleComplete = async () => {
    try {
      await postData(`/trips/${trip.id}/complete`, {});
      toast.success(t("myTripsCard.completeToast"));
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
      queryClient.invalidateQueries({ queryKey: ["data", "/trips"] });
    } catch (err) {
      toast.error(t("myTripsCard.completeError"));
    }
  };

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

  return (
    <Card className="shadow-sm rounded-3xl bg-white/80 backdrop-blur-sm border border-green-100 w-full">
      <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2 text-green-700 font-bold text-sm sm:text-lg">
            <MapPin className="text-green-600" />
            <span className="truncate max-w-[70vw] sm:max-w-none">{trip.from_city}</span>
            <Route className="text-green-600" />
            <span className="truncate max-w-[70vw] sm:max-w-none">{trip.to_city}</span>
          </div>
          <div className="text-base sm:text-2xl font-extrabold text-gray-900 whitespace-nowrap">
            {Number(trip.price).toLocaleString()} сум
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-700">
          <span className="flex items-center gap-1"><Calendar size={16} /> {trip.date}</span>
          <span className="flex items-center gap-1"><Clock size={16} /> {trip.time}</span>
          <span className="flex items-center gap-1"><Users size={16} /> {trip.seats} o'rindiq</span>
          <span className="flex items-center gap-1"><Car size={16} /> {trip.carModel}</span>
        </div>
      </CardContent>
      <CardFooter className="w-full">
        {/* Mobile layout ≤ 640px: grid 3 text buttons above, 2 icon buttons on right below */}
        <div className="w-full sm:hidden">
          <div className="grid grid-cols-2 gap-1 mb-2">
            <Button onClick={() => setRequestsOpen(true)} className="min-h-9 px-2 py-2 rounded-full bg-blue-600 text-white text-[10px] leading-tight flex items-center gap-1 justify-center whitespace-normal text-center">
              <Mail className="size-4" />
              <span>{t("myTripsCard.requests")}</span>
              {pendingRequests.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </Button>
            <Button onClick={() => setBookingsOpen(true)} className="min-h-9 px-2 py-2 rounded-full bg-emerald-600 text-white text-[10px] leading-tight flex items-center gap-1 justify-center whitespace-normal text-center">
              <CircleCheck className="size-4" />
              <span>{t("myTripsCard.bookings")}</span>
              {confirmedBookings.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {confirmedBookings.length}
                </span>
              )}
            </Button>
            <Button onClick={handleComplete} disabled={trip.status !== "active"} className="min-h-9 px-2 py-2 rounded-full bg-red-600 text-white text-[10px] leading-tight disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-1 justify-center whitespace-normal text-center col-span-2">
              <CircleCheck className="size-4" />
              <span>{t("myTripsCard.complete")}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button onClick={() => setEditOpen(true)} className="h-9 w-9 rounded-full bg-white border hover:bg-gray-50 flex items-center justify-center" aria-label={t("myTripsCard.edit")} title={t("myTripsCard.edit")}>
              <Pencil className="size-5 text-gray-700" />
            </Button>
            <Button onClick={handleDelete} className="h-9 w-9 rounded-full bg-white border border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center" aria-label={t("myTripsCard.delete")} title={t("myTripsCard.delete")}>
              <Trash2 className="size-5" />
            </Button>
          </div>
        </div>
        {/* Desktop ≥ 640px: previous inline layout */}
        <div className="w-full hidden sm:flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button onClick={() => setRequestsOpen(true)} className="h-10 px-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 text-sm sm:text-base relative">
              <Mail className="size-4" />
              <span className="text-sm">{t("myTripsCard.requests")}</span>
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </Button>
            <Button onClick={() => setBookingsOpen(true)} className="h-10 px-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 text-sm sm:text-base relative">
              <CircleCheck className="size-4" />
              <span className="text-sm">{t("myTripsCard.bookings")}</span>
              {confirmedBookings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {confirmedBookings.length}
                </span>
              )}
            </Button>
            <Button onClick={handleComplete} disabled={trip.status !== "active"} className="h-10 px-3 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2 text-sm sm:text-base">
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Safarni tahrirlash</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="flex flex-col gap-3">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="from_city">Qayerdan</Label>
              <Input id="from_city" name="from_city" value={form.from_city} onChange={handleChange} />
            </div>
            <div className="grid w/full items-center gap-2">
              <Label htmlFor="to_city">Qayerga</Label>
              <Input id="to_city" name="to_city" value={form.to_city} onChange={handleChange} />
            </div>
            <div className="flex gap-2">
              <div className="grid w/full items-center gap-2">
                <Label htmlFor="date">Sana</Label>
                <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
              </div>
              <div className="grid w/full items-center gap-2">
                <Label htmlFor="time">Vaqt</Label>
                <Input id="time" name="time" value={form.time} onChange={handleChange} />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="grid w/full items-center gap-2">
                <Label htmlFor="seats">O'rindiqlar</Label>
                <Input id="seats" name="seats" value={form.seats} onChange={handleChange} />
              </div>
              <div className="grid w/full items-center gap-2">
                <Label htmlFor="price">Narx</Label>
                <Input id="price" name="price" value={form.price} onChange={handleChange} />
              </div>
            </div>
            <div className="grid w/full items-center gap-2">
              <Label htmlFor="note">Izoh</Label>
              <Input id="note" name="note" value={form.note} onChange={handleChange} />
            </div>
            <div className="flex gap-2">
              <div className="grid w/full items-center gap-2">
                <Label htmlFor="carModel">Mashina</Label>
                <Input id="carModel" name="carModel" value={form.carModel} onChange={handleChange} />
              </div>
              <div className="grid w/full items-center gap-2">
                <Label htmlFor="carColor">Rangi</Label>
                <Input id="carColor" name="carColor" value={form.carColor} onChange={handleChange} />
              </div>
            </div>
            <div className="grid w/full items-center gap-2">
              <Label htmlFor="numberCar">Raqam</Label>
              <Input id="numberCar" name="numberCar" className="uppercase" value={form.numberCar} onChange={handleChange} />
            </div>
            <div className="w-full flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-1/2 rounded-2xl">Bekor qilish</Button>
              </DialogClose>
              <Button type="submit" className="w-1/2 bg-green-600 rounded-2xl">Saqlash</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Requests Dialog */}
      <Dialog open={requestsOpen} onOpenChange={setRequestsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>So'rovlar</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
            {tripBookingsLoading ? (
              <div>{t("myTripsCard.loading")}</div>
            ) : tripBookingsError ? (
              <div className="text-red-600">Xatolik: {tripBookingsError.message}</div>
            ) : pendingRequests.length === 0 ? (
              <div>{t("myTripsCard.noRequests")}</div>
            ) : (
              pendingRequests.map((b) => (
                <div key={b.id} className="border rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback>{getInitials(b.user?.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                      <span className="font-semibold">{b.user?.name || "Foydalanuvchi"}</span>
                      <span>{b.seats} ta o'rin • {b.status}</span>
                      {b.offered_price ? <span>Taklif: {b.offered_price} so'm</span> : null}
                      {b.comment ? <span className="text-gray-600">{b.comment}</span> : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleConfirm(b.id)} className="h-8 text-xs bg-green-600 text-white rounded-full px-3">{t("requests.accept")}</Button>
                    <Button onClick={() => handleDecline(b.id)} className="h-8 text-xs border border-amber-500 text-amber-600 bg-white rounded-full px-3">{t("requests.decline")}</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bookings Dialog */}
      <Dialog open={bookingsOpen} onOpenChange={setBookingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bronlar</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
            {tripBookingsLoading ? (
              <div>{t("myTripsCard.loading")}</div>
            ) : tripBookingsError ? (
              <div className="text-red-600">Xatolik: {tripBookingsError.message}</div>
            ) : confirmedBookings.length === 0 ? (
              <div>{t("myTripsCard.noBookings")}</div>
            ) : (
              confirmedBookings.map((b) => (
                <div key={b.id} className="border rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback>{getInitials(b.user?.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                      <span className="font-semibold">{b.user?.name || "Foydalanuvchi"}</span>
                      <span>{b.seats} ta o'rin • {b.status}</span>
                      {b.offered_price ? <span>Taklif: {b.offered_price} so'm</span> : null}
                      {b.comment ? <span className="text-gray-600">{b.comment}</span> : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default MyTripsCard;
