import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
  ArrowLeft,
  Star,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useGetData } from "@/api/api";
import { Skeleton } from "@/components/ui/skeleton";

function UserProfile() {
  const { id } = useParams();
  const { data, isPending, error } = useGetData(`/users/${id}`);
  const user = data && data;

  const createdDate = new Date(user?.created_at).toLocaleString();
  const updatedDate = new Date(user?.updated_at).toLocaleString();

  if (isPending) {
    return (
      <>
        <Link
          to="/"
          className="flex items-center border-green-400 border rounded-2xl mb-5 w-40 p-1"
        >
          <ArrowLeft />
          Orqaga qaytish
        </Link>
        <Card className="mx-auto w-full shadow-lg px-0">
          <CardHeader className="flex items-center gap-4 pb-2">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 pt-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-32" />
          </CardContent>
          <CardFooter className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      </>
    );
  }

  return (
    <>
      <Link
        to="/"
        className="flex items-center border-green-400 border rounded-2xl mb-5 w-40 p-1"
      >
        <ArrowLeft />
        Orqaga qaytish
      </Link>
      <Card className=" mx-auto w-full shadow-lg px-0 border-green-400">
        <CardHeader className="flex items-center gap-4 pb-2">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="uppercase text-xl">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <span>{user?.name || "No name"}</span>
              {user?.is_verified && (
                <Tooltip>
                  <TooltipTrigger>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </TooltipTrigger>
                  <TooltipContent>Verified</TooltipContent>
                </Tooltip>
              )}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 pt-2">
          <div className="flex items-center gap-2 text-base">
            <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="whitespace-nowrap">{user?.phone ? `+998${user.phone}` : "—"}</span>
          </div>

          <div className="flex items-center gap-2 text-base text-green-700">
            <span>
              <Star />
            </span>
            <span className="font-medium text-green-600">Rating:</span>
            <span className="flex items-center gap-1">
              <span className="text-yellow-500 font-bold">{user?.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({user?.rating_count})
              </span>
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default UserProfile;
