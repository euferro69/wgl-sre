import { LinearProgress } from "@mui/material";
import { useEffect } from "react";

interface LoadingPopupProps {
  isLoading: boolean;
  message: string;
}

export default function LoadingPopup({
  isLoading,
  message,
}: LoadingPopupProps) {
  useEffect(() => {}), [isLoading, message];

  return (
    <div
      className={`flex flex-col justify-center align-middle p-5 w-80 h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#333] rounded-md ${
        !isLoading ? "hidden" : ""
      }`}
    >
      <div className="mb-3">{message}</div>
      <LinearProgress />
    </div>
  );
}
