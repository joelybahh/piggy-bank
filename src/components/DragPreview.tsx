"use client";

import React from "react";
import { useDragLayer } from "react-dnd";
import { getCoinStyle } from "@/components/DraggableCoin";
import { parseToReadable } from "@/utils";

const DragPreview: React.FC = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 100,
        left: currentOffset?.x ?? 0,
        top: currentOffset?.y ?? 0,
      }}
    >
      <div className={getCoinStyle(item.value)}>
        {parseToReadable(item.value)}
      </div>
    </div>
  );
};

export default DragPreview;
