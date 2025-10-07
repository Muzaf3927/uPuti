import React, { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  ArrowRight,
  Calendar,
  Car,
  ChevronDown,
  Clock,
  MapPin,
  MoveRight,
  Route,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useDeleteData, usePostData, postData } from "@/api/api";
import { useI18n } from "@/app/i18n.jsx";
import { useKeyboardInsets } from "@/hooks/useKeyboardInsets.jsx";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function TripsCard({ trip }) {
  const { t } = useI18n();
  const { keyboardInset, viewportHeight } = useKeyboardInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [seats, setSeats] = useState("");
  const [offeredPrice, setOfferedPrice] = useState("");
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();
  const tripPostMutation = usePostData(`/trips/${trip?.id}/booking`);

  // По умолчанию карточки закрыты на всех устройствах
  React.useEffect(() => {
    setIsExpanded(false);
  }, []);


  const openBookingDialog = (e) => {
    e.stopPropagation();
    setSeats("");
    setBookingDialogOpen(true);
  };
  const openOfferDialog = (e) => {
    e.stopPropagation();
    setSeats("");
    setOfferedPrice("");
    setComment("");
    setOfferDialogOpen(true);
  };
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!seats || Number(seats) < 1 || Number(seats) > 4) {
      toast.error("Iltimos, 1-4 o'rin orasida kiriting");
      return;
    }
    setPendingRequest({ type: 'booking', data: { seats: Number(seats) } });
    setBookingDialogOpen(false);
    setConfirmationDialogOpen(true);
  };
  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (!seats || Number(seats) < 1 || Number(seats) > 4) {
      toast.error("Iltimos, 1-4 o'rin orasida kiriting");
      return;
    }
    const offeredDigits = String(offeredPrice).replace(/\s/g, "");
    if (!offeredDigits || Number(offeredDigits) < 0) {
      toast.error("Iltimos, taklif narxini kiriting");
      return;
    }
    setPendingRequest({ 
      type: 'offer', 
      data: {
        seats: Number(seats),
        offered_price: Number(offeredDigits),
        comment: comment || null,
      }
    });
    setOfferDialogOpen(false);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmRequest = async () => {
    if (!pendingRequest) return;
    
    try {
      await tripPostMutation.mutateAsync(pendingRequest.data);
      const successMessage = pendingRequest.type === 'booking' ? "Bron qilindi." : "Taklif yuborildi.";
      toast.success(successMessage);
      setConfirmationDialogOpen(false);
      setPendingRequest(null);
      queryClient.invalidateQueries({ queryKey: ["data", "/trips"] });
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "unread-count"] });
    } catch (err) {
      console.error(err);
      const errorMessage = pendingRequest.type === 'booking' ? "Bron qilishda xatolik yuz berdi." : "Taklif yuborishda xatolik yuz berdi.";
      toast.error(errorMessage);
    }
  };

  const handleCancelRequest = () => {
    setConfirmationDialogOpen(false);
    setPendingRequest(null);
  };

  const handleCancelBooking = async (e) => {
    e.stopPropagation();
    try {
      if (!trip?.my_booking?.id) return;
      await postData(`/bookings/${trip.my_booking.id}/cancel`);
      toast.success("So'rov bekor qilindi.");
      queryClient.invalidateQueries({ queryKey: ["data", "/trips"] });
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", "unread-count"] });
    } catch (err) {
      console.error(err);
      toast.error("Bekor qilishda xatolik yuz berdi.");
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
      <Card onClick={() => setIsExpanded((v) => !v)} className="shadow-sm rounded-3xl bg-white/80 backdrop-blur-sm cursor-pointer border-0 py-0">
        <CardContent className={`flex flex-col ${isExpanded ? 'p-3 sm:p-4 gap-2' : 'px-2 py-1 gap-1'}`}>
          <div className="flex items-center justify-between gap-2 text-green-700 font-bold text-sm sm:text-lg">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="text-green-600" />
              <span className="truncate max-w-[60vw] sm:max-w-none">{trip.from_city}</span>
              <Route className="text-green-600" />
              <span className="truncate max-w-[60vw] sm:max-w-none">{trip.to_city}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Price near route on desktop */}
              <span className="hidden sm:inline-block font-extrabold text-gray-900 whitespace-nowrap text-lg">
                {Number(trip.price).toLocaleString()} сум
              </span>
              {/* Expand indicator */}
              <ChevronDown 
                className={`text-gray-400 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`} 
                size={20}
              />
            </div>
          </div>

          {/* Компактный блок: только дата, время и цена (на мобиле цена справа ниже) */}
          <div className={`grid grid-cols-2 ${isExpanded ? 'sm:grid-cols-4 gap-2 sm:gap-3' : 'gap-1'} text-sm`}>
            <div className="flex items-center gap-1 text-gray-700">
              <Calendar size={16} className="text-green-600" /> {trip.date}
            </div>
            <div className="flex items-center gap-1 text-gray-700">
              <Clock size={16} className="text-green-600" /> {trip.time}
            </div>
            {isExpanded && (
              <>
                <div className="flex items-center gap-1 text-gray-700">
                  <Users size={16} /> {trip.seats} {t("tripsCard.seats")}
                </div>
                <div className="flex items-center gap-1 text-gray-700">
                  <Car size={16} className="text-green-600" /> {trip.carModel}
                </div>
              </>
            )}
            <div className="col-span-2 sm:col-span-2 flex items-center justify-between text-gray-700">
              {isExpanded ? (
                <span className="inline-flex items-center gap-1 border rounded-md px-2 py-0.5">{trip.numberCar || "Bo'sh"}</span>
              ) : (
                <span className="inline-flex items-center gap-1 sm:hidden text-gray-700">
                  <Car size={16} className="text-green-600" /> {trip.carModel || ""}
                </span>
              )}
              <div className="flex sm:hidden items-center gap-2">
                <span className="font-extrabold text-gray-900 whitespace-nowrap text-sm">{Number(trip.price).toLocaleString()} сум</span>
              </div>
              <span className="hidden sm:inline-block" />
            </div>
          </div>

          {isExpanded && (
            <>
              <div className="flex items-center gap-3">
                <Link to={`/user/${trip?.driver?.id}`} onClick={(e) => e.stopPropagation()}>
                  <Avatar className="size-9 ring-2 ring-white shadow">
                    <AvatarFallback>{getInitials(trip.driver?.name)}</AvatarFallback>
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
                      className="bg-green-700 h-9 rounded-2xl text-white w-full text-xs sm:text-base px-2 whitespace-normal leading-tight"
                    >
                      {t("tripsCard.book")}
                    </button>
                    <button
                      onClick={openOfferDialog}
                      className="w-full bg-white h-9 border-green-700 text-green-700 border-2 rounded-2xl text-xs sm:text-base px-2 whitespace-normal leading-tight"
                    >
                      {t("tripsCard.offer")}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()} style={{ maxHeight: viewportHeight ? Math.min(520, viewportHeight - 16) : undefined }}>
          <DialogHeader>
            <DialogTitle>{t("tripsCard.bookingTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitBooking} className="flex flex-col gap-3">
            <div className="grid w-full items-center gap-2 overflow-y-auto overflow-x-hidden touch-pan-y overscroll-contain pr-1" style={{ maxHeight: viewportHeight ? viewportHeight - 180 : undefined, paddingBottom: keyboardInset ? keyboardInset + 16 : undefined }}>
              <Label htmlFor="seats">{t("tripsCard.seatsLabel")}</Label>
              <Input
                id="seats"
                type="number"
                min={1}
                max={4}
                required
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                placeholder={t("tripsCard.seatsPlaceholder")}
              />
              <div className="w-full flex gap-2 mt-2">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className="w-1/2 rounded-2xl">
                    {t("tripsCard.cancelButton")}
                  </Button>
                </DialogClose>
                <Button type="submit" className="w-1/2 bg-green-600 rounded-2xl">
                  {t("tripsCard.submitBooking")}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Offer Dialog */}
      <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()} style={{ maxHeight: viewportHeight ? Math.min(560, viewportHeight - 16) : undefined }}>
          <DialogHeader>
            <DialogTitle>{t("tripsCard.offerTitle")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitOffer} className="flex flex-col gap-3">
            <div className="grid w/full items-center gap-2 overflow-y-auto overflow-x-hidden touch-pan-y overscroll-contain pr-1" style={{ maxHeight: viewportHeight ? viewportHeight - 220 : undefined, paddingBottom: keyboardInset ? keyboardInset + 16 : undefined }}>
              <Label htmlFor="offer-seats">{t("tripsCard.seatsLabel")}</Label>
              <Input
                id="offer-seats"
                type="number"
                min={1}
                max={4}
                required
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                placeholder={t("tripsCard.seatsPlaceholder")}
              />
              <div className="grid w-full items-center gap-2 mt-2">
                <Label htmlFor="price">{t("tripsCard.priceLabel")}</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="text"
                    inputMode="numeric"
                    value={offeredPrice}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                      setOfferedPrice(formatted);
                    }}
                    placeholder="100 000"
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">сум</span>
                </div>
              </div>
              <div className="grid w-full items-center gap-2 mt-2">
                <Label htmlFor="comment">{t("tripsCard.commentLabel")}</Label>
                <Input
                  id="comment"
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("tripsCard.commentPlaceholder")}
                />
              </div>
              <div className="w-full flex gap-2 mt-2">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className="w-1/2 rounded-2xl">
                    {t("tripsCard.cancelButton")}
                  </Button>
                </DialogClose>
                <Button type="submit" className="w-1/2 bg-green-600 rounded-2xl">
                  {t("tripsCard.submitOffer")}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen}>
        <DialogContent className="max-w-[400px] p-6">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 mb-2">
              {t("trips.confirmation.title")}
            </DialogTitle>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t("trips.confirmation.message")}
            </p>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleCancelRequest}
              variant="outline"
              className="flex-1 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {t("trips.confirmation.cancel")}
            </Button>
            <Button
              onClick={handleConfirmRequest}
              className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl text-white font-medium"
            >
              {t("trips.confirmation.continue")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TripsCard;

// Booking and Offer Dialogs
// Rendered outside return to keep file simple
// We place them after default export so they render along with the card

