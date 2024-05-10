import { formatDateToDateTime } from "@/utils/datetime";
import React, { useState, useEffect } from "react";

interface Props {
  format?: (date: Date) => string;
}

export const DateTime = (props: Props) => {
  const { format = formatDateToDateTime } = props;
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <>{format(date)}</>;
};

export default DateTime;
