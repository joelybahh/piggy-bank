"use client";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useEffect } from "react";
import { Coin, canSplitCoin, parseToReadable } from "@/utils";

interface DraggableCoinProps {
  coin: Coin;
  onLongHold: (coin: Coin) => void;
  onDrop: (droppedCoin: Coin) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
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

const DraggableCoin: React.FC<DraggableCoinProps> = ({
  coin,
  onLongHold,
  onDrop,
  onDragStart,
  onDragEnd,
}) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "coin",
    item: () => {
      onDragStart();
      return coin;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      onDragEnd();
    },
  }));

  const [, drop] = useDrop(() => ({
    accept: "coin",
    drop: (item: Coin) => {
      if (item.id !== coin.id) {
        onDrop(item);
      }
    },
  }));

  const longPressTimer = React.useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = React.useRef<{ x: number; y: number } | null>(null);
  const [isLongPress, setIsLongPress] = React.useState(false);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const startLongPress = (e: React.TouchEvent | React.MouseEvent) => {
    if (canSplitCoin(coin.value)) {
      if (e.type === "touchstart") {
        const touch = (e as React.TouchEvent).touches[0];
        touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      }
      longPressTimer.current = setTimeout(() => {
        setIsLongPress(true);
        onLongHold(coin);
      }, 500); // 500ms for long press
    }
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    touchStartPos.current = null;
    setIsLongPress(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartPos.current) {
      const touch = e.touches[0];
      const moveThreshold = 10; // pixels

      const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        endLongPress();
      }
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node)) as any}
      className={`${getCoinStyle(coin.value)} ${canSplitCoin(coin.value) ? "cursor-pointer" : ""}`}
      style={{ opacity: isDragging ? 0 : 1 }}
      onMouseDown={startLongPress}
      onMouseUp={endLongPress}
      onMouseLeave={endLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={endLongPress}
      onTouchMove={handleTouchMove}
    >
      {parseToReadable(coin.value)}
    </div>
  );
};

export default DraggableCoin;
