"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="m-4 flex flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-2xl">Упс! Ошибочка</h2>
      <p>{error.message}</p>
      <Button onClick={() => reset()}>Попробовать еще раз</Button>
    </div>
  );
}
