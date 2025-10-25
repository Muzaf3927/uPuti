import React, { useEffect, useState } from "react";

// components
import TripsCard from "@/components/TripsCard";

// icons
import { Car, MapPin, Route, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// router
import { useLocation } from "react-router-dom";

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
import TimePicker from "@/components/ui/time-picker";

// input mask
import { InputMask } from "@react-input/mask";
import { Textarea } from "@/components/ui/textarea";

import { useGetData, usePostData } from "@/api/api";
import { useKeyboardInsets } from "@/hooks/useKeyboardInsets.jsx";
import { useI18n } from "@/app/i18n.jsx";
import TripsCardSkeleton from "@/components/TripsCardSkeleton";
import { toast } from "sonner";
import MyTripsCard from "@/components/MyTripsCard";
import { useSmartRefresh } from "@/hooks/useSmartRefresh.jsx";
 

function Trips() {
  const { t } = useI18n();
  const { keyboardInset, viewportHeight } = useKeyboardInsets();
  const location = useLocation();
  const [dialog, setDialog] = useState(false);
  const [searchDialog, setSearchDialog] = useState(false);
  
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [formErrors, setFormErrors] = useState({});
  const [dialogBron, setDialogBron] = useState(false);
  const [dialogPrice, setDialogPrice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [costInput, setCostInput] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
  });

  const [activeFilters, setActiveFilters] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
  });

  const [filteredUrl, setFilteredUrl] = useState("");
  const [allPage, setAllPage] = useState(1);
  const [myPage, setMyPage] = useState(1);
  const ALL_PER_PAGE = 10;
  const MY_PER_PAGE = 5;

  const baseQuery = activeFilters.from
    ? `?from_city=${activeFilters.from}&to_city=${activeFilters.to}`
    : "?";
  const allTripsUrl = `/trips${baseQuery}${baseQuery.includes("?") && baseQuery !== "?" ? "&" : ""}page=${allPage}&per_page=${ALL_PER_PAGE}`;
  const { data, isLoading, error, refetch } = useGetData(allTripsUrl);

  const handleSearch = (e) => {
    e.preventDefault();
    // Устанавливаем активные фильтры только при нажатии кнопки поиска
    setActiveFilters({ ...searchFilters });
    setSearchDialog(false);
  };

  const handleClearSearch = () => {
    setActiveFilters({ from: "", to: "", date: "", time: "" });
    setSearchFilters({ from: "", to: "", date: "", time: "" });
  };

  const {
    data: myTrips,
    isLoading: myTripsLoading,
    error: myTripsError,
    refetch: myTripsRefetch,
  } = useGetData(`/my-trips?page=${myPage}&per_page=${MY_PER_PAGE}`);

  // Умное автоматическое обновление
  const { forceRefresh, resetActivityFlags } = useSmartRefresh(
    () => {
      // Обновляем все запросы, включая с фильтрами
      Promise.allSettled([refetch(), myTripsRefetch()]);
    },
    5000, // обновляем каждые 5 секунд
    [refetch, myTripsRefetch]
  );

  // Автоматическое обновление данных при переходе на страницу
  useEffect(() => {
    if (location.pathname === "/") {
      refetch();
      myTripsRefetch();
    }
  }, [location.pathname, refetch, myTripsRefetch]);

  //

  // useEffect(() => {
  //   refetch();
  // }, [filteredUrl]);

  const myTripsList = (myTrips && myTrips.data) || [];

  const tripPostMutation = usePostData("/trip");


  // Функция валидации формы
  const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.get("from")?.trim()) {
      errors.from = t("trips.form.validation.fromRequired");
    }
    if (!formData.get("to")?.trim()) {
      errors.to = t("trips.form.validation.toRequired");
    }
    if (!formData.get("date")?.trim()) {
      errors.date = t("trips.form.validation.dateRequired");
    }
    if (!selectedTime?.trim()) {
      errors.time = t("trips.form.validation.timeRequired");
    }
    if (!formData.get("cost")?.trim()) {
      errors.cost = t("trips.form.validation.costRequired");
    }
    if (!formData.get("carSeats")?.trim()) {
      errors.carSeats = t("trips.form.validation.carSeatsRequired");
    }
    if (!formData.get("carModel")?.trim()) {
      errors.carModel = t("trips.form.validation.carModelRequired");
    }
    if (!formData.get("carColor")?.trim()) {
      errors.carColor = t("trips.form.validation.carColorRequired");
    }
    if (!formData.get("carNumber")?.trim()) {
      errors.carNumber = t("trips.form.validation.carNumberRequired");
    }
    
    // Проверка даты и времени
    const selectedDate = formData.get("date");
    const selectedTimeValue = selectedTime;
    
    if (selectedDate && selectedTimeValue) {
      const now = new Date();
      const selectedDateTime = new Date(`${selectedDate}T${selectedTimeValue}:00`);
      
      if (selectedDateTime <= now) {
        errors.dateTime = t("trips.form.validation.futureDateTime");
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Защита от множественных нажатий
    if (isSubmitting) return;
    
    const formData = new FormData(e.target);

    // Валидация формы
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error(t("trips.form.validationError"));
      return;
    }

    // Очищаем ошибки если валидация прошла
    setFormErrors({});
    setIsSubmitting(true);

    const from_city = formData.get("from");
    const to_city = formData.get("to");
    const date = formData.get("date");
    const time = selectedTime; // Используем выбранное время из TimePicker
    const price = (costInput || "").replace(/\s/g, "");
    const note = formData.get("note");
    const carModel = formData.get("carModel");
    const carColor = formData.get("carColor");
    const numberCar = formData.get("carNumber")?.toString().toUpperCase(); // Автоматически делаем заглавными
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
        toast.success(t("trips.form.successMessage"));
        setDialog(false);
        // Принудительно обновляем данные после создания поездки
        resetActivityFlags();
        forceRefresh();
      }
    } catch (err) {
      console.error(err);
      
      // Отображаем ошибку от backend
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Если есть валидационные ошибки
        const errorMessages = Object.values(err.response.data.errors).flat();
        toast.error(errorMessages.join(', '));
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error(t("trips.form.errorMessage"));
      }
    } finally {
      setIsSubmitting(false);
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
            <div className="border-2 w-full py-2 sm:px-10 sm:py-4 bg-green-50 rounded-3xl flex flex-col items-center">
              <Route className="md:size-6 size-4" />
              <h4 className="text-sm md:text-md font-bold">{t("trips.create")}</h4>
            </div>
          </DialogTrigger>
          <DialogContent
            className="w-[95vw] sm:max-w-[760px] p-4 sm:p-6 overflow-hidden overscroll-contain touch-pan-y"
            style={{ maxHeight: viewportHeight ? Math.min(860, viewportHeight - 4) : undefined }}
            preventOutsideClose
          >
            <DialogHeader>
              <DialogTitle className="text-center text-green-600 font-bold">{t("trips.create")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 overflow-y-auto overflow-x-hidden pr-1 touch-pan-y overscroll-contain"
                   style={{ maxHeight: viewportHeight ? viewportHeight - 150 : undefined }}
                   onTouchMove={(e) => e.stopPropagation()}
              >
              <div className="col-span-1 sm:col-span-1 grid items-center gap-1.5">
                <Label htmlFor="from">{t("trips.form.from")} *</Label>
                <Input 
                  type="text" 
                  id="from" 
                  name="from" 
                  placeholder={t("trips.form.fromPlaceholder")} 
                  required
                  className={formErrors.from ? "border-red-500" : ""}
                />
                {formErrors.from && <span className="text-red-500 text-xs">{formErrors.from}</span>}
              </div>
              <div className="col-span-1 sm:col-span-1 grid items-center gap-1.5">
                <Label htmlFor="to">{t("trips.form.to")} *</Label>
                <Input 
                  type="text" 
                  id="to" 
                  name="to" 
                  placeholder={t("trips.form.toPlaceholder")} 
                  required
                  className={formErrors.to ? "border-red-500" : ""}
                />
                {formErrors.to && <span className="text-red-500 text-xs">{formErrors.to}</span>}
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="date">{t("trips.form.date")} *</Label>
                <Input 
                  type="date" 
                  id="date" 
                  name="date" 
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className={formErrors.date || formErrors.dateTime ? "border-red-500" : ""}
                />
                {formErrors.date && <span className="text-red-500 text-xs">{formErrors.date}</span>}
                {formErrors.dateTime && <span className="text-red-500 text-xs">{formErrors.dateTime}</span>}
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="time">{t("trips.form.time")} *</Label>
                <TimePicker
                  id="time"
                  value={selectedTime}
                  onChange={setSelectedTime}
                  className={`w-full ${formErrors.time || formErrors.dateTime ? "border-red-500" : ""}`}
                />
                {formErrors.time && <span className="text-red-500 text-xs">{formErrors.time}</span>}
                {formErrors.dateTime && <span className="text-red-500 text-xs">{formErrors.dateTime}</span>}
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="cost">{t("trips.form.cost")} *</Label>
                <div className="relative">
                  <Input 
                    type="text" 
                    id="cost" 
                    name="cost" 
                    inputMode="numeric"
                    placeholder={t("trips.form.costPlaceholder")} 
                    required
                    value={costInput}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                      setCostInput(formatted);
                    }}
                    className={`${formErrors.cost ? "border-red-500" : ""} pr-16`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">сум</span>
                </div>
                {formErrors.cost && <span className="text-red-500 text-xs">{formErrors.cost}</span>}
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="carSeats">{t("trips.form.carSeats")} *</Label>
                <Input 
                  type="number" 
                  id="carSeats" 
                  name="carSeats" 
                  placeholder={t("trips.form.carSeatsPlaceholder")} 
                  required
                  className={formErrors.carSeats ? "border-red-500" : ""}
                />
                {formErrors.carSeats && <span className="text-red-500 text-xs">{formErrors.carSeats}</span>}
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="car">{t("trips.form.carModel")} *</Label>
                <Input 
                  type="text" 
                  id="car" 
                  name="carModel" 
                  placeholder={t("trips.form.carModelPlaceholder")} 
                  required
                  className={formErrors.carModel ? "border-red-500" : ""}
                />
                {formErrors.carModel && <span className="text-red-500 text-xs">{formErrors.carModel}</span>}
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="carColor">{t("trips.form.carColor")} *</Label>
                <Input 
                  type="text" 
                  id="carColor" 
                  name="carColor" 
                  placeholder={t("trips.form.carColorPlaceholder")} 
                  required
                  className={formErrors.carColor ? "border-red-500" : ""}
                />
                {formErrors.carColor && <span className="text-red-500 text-xs">{formErrors.carColor}</span>}
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="carNumber">{t("trips.form.carNumber")} *</Label>
                <Input
                  type="text" 
                  id="carNumber" 
                  name="carNumber" 
                  placeholder={t("trips.form.carNumberPlaceholder")} 
                  className={`uppercase ${formErrors.carNumber ? "border-red-500" : ""}`}
                  required
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
                {formErrors.carNumber && <span className="text-red-500 text-xs">{formErrors.carNumber}</span>}
              </div>
              <div className="col-span-1 grid items-center gap-1.5">
                <Label htmlFor="note">{t("trips.form.note")}</Label>
                <Input type="text" id="note" name="note" placeholder={t("trips.commentPlaceholder")} />
              </div>
              </div>
              {/* Footer outside of scroll area to avoid iOS sticky-bottom issues */}
              <div className="flex gap-2 mt-2 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 py-1" style={{ paddingBottom: keyboardInset ? keyboardInset : undefined }}>
                <DialogClose asChild>
                  <Button type="button" className="rounded-2xl w-1/2 h-9 text-xs sm:text-sm">{t("trips.form.cancel")}</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-green-600 rounded-2xl w-1/2 h-9 text-xs sm:text-sm"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      {t("trips.form.submitting")}
                    </span>
                  ) : (
                    t("trips.form.submit")
                  )}
                </Button>
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
            <div className="border-2 w-full py-2 sm:px-10 sm:py-4 bg-green-50 rounded-3xl flex flex-col items-center">
              <Search className="md:size-6 size-4" />
              <h4 className="text-sm md:text-md font-bold">{t("trips.searchForm.search")}</h4>
            </div>
          </DialogTrigger>
          <DialogContent style={{ maxHeight: viewportHeight ? Math.min(760, viewportHeight - 8) : undefined }}>
            <DialogHeader>
              <DialogTitle className="text-center text-green-600 font-bold">
                {t("trips.searchForm.search")}
              </DialogTitle>
              <form onSubmit={handleSearch} className="flex flex-col gap-3">
                <div className="grid w-full items-center gap-3 overflow-y-auto overflow-x-hidden touch-pan-y overscroll-contain pr-1" style={{ maxHeight: viewportHeight ? viewportHeight - 160 : undefined }}>
                  <Label htmlFor="from">{t("trips.searchForm.from")}</Label>
                  <Input
                    type="text"
                    id="from"
                    name="from"
                    value={searchFilters.from}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, from: e.target.value }))}
                    placeholder={t("trips.searchForm.fromPlaceholder")}
                  />
                  <div className="grid w-full items-center gap-3">
                  <Label htmlFor="to">{t("trips.searchForm.to")}</Label>
                  <Input
                    type="text"
                    id="to"
                    name="to"
                    value={searchFilters.to}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, to: e.target.value }))}
                    placeholder={t("trips.searchForm.toPlaceholder")}
                  />
                  </div>
                  <div className="grid w-full items-center gap-3">
                  <Label htmlFor="date">{t("trips.searchForm.date")}</Label>
                  <InputMask
                    mask="__.__.____"
                    replacement={{ _: /\d/ }}
                    // type="number"
                    id="date"
                    name="date"
                    value={searchFilters.date}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, date: e.target.value }))}
                    placeholder={t("trips.searchForm.datePlaceholder")}
                    className="font-normal file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  </div>
                </div>
                {/* Footer outside of scroll area to avoid iOS sticky issues */}
                <div className="w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 flex gap-2 mt-2 py-1" style={{ paddingBottom: keyboardInset ? keyboardInset : undefined }}>
                  <DialogClose className="w-1/2" asChild>
                    <Button className="rounded-2xl h-9 text-xs sm:text-sm">
                      {t("trips.searchForm.cancel")}
                    </Button>
                  </DialogClose>
                  <Button className="bg-green-600 rounded-2xl w-1/2 h-9 text-xs sm:text-sm" type="submit">
                    {t("trips.searchForm.search")}
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
            <TabsList className="px-1 sm:px-2 w-full mb-4 sm:mb-6">
              <TabsTrigger value="allTrips" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-center">{t("trips.all")}</TabsTrigger>
              <TabsTrigger value="myTrips" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-center">{t("trips.mine")}</TabsTrigger>
            </TabsList>
            {activeFilters.from && (
              <div className="px-4 mb-2">
                <div className="flex items-center justify-between bg-blue-50 rounded-lg p-2">
                  <div className="text-sm text-blue-700">
                    <span className="font-medium">Поиск:</span> {activeFilters.from} → {activeFilters.to}
                    {activeFilters.date && ` • ${activeFilters.date}`}
                  </div>
                  <Button
                    onClick={handleClearSearch}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2"
                  >
                    {t("trips.searchForm.clear")}
                  </Button>
                </div>
              </div>
            )}
            <TabsContent value="allTrips">
              <div className="p-3 space-y-3">
                {isLoading
                  ? Array(4)
                      .fill(1)
                      .map((_, index) => <TripsCardSkeleton key={index} />)
                  : Array.isArray(data?.data)
                      ? data.data
                          .filter((trip) => trip.status !== "completed")
                          .filter((trip) => Boolean(trip?.driver))
                          .map((trip) => (
                            <TripsCard trip={trip} key={trip.id} />
                          ))
                      : null}
              </div>
              <div className="flex items-center justify-center gap-3 px-4 py-2">
                <Button variant="outline" disabled={allPage === 1} onClick={() => setAllPage((p) => Math.max(1, p - 1))} aria-label="Prev page">
                  <ChevronLeft />
                </Button>
                <span className="text-sm">{allPage}</span>
                <Button
                  variant="outline"
                  disabled={!Array.isArray(data?.data) || data.data.length < ALL_PER_PAGE}
                  onClick={() => setAllPage((p) => p + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="myTrips">
              {myTripsLoading ? (
                Array(2)
                  .fill(1)
                  .map((_, index) => <TripsCardSkeleton key={index} />)
              ) : (
                <>
                  {myTrips && myTripsList.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <h2>{t("trips.empty")}</h2>
                      <Button onClick={() => setDialog(true)} className="text-white bg-green-600 rounded-2xl cursor-pointer shadow">
                        {t("trips.create")}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 space-y-3">
                      {myTrips &&
                        myTripsList
                          .filter((item) => item.status !== "completed")
                          .map((item) => (
                            <MyTripsCard trip={item} key={item.id} />
                          ))}
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-3 px-4 py-2">
                    <Button variant="outline" disabled={myPage === 1} onClick={() => setMyPage((p) => Math.max(1, p - 1))} aria-label="Prev page">
                      <ChevronLeft />
                    </Button>
                    <span className="text-sm">{myPage}</span>
                    <Button
                      variant="outline"
                      disabled={Array.isArray(myTripsList) && myTripsList.length < MY_PER_PAGE}
                      onClick={() => setMyPage((p) => p + 1)}
                      aria-label="Next page"
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* Floating refresh button */}
      {/* RefreshFab рендерится глобально из MainLayout через портал */}
    </div>
  );
}

export default Trips;

// /trips/filter?from_city=Toshkent&to_city=Buxoro
// /trips/filter?from_city=Toshkent&to_city=Buxoro
