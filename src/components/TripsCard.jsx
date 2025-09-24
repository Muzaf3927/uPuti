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
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function TripsCard({ trip }) {
  const [isOpen, setIsOpen] = useState(false);
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
      {isOpen ? (
    <Card
      className="shadow-md rounded-2xl bg-green-300/5"
      onClick={() => setIsOpen(false)}
    >
      <CardContent className="p-4 flex flex-col items-center gap-3">
        <div className="flex justify-between items-center w-full">
          {/* Driver */}
          <div className="flex items-center gap-1 text-sm">
            <Link to={`/user/${trip?.driver?.id}`}>
              <Avatar className="size-10 sm:size-13">
                <AvatarImage
                  src={
                    trip.driver.avatar
                      ? trip.driver.avatar
                      : "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col ml-2">
              <span className="text-md sm:text-xl  font-bold">
                {trip.driver.name}
              </span>
              <span>⭐ {trip.driver.rating}</span>
            </div>
          </div>
          <p className="inline-block mt-2 text-sm sm:text-md px-3 py-1 rounded-full bg-green-600 text-white">
            {trip.status}
          </p>
        </div>

        <div className="flex justify-between items-center p-3 sm:p-6 border-2 border-gray-400 bg-green-500/5 rounded-2xl text-green-700 w-full">
          <div className="flex gap-3 items-center">
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <Car className="size-8" />{" "}
              <span className="font-bold text-sm sm:text-xl">
                {trip.carModel}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-10">
            <span>{trip.carColor}</span>
            <span className="border-2 border-gray-400 px-2 rounded-md">
              {trip.numberCar ? trip.numberCar : "Bo'sh"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          {/* From → To */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm sm:text-lg font-bold flex items-center text-green-700">
              <MapPin className="text-green-700 mr-1" /> {trip.from_city}{" "}
              <ArrowRight size={17} /> {trip.to_city}
            </p>
          </div>

          {/* Date / Time / Seats / Price*/}
          <div className="grid grid-cols-2 items-center gap-4 text-sm sm:text-md text-green-600">
            <span className="flex items-center gap-1">
              <Calendar size={16} className="text-gray-400" /> {trip.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} className="text-gray-400" /> {trip.time}
            </span>
            <span className="flex items-center gap-1">
              <Users size={16} className="text-gray-400" /> {trip.seats}{" "}
              o'rindiq
            </span>
            <p className="text-xs md:text-xl font-bold text-black">
              {trip.price}
            </p>
          </div>
        </div>
        <p className="rounded-2xl text-sm p-2 sm:p-4 bg-white w-full">
          {trip.note}
        </p>
        <div className="w-full flex gap-3">
          {trip?.my_booking ? (
            <button
              onClick={handleCancelBooking}
              disabled={trip?.my_booking?.can_cancel === false}
              className="bg-red-600 disabled:bg-gray-300 disabled:text-gray-500 h-10 text-sm rounded-2xl text-white w-full"
            >
              Bekor qilish
            </button>
          ) : (
            <>
              <button
                onClick={openBookingDialog}
                className="bg-green-700 h-10 text-sm  rounded-2xl text-white w-full"
              >
                Bron qilish
              </button>
              <button
                onClick={openOfferDialog}
                className="w-full bg-white h-10 text-sm  border-green-700 text-green-700  border-2 rounded-2xl"
              >
                Narx taklif qilish
              </button>
            </>
          )}
        </div>
      </CardContent>
        </Card>
      ) : (
        <Card
      className="shadow-md rounded-2xl px-2 "
      onClick={() => setIsOpen(true)}
    >
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

          {/* Driver */}
          <div className="flex items-center gap-1 text-sm">
            <Link to={`/user/${trip?.driver?.id}`}>
              <Avatar>
                <AvatarImage
                  src={
                    trip.driver.avatar
                      ? trip.driver.avatar
                      : "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <span>{trip.driver.name}</span>
            <span>⭐ {trip.driver.rating}</span>
          </div>
        </div>

        <div className="text-right flex items-center gap-3 sm:flex-col  ss:relative">
          <p className="sm:text-md md:text-3xl font-bold">{trip.price}</p>
          {trip?.my_booking ? (
            <button
              onClick={handleCancelBooking}
              disabled={trip?.my_booking?.can_cancel === false}
              className="text-xs px-3 py-1 rounded-full bg-red-600 text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              Bekor qilish
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openBookingDialog}
                className="text-xs px-3 py-1 rounded-full bg-green-600 text-white"
              >
                Bron qilish
              </button>
              <button
                onClick={openOfferDialog}
                className="text-xs px-3 py-1 rounded-full border-2 border-green-700 text-green-700 bg-white"
              >
                Narx taklif qilish
              </button>
            </div>
          )}
          {/* Status */}
          <span className="inline-block sm:mt-2 text-xs px-3 py-1 rounded-full bg-green-600 text-white">
            {trip.status}
          </span>
        </div>
      </CardContent>
        </Card>
      )}

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

