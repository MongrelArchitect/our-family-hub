"use client";
import { useEffect, useState } from "react";
import Loading from "./Loading";

interface Props {
  dateOnly?: boolean;
  timestampFromServer: Date;
}

export default function LocalTime({ dateOnly, timestampFromServer }: Props) {
  const [onClient, setOnClient] = useState(false);

  useEffect(() => {
    setOnClient(true);
  }, []);

  const setFormat = () => {
    if (dateOnly) {
      return timestampFromServer.toLocaleDateString();
    }
    return timestampFromServer.toLocaleString();
  };

  return <>{onClient ? setFormat() : <Loading size={2} />}</>;
}
