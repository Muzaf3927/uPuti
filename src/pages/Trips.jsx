import React, { useEffect, useState } from "react";

// components
import TripsCard from "@/components/TripsCard";

// icons
import { Car, MapPin, Route, Search } from "lucide-react";

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

import { useGetData, usePostData } from "@/api/api";
import { useI18n } from "@/app/i18n.jsx";
import TripsCardSkeleton from "@/components/TripsCardSkeleton";
import { toast } from "sonner";
import MyTripsCard from "@/components/MyTripsCard";

function Trips() {
  const { t } = useI18n();
  const [dialog, setDialog] = useState(false);
  const [searchDialog, setSearchDialog] = useState(false);
  const [dialogBron, setDialogBron] = useState(false);
  const [dialogPrice, setDialogPrice] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
  });

  const [filteredUrl, setFilteredUrl] = useState("");

  const { data, isLoading, error, refetch } = useGetData(
    `/trips${
      searchFilters.from
        ? `?from_city=${searchFilters.from}&to_city=${searchFilters.to}`
        : ""
    }`
  );

  //

  // useEffect(() => {
  //   refetch();
  // }, [filteredUrl]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const from = formData.get("from");
    const to = formData.get("to");
    const date = formData.get("date");
    const time = formData.get("time");

    setSearchFilters({ from, to, date, time });

    // const params = new URLSearchParams();

    // if (from) params.set("from_city", from);
    // if (to) params.set("to_city", to);

    // const query = params.toString() ? `?${params.toString()}` : "";

    // setFilteredUrl(query);

    setSearchDialog(false);
  };

  const {
    data: myTrips,
    isLoading: myTripsLoading,
    error: myTripsError,
    refetch: myTripsRefetch,
  } = useGetData("/my-trips");

  const tripPostMutation = usePostData("/trip");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const from_city = formData.get("from");
    const to_city = formData.get("to");
    const date = formData.get("date");
    const time = formData.get("time");
    const price = formData.get("cost");
    const note = formData.get("note");
    const carModel = formData.get("carModel");
    const carColor = formData.get("carColor");
    const numberCar = formData.get("carNumber");
    const seats = formData.get("carSeats");

    const resultData = {
      from_city,
      to_city,
      date,
      time,
      seats,
      price,
      note,
      carModel,
      carColor,
      numberCar,
    };

    try {
      const res = await tripPostMutation.mutateAsync(resultData);
      if (res.message === "Trip created!") {
        toast.success("Safar yaratildi.");
      }
      setDialog(false);
      refetch();
      myTripsRefetch();
    } catch (err) {
      console.error(err);
    }
  };

  // if (isLoading) {
  //   return;
  // }

  return (
    <div>
      <div className="w-full flex text-green-600 gap-2.5 mb-5">
        <Dialog className="w-full" open={dialog} onOpenChange={setDialog}>
          <DialogTrigger className="w-full cursor-pointer">
            <div className="border-2 w-full py-2 sm:px-10 sm:py-4 bg-gray-500/6 rounded-3xl flex flex-col items-center">
              <Route className="md:size-6 size-4" />
              <h4 className="text-sm md:text-md">{t("trips.create")}</h4>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[760px] p-4 sm:p-6 max-h-[95vh]">
            <DialogHeader>
              <DialogTitle className="text-center text-green-600 font-bold">{t("trips.create")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 overflow-y-auto pr-1 max-h-[70vh]">
              <div className="col-span-1 sm:col-span-1 grid items-center gap-1.5">
                <Label htmlFor="from">Qayerdan</Label>
                <Input type="text" id="from" name="from" placeholder="Toshkent" />
              </div>
              <div className="col-span-1 sm:col-span-1 grid items-center gap-1.5">
                <Label htmlFor="to">Qayerga</Label>
                <Input type="text" id="to" name="to" placeholder="Buxoro" />
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="date">Sana</Label>
                <Input type="date" id="date" name="date" />
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="time">Vaqt</Label>
                <InputMask
                  mask="__:__"
                  replacement={{ _: /\d/ }}
                  type="text"
                  id="time"
                  name="time"
                  placeholder="12:30"
                  className="font-normal border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
                />
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="cost">Xizmat haqqi</Label>
                <Input type="number" id="cost" name="cost" placeholder="50000" />
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="carSeats">O'rindiqlar soni</Label>
                <Input type="number" id="carSeats" name="carSeats" placeholder="4" />
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="car">Mashina rusumi</Label>
                <Input type="text" id="car" name="carModel" placeholder="Toyota Camry" />
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="carColor">Mashina rangi</Label>
                <Input type="text" id="carColor" name="carColor" placeholder="Oq" />
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="carNumber">Mashina raqami</Label>
                <Input type="text" id="carNumber" name="carNumber" placeholder="01A123BC" className="uppercase" />
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="note">Izoh</Label>
                <Input type="text" id="note" name="note" placeholder="Qisqa izoh" />
              </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 w-full">
                <DialogClose asChild>
                  <Button type="button" className="rounded-2xl w-full h-10 text-sm">Bekor qilish</Button>
                </DialogClose>
                <Button className="bg-green-600 rounded-2xl w-full h-10 text-sm">Yuborish</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog
          className="w-full"
          open={searchDialog}
          onOpenChange={setSearchDialog}
        >
          <DialogTrigger className="w-full cursor-pointer">
            <div className="border-2 w-full py-2 sm:px-10 sm:py-4 bg-gray-500/6 rounded-3xl flex flex-col items-center">
              <Search className="md:size-6 size-4" />
              <h4 className="text-sm md:text-md">{t("trips.search")}</h4>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-green-600 font-bold">
                {t("trips.search")}
              </DialogTitle>
              <form onSubmit={handleSearch} className="flex flex-col gap-3">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="from">Qayerdan</Label>
                  <Input
                    type="text"
                    id="from"
                    name="from"
                    placeholder="Qaysi shahardan"
                  />
                </div>
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="to">Qayerga</Label>
                  <Input
                    type="text"
                    id="to"
                    name="to"
                    placeholder="Qaysi shaharga"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="grid w-full items-center gap-3">
                    <Label htmlFor="date">Sana</Label>
                    <InputMask
                      mask="__.__.____"
                      replacement={{ _: /\d/ }}
                      // type="number"
                      id="date"
                      name="date"
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
                      name="time"
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
      <Card className="px-0 rounded-3xl shadow-sm">
        <CardContent className="px-0 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl">
          <Tabs defaultValue="allTrips" className="w-full">
            <TabsList className="px-2 w-full rounded-2xl bg-white/70 backdrop-blur-sm">
              <TabsTrigger value="allTrips">{t("trips.all")}</TabsTrigger>
              <TabsTrigger value="myTrips">{t("trips.mine")}</TabsTrigger>
            </TabsList>
            <TabsContent value="allTrips">
              <div className="p-4 space-y-4">
                {isLoading
                  ? Array(4)
                      .fill(1)
                      .map((_, index) => <TripsCardSkeleton key={index} />)
                  : data.data
                      ?.filter((trip) => trip.status !== "completed")
                      .map((trip) => (
                        <TripsCard trip={trip} key={trip.id} />
                      ))}
              </div>
            </TabsContent>
            <TabsContent value="myTrips">
              {myTripsLoading ? (
                Array(2)
                  .fill(1)
                  .map((_, index) => <TripsCardSkeleton key={index} />)
              ) : myTrips && myTrips.trips.length === 0 ? (
                <>
                  <div className="mt-10 bg-white/80 backdrop-blur-sm shadow rounded-full w-20 h-20 flex items-center justify-center">
                    <Car size={30} />
                  </div>
                  <h2>{t("trips.empty")}</h2>
                  <Button
                    onClick={() => setDialog(true)}
                    className="text-white bg-green-600 rounded-2xl cursor-pointer shadow"
                  >
                    {t("trips.create")}
                  </Button>
                </>
              ) : (
                <div className="p-4 space-y-4">
                  {myTrips &&
                    myTrips.trips
                      .filter((item) => item.status !== "completed")
                      .map((item) => (
                        <MyTripsCard trip={item} key={item.id} />
                      ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default Trips;

// /trips/filter?from_city=Toshkent&to_city=Buxoro
// /trips/filter?from_city=Toshkent&to_city=Buxoro
