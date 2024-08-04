"use client";
import React from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useEffect } from "react";
import { parseToReadable } from "@/utils";

interface Coin {
  id: string;
  value: number;
}

interface DraggableCoinProps {
  coin: Coin;
}

export const getCoinStyle = (value: number) => {
  let size, color, border;
  if (value <= 0.05) {
    size = "w-8 h-8";
    color = "bg-gray-400";
    border = "border-gray-500";
  } else if (value <= 0.2) {
    size = "w-10 h-10";
    color = "bg-gray-300";
    border = "border-gray-400";
  } else if (value <= 1) {
    size = "w-12 h-12";
    color = "bg-yellow-300";
    border = "border-yellow-400";
  } else {
    size = "w-16 h-16";
    color = "bg-green-200";
    border = "border-green-300";
  }
  return `${size} ${color} rounded-full flex items-center justify-center font-bold border-2 ${border} cursor-move m-1`;
};

const DraggableCoin: React.FC<DraggableCoinProps> = ({ coin }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "coin",
    item: coin,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div
      ref={drag as any}
      className={getCoinStyle(coin.value)}
      style={{ opacity: isDragging ? 0 : 1 }}
    >
      {parseToReadable(coin.value)}
    </div>
  );
};

export default DraggableCoin;
