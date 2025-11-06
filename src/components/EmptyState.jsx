import React from "react";

import { Card, CardContent } from "@/components/ui/card";

function EmptyState({
  icon = null,
  title = "",
  description = "",
  action = null,
  className = "",
}) {
  return (
    <Card className={`rounded-3xl border shadow-lg bg-card/90 backdrop-blur-sm ${className}`}>
      <CardContent className="py-10 sm:py-12 flex flex-col items-center text-center gap-3">
        {icon ? (
          <div className="rounded-full bg-accent w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            {icon}
          </div>
        ) : null}
        {title ? (
          <h2 className="text-base sm:text-lg font-semibold text-foreground">{title}</h2>
        ) : null}
        {description ? (
          <p className="text-sm text-muted-foreground max-w-[32ch]">{description}</p>
        ) : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </CardContent>
    </Card>
  );
}

export default EmptyState;


