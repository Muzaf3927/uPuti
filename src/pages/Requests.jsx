import React from "react";
// shad cn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Car,
  Check,
  Link,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Requests() {
  return (
    <Tabs defaultValue="allTrips" className="w-full">
      <TabsList className="px-2 w-full  mb-6">
        <TabsTrigger value="allTrips">Men yuborgan so'rovlar</TabsTrigger>
        <TabsTrigger value="myTrips">Menga kelgan so'rovlar</TabsTrigger>
      </TabsList>
      <TabsContent value="allTrips">
        <Card className="bg-gray-500/5">
          <CardContent className="flex flex-col gap-5 sm:py-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Avatar className="size-8 sm:size-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="text-sm sm:text-2xl">
                  <h2 className="font-bold text-green-700">Sergey Volkov</h2>
                  <span>⭐ 4.6</span>
                </div>
              </div>
              <span className="bg-green-700 text-white py-1 px-2 rounded-2xl text-sm sm:text-md">
                Kutilmoqda
              </span>
            </div>
            <div className="bg-green-500/5 border border-green-100 p-2 sm:p-5 rounded-2xl">
              <h2 className="flex items-center font-bold text-green-700">
                <MapPin className="mr-2" />
                Toshkent
                <ArrowRight size={17} />
                Farg'ona
              </h2>
              <div className="flex justify-between mt-2">
                <p>20 yanvar 8:00 da</p>
                <h2 className="font-bold">45 000 so'm</h2>
              </div>
            </div>
            <div>
              <span className="bg-green-700 text-white py-1 px-2 rounded-2xl">
                Bron qilingan
              </span>
            </div>
            <div className="text-sm sm:text-md bg-white border border-green-100 p-3 sm:p-5 rounded-2xl">
              Salom! Men sizning sayohatingizda joy band qilmoqchiman.
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="myTrips">
        <Card className="bg-gray-500/5">
          <CardContent className="flex flex-col gap-5 sm:py-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Avatar className="size-8 sm:size-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="text-sm sm:text-2xl">
                  <h2 className="font-bold text-green-700">Sergey Volkov</h2>
                  <span>⭐ 4.6</span>
                </div>
              </div>
              <p className="bg-green-700 text-white py-1 px-2 rounded-2xl text-sm sm:text-md">
                Kutilmoqda
              </p>
            </div>
            <div className="bg-green-500/5 border border-green-100 p-2 sm:p-5 rounded-2xl">
              <h2 className="flex items-center font-bold text-green-700">
                <MapPin className="mr-2" />
                Toshkent
                <ArrowRight size={17} />
                Farg'ona
              </h2>
              <div className="flex justify-between mt-2">
                <p>20 yanvar 8:00 da</p>
                <h2 className="font-bold">75 000 so'm</h2>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="bg-green-700 text-white py-1 px-2 rounded-2xl">
                Narx taklifi
              </span>
              <h2 className="font-bold">60 000 so'm</h2>
            </div>
            <div className="bg-white border border-green-100 p-3 sm:p-5 text-sm sm:text-md rounded-2xl">
              Safar uchun 60.000 bersam bo'ladimi
            </div>
            <div className="w-full flex gap-3">
              <button className="w-full flex justify-center bg-green-700 text-white rounded-3xl py-2 hover:shadow-[0px_54px_55px_theme(colors.green.700/0.25),0px_-12px_30px_theme(colors.green.700/0.12),0px_4px_6px_theme(colors.green.700/0.12),0px_12px_13px_theme(colors.green.700/0.17),0px_-3px_5px_theme(colors.green.700/0.09)] transition-all duration-300 cursor-pointer">
                <Check /> Roziman
              </button>
              <button className="w-full flex justify-center border border-amber-500 text-amber-500 rounded-3xl py-2 hover:shadow-[0px_-12px_30px_theme(colors.amber.500/0.12),0px_4px_6px_theme(colors.amber.500/0.12),0px_12px_13px_theme(colors.amber.500/0.17),0px_-3px_5px_theme(colors.amber.500/0.09)]  transition-all duration-300 cursor-pointer">
                <X /> Bekor qilish
              </button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default Requests;
