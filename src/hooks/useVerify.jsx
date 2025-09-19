import React, { useState } from "react";

import { usePostData } from "@/api/api";

export async function useVerify(url, data) {
  const [resData, setResData] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [error, isError] = useState("");

  const verifyMutation = usePostData(url);

  try {
    const res = await verifyMutation.mutateAsync(data);
  } catch {
  } finally {
  }
  return { resData, isError, isLoading };
}
