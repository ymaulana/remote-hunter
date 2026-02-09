"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface ClientDateProps {
  date: string | Date;
  addSuffix?: boolean;
}

export default function ClientDate({
  date,
  addSuffix = true,
}: ClientDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    setFormattedDate(
      formatDistanceToNow(new Date(date), {
        addSuffix,
      }),
    );
  }, [date, addSuffix]);

  if (!formattedDate) {
    return null; // Render nothing on server to avoid mismatch
  }

  return <>{formattedDate}</>;
}
