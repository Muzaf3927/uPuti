import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Route } from "lucide-react";
import React from "react";

function Trips() {
  return (
    <div className="custom-container">
      <div className="w-full flex text-green-400 gap-2.5 mb-5">
        <div className="border-2 w-full px-10 py-4 bg-green-50 rounded-3xl flex flex-col items-center">
          <Route />
          <h4>Yangi sayohat yaratish</h4>
        </div>
        <div className="border-2 w-full px-10 py-4 bg-green-50 rounded-3xl flex flex-col items-center">
          <MapPin />
          <h4>Sayohat qidirish</h4>
        </div>
      </div>
      <Card>
        <CardContent>
          <Tabs defaultValue="allTrips" className="w-full">
            <TabsList className="px-2 w-full">
              <TabsTrigger value="allTrips">Barcha sayohatlar</TabsTrigger>
              <TabsTrigger value="myTrips">Mening sayohatlarim</TabsTrigger>
            </TabsList>
            <TabsContent value="allTrips">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="myTrips">
              Change your password here.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default Trips;
