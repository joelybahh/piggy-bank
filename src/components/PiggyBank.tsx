"use client";

import React from "react";
import { useDrop } from "react-dnd";
import PiggyBankImage from "@/components/PiggyBankImage";

interface Coin {
  id: string;
  value: number;
  cleared: boolean;
}

interface PiggyBankProps {
  onDrop: (coin: Coin) => void;
}

const PiggyBank: React.FC<PiggyBankProps> = ({ onDrop }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "coin",
    drop: (item: Coin) => {
      onDrop(item);
      return { name: "PiggyBank" };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div ref={drop as any} className="p-4 m-4 cursor-pointer">
      <PiggyBankImage />
    </div>
  );
};

export default PiggyBank;
