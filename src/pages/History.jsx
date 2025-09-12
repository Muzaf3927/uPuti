import React from "react";
import { Card } from "@/components/ui/card";

import { History as HistoryIcon } from "lucide-react";

function History() {
  return (
    <>
      <Card className="flex flex-col items-center bg-gray-300/6  py-20">
        <div className="rounded-full bg-gray-500/6 w-20 h-20 flex items-center justify-center">
          <HistoryIcon />
        </div>
        <h2>Safarlar tarixi bo‘sh</h2>
      </Card>
    </>
  );
}

export default History;
