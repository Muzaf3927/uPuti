import React, { useState } from "react";

// components
import TripsCard from "@/components/TripsCard";

// icons
import { Car, MapPin, Route } from "lucide-react";

// shad cn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// input mask
import { InputMask } from "@react-input/mask";
import { Textarea } from "@/components/ui/textarea";

import { useGetData } from "@/api/api";

function Trips() {
  const [dialog, setDialog] = useState(false);
  const trips = [
    {
      id: 1,
      from: "Ташкент",
      to: "Самарканд",
      date: "15 января",
      time: "09:00",
      seats: 3,
      price: "50 000 сум",
      status: "Активная",
      driver: "Алексей Петров",
      rating: 4.8,
    },
    {
      id: 2,
      from: "Бухара",
      to: "Ташкент",
      date: "16 января",
      time: "14:30",
      seats: 2,
      price: "75 000 сум",
      status: "Активная",
      driver: "Мария Иванова",
      rating: 4.9,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const { data } = useGetData("/trip");

  console.log(data);

  return (
    <div className="">
      <div className="w-full flex text-green-600 gap-2.5 mb-5">
        <Dialog className="w-full" open={dialog} onOpenChange={setDialog}>
          <DialogTrigger className="w-full cursor-pointer">
            <div className="border-2 w-full py-2 sm:px-10 sm:py-4 bg-gray-500/6 rounded-3xl flex flex-col items-center">
              <Route className="md:size-6 size-4" />
              <h4 className="text-sm md:text-md">Safar yaratish</h4>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-green-600 font-bold">
                Safar yaratish
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 h-96 overflow-y-scroll"
            >
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="from">Qayerdan</Label>
                <Input type="text" id="from" placeholder="Qaysi shahardan" />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="to">Qayerga</Label>
                <Input type="text" id="to" placeholder="Qaysi shaharga" />
              </div>
              <div className="flex gap-2">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="date">Sana</Label>
                  <Input type="date" id="date" placeholder="06.09.2025" />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="time">Vaqt</Label>
                  <InputMask
                    mask="__:__"
                    replacement={{ _: /\d/ }}
                    type="text"
                    id="time"
                    placeholder="12 : 30"
                    className="font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="cost">Xizmat haqqi</Label>
                <Input type="number" id="cost" placeholder="50000" />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="comment">Qo'shimcha izoh</Label>
                <Textarea
                  className="pb-5"
                  id="comment"
                  placeholder="safarni tariflab bering."
                />
              </div>
              <div className="flex gap-2">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="car">Mashina rusumi</Label>
                  <Input type="text" id="car" placeholder="Toyota Camry" />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="car_color">Mashina rangi</Label>
                  <Input type="text" id="car_color" placeholder="Oq rang" />
                </div>
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="car_number">Mashina raqami</Label>
                <Input
                  type="text"
                  id="car_number"
                  placeholder="01A123BC"
                  className="uppercase"
                />
              </div>
              <div className="w-full flex gap-2 ">
                <DialogClose className="w-[48%]" asChild>
                  <Button className="rounded-2xl max-w-full ">
                    Bekor qilish
                  </Button>
                </DialogClose>
                <Button className="bg-green-600 rounded-2xl w-[48%]">
                  Yuborish
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog className="w-full">
          <DialogTrigger className="w-full cursor-pointer">
            <div className="border-2 w-full py-2 sm:px-10 sm:py-4 bg-gray-500/6 rounded-3xl flex flex-col items-center">
              <MapPin className="md:size-6 size-4" />
              <h4 className="text-sm md:text-md">Safar qidirish</h4>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-green-600 font-bold">
                Safar qidirish
              </DialogTitle>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="from">Qayerdan</Label>
                  <Input type="text" id="from" placeholder="Qaysi shahardan" />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="to">Qayerga</Label>
                  <Input type="text" id="to" placeholder="Qaysi shaharga" />
                </div>
                <div className="flex gap-2">
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor="date">Sana</Label>
                    <InputMask
                      mask="__.__.____"
                      replacement={{ _: /\d/ }}
                      // type="number"
                      id="date"
                      placeholder="06.09.2025"
                      className="font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor="time">Vaqt</Label>
                    <InputMask
                      mask="__:__"
                      replacement={{ _: /\d/ }}
                      type="text"
                      id="time"
                      placeholder="12 : 30"
                      className="font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                </div>
                <div className="w-full flex gap-2 ">
                  <DialogClose className="w-[48%]" asChild>
                    <Button className="rounded-2xl max-w-full ">
                      Bekor qilish
                    </Button>
                  </DialogClose>
                  <Button className="bg-green-600 rounded-2xl w-[48%]">
                    Qidirish
                  </Button>
                </div>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="px-0">
        <CardContent className="px-0">
          <Tabs defaultValue="allTrips" className="w-full">
            <TabsList className="px-2 w-full">
              <TabsTrigger value="allTrips">Barcha safarlar</TabsTrigger>
              <TabsTrigger value="myTrips">Mening safarlarim</TabsTrigger>
            </TabsList>
            <TabsContent value="allTrips">
              <div className="p-4 space-y-4">
                {trips.map((trip) => (
                  <TripsCard trip={trip} key={trip.id} />
                ))}
              </div>
            </TabsContent>
            <TabsContent
              value="myTrips"
              className="flex flex-col gap-2.5 items-center justify-center py-10"
            >
              <div className="mt-10 bg-gray-500/7 rounded-full w-20 h-20 flex items-center justify-center">
                <Car size={30} />
              </div>
              <h2>Hozirda hali sizda safarlar yo'q.</h2>
              <Button
                onClick={() => setDialog(true)}
                className="text-white bg-green-600 rounded-2xl cursor-pointer"
              >
                Safar yaratsih
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default Trips;
