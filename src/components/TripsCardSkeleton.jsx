import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";

function TripsCardSkeleton() {
  return (
    <Card className="flex gap-2 border-0 py-0">
      <CardContent className="flex flex-col gap-2 px-2 py-1">
        <div className="flex gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-8 rounded-2xl w-40" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Skeleton className="h-5 rounded-2xl w-20" />
            <Skeleton className="h-5 rounded-2xl w-20" />
            <Skeleton className="h-5 rounded-2xl w-20" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-20 rounded-2xl" />
            <Skeleton className="h-5 w-20 rounded-2xl" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TripsCardSkeleton;
