import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  User,
  Phone,
  CheckCircle2,
  CalendarDays,
  Copy,
  MessageCircle,
  Star,
  LucideBadgeDollarSign,
  ArrowLeft,
} from "lucide-react";
import { useGetData } from "@/api/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

function Profile() {
  const { data, isPending, error } = useGetData("/users/me");

  if (isPending)
    return (
      <Card className="max-w-md mx-auto w-full shadow-lg">
        <CardHeader className="flex items-center gap-4 pb-2">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2" />
          </div>
          <Skeleton className="h-8 w-16" />
        </CardHeader>
        <CardContent className="grid gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  if (error) return <div>Error loading profile.</div>;
  if (!data) return null;

  const createdDate = new Date(data.created_at).toLocaleString();
  const updatedDate = new Date(data.updated_at).toLocaleString();

  return (
    <>
      <Link
        to="/"
        className="flex items-center border-green-400 border rounded-2xl mb-5 w-40 p-1 bg-white/80 backdrop-blur-sm shadow"
      >
        <ArrowLeft />
        Orqaga qaytish
      </Link>
      <Card className="mx-auto w-full shadow-sm border rounded-3xl bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader className="flex items-center gap-4 pb-2">
          <Avatar className="h-16 w-16 ring-2 ring-white shadow">
            <AvatarFallback className="uppercase text-xl">
              {getInitials(data.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span>{data.name || "No name"}</span>
              {data.is_verified && (
                <Tooltip>
                  <TooltipTrigger>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </TooltipTrigger>
                  <TooltipContent>Verified</TooltipContent>
                </Tooltip>
              )}
            </CardTitle>
          </div>
          <Button size="sm" variant="outline" className="bg-white/80">
            Edit
          </Button>
        </CardHeader>

        <CardContent className="grid gap-4 pt-2">
          <div className="flex items-center gap-2 text-base">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{data.phone || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-base text-green-700">
            <span>
              <LucideBadgeDollarSign />
            </span>
            <span className="font-medium text-green-600">Balance:</span>
            <span className="text-black font-bold">
              {Number(data?.balance).toLocaleString()} UZS
            </span>
          </div>
          <div className="flex items-center gap-2 text-base text-green-700">
            <span>
              <Star />
            </span>
            <span className="font-medium text-green-600">Rating:</span>
            <span className="flex items-center gap-1">
              <span className="text-yellow-500 font-bold">{data?.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({data?.rating_count})
              </span>
            </span>
          </div>
        </CardContent>
      </Card>{" "}
    </>
  );
}

export default Profile;
