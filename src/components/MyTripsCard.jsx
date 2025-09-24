import React, { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { usePostData, useDeleteData, postData } from "@/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function MyTripsCard({ trip }) {
  const [editOpen, setEditOpen] = useState(false);
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
      toast.success("Safar yakunlandi.");
      queryClient.invalidateQueries({ queryKey: ["data", "/my-trips"] });
      queryClient.invalidateQueries({ queryKey: ["data", "/trips"] });
    } catch (err) {
      toast.error("Yakunlashda xatolik.");
    }
  };

  return (
    <Card className="shadow-md rounded-2xl px-2 ">
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
        </div>

        <div className="text-right flex items-center gap-3 mt-4 sm:flex-col ss:relative">
          <p className="sm:text-md md:text-3xl font-bold">{trip.price}</p>
          {/* Status */}
          <span className="inline-block sm:mt-2 text-xs px-3 py-1 rounded-full bg-green-600 text-white">
            {trip.status}
          </span>
        </div>
      </CardContent>
      <CardFooter className="w-full">
        <div className="flex gap-3 items-center justify-end w-full">
          <Button onClick={handleComplete} disabled={trip.status !== "active"}>
            <span className="hidden sm:block">Yakunlash</span>{" "}
            <CircleCheck />
          </Button>
          <Button onClick={handleDelete}>
            <span className="hidden sm:block">O'chirish</span>
            <Trash2 />
          </Button>
          <Button onClick={() => setEditOpen(true)}>
            <span className="hidden sm:block">Tahrirlash</span>
            <Pencil />
          </Button>
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
    </Card>
  );
}

export default MyTripsCard;
