import React, { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
import { Link } from "react-router-dom";

import { useDeleteData, usePostData, postData } from "@/api/api";
import { useI18n } from "@/app/i18n.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function TripsCard({ trip }) {
  const { t } = useI18n();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [seats, setSeats] = useState(1);
  const [offeredPrice, setOfferedPrice] = useState("");
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();
  const tripPostMutation = usePostData(`/trips/${trip?.id}/booking`);

  const openBookingDialog = (e) => {
    e.stopPropagation();
    setSeats(1);
    setBookingDialogOpen(true);
  };
  const openOfferDialog = (e) => {
    e.stopPropagation();
    setSeats(1);
    setOfferedPrice("");
    setComment("");
    setOfferDialogOpen(true);
  };
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    try {
      const body = { seats: Number(seats) };
      await tripPostMutation.mutateAsync(body);
      toast.success("Bron qilindi.");
      setBookingDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["data", "/trips"] });
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
    } catch (err) {
      toast.error("Bron qilishda xatolik yuz berdi.");
      console.error(err);
    }
  };
  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    try {
      const body = {
        seats: Number(seats),
        offered_price: offeredPrice ? Number(offeredPrice) : null,
        comment: comment || null,
      };
      await tripPostMutation.mutateAsync(body);
      toast.success("Taklif yuborildi.");
      setOfferDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["data", "/trips"] });
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
    } catch (err) {
      toast.error("Taklif yuborishda xatolik yuz berdi.");
      console.error(err);
    }
  };
  const handleCancelBooking = async (e) => {
    e.stopPropagation();
    try {
      if (!trip?.my_booking?.id) return;
      await postData(`/bookings/${trip.my_booking.id}/cancel`);
      toast.success("So'rov bekor qilindi.");
      queryClient.invalidateQueries({ queryKey: ["data", "/trips"] });
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
    } catch (err) {
      toast.error("Bekor qilishda xatolik yuz berdi.");
      console.error(err);
    }
  };
  const handleClickPrice = (e) => {
    e.stopPropagation();

    const result = {
      seats: 1,
      offered_price: 5000,
      comment: "boshqa pulim yuq",
    };
  };

  return (
    <>
      <Card className="shadow-sm rounded-3xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 text-green-700 font-bold text-sm sm:text-lg">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="text-green-600" />
              <span className="truncate max-w-[60vw] sm:max-w-none">{trip.from_city}</span>
              <Route className="text-green-600" />
              <span className="truncate max-w-[60vw] sm:max-w-none">{trip.to_city}</span>
            </div>
            {/* Price near route on desktop */}
            <span className="hidden sm:inline-block font-extrabold text-gray-900 whitespace-nowrap text-lg">
              {Number(trip.price).toLocaleString()} сум
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-sm">
            <div className="flex items-center gap-1 text-gray-700">
              <Calendar size={16} /> {trip.date}
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Clock size={16} /> {trip.time}
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Users size={16} /> {trip.seats} {t("tripsCard.seats")}
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Car size={16} /> {trip.carModel}
            </div>
            <div className="col-span-2 sm:col-span-2 flex items-center justify-between text-gray-700">
              {/* Desktop: only car number on the left */}
              <span className="hidden sm:inline-flex items-center gap-1 border rounded-md px-2 py-0.5">{trip.numberCar || "Bo'sh"}</span>
              {/* Mobile: number and price sit next to each other */}
              <div className="flex sm:hidden items-center gap-2">
                <span className="inline-flex items-center gap-1 border rounded-md px-2 py-0.5">{trip.numberCar || "Bo'sh"}</span>
                <span className="font-extrabold text-gray-900 whitespace-nowrap text-sm">{Number(trip.price).toLocaleString()} сум</span>
              </div>
              {/* Filler to keep structure consistent */}
              <span className="hidden sm:inline-block" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to={`/user/${trip?.driver?.id}`}>
              <Avatar className="size-9 ring-2 ring-white shadow">
                <AvatarImage src={trip.driver.avatar ? trip.driver.avatar : "https://github.com/shadcn.png"} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-800">
              <span className="font-medium truncate max-w-[150px] sm:max-w-[220px]">{trip.driver.name}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">⭐ {trip.driver.rating}</span>
            </div>
          </div>

          {trip.note ? (
            <div className="text-xs sm:text-sm text-gray-700 bg-white rounded-2xl p-3 border">
              {trip.note}
            </div>
          ) : null}

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {trip?.my_booking ? (
              <button
                onClick={handleCancelBooking}
                disabled={trip?.my_booking?.can_cancel === false}
                className="bg-red-600 disabled:bg-gray-300 disabled:text-gray-500 h-9 text-sm rounded-2xl text-white w-full"
              >
                {t("tripsCard.cancel")}
              </button>
            ) : (
              <>
                <button
                  onClick={openBookingDialog}
                  className="bg-green-700 h-9 rounded-2xl text-white w-full text-[10px] sm:text-sm px-2 whitespace-normal leading-tight"
                >
                  {t("tripsCard.book")}
                </button>
                <button
                  onClick={openOfferDialog}
                  className="w-full bg-white h-9 border-green-700 text-green-700 border-2 rounded-2xl text-[10px] sm:text-sm px-2 whitespace-normal leading-tight"
                >
                  {t("tripsCard.offer")}
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Necha o'rin band qilmoqchisiz?</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitBooking} className="flex flex-col gap-3">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="seats">O'rindiqlar soni</Label>
              <Input
                id="seats"
                type="number"
                min={1}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </div>
            <div className="w-full flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-1/2 rounded-2xl">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button type="submit" className="w-1/2 bg-green-600 rounded-2xl">
                Yuborish
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Offer Dialog */}
      <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Narx taklif qilish</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitOffer} className="flex flex-col gap-3">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="offer-seats">O'rindiqlar soni</Label>
              <Input
                id="offer-seats"
                type="number"
                min={1}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="price">Taklif narxi (so'm)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="comment">Izoh</Label>
              <Input
                id="comment"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Menda bundan ko'p pul yo'q"
              />
            </div>
            <div className="w-full flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-1/2 rounded-2xl">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button type="submit" className="w-1/2 bg-green-600 rounded-2xl">
                Yuborish
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TripsCard;

// Booking and Offer Dialogs
// Rendered outside return to keep file simple
// We place them after default export so they render along with the card

