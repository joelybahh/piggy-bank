import React from "react";

interface CoinButtonProps {
  value: string;
  onClick: () => void;
}

const CoinButton: React.FC<CoinButtonProps> = ({ value, onClick }) => (
  <button
    onClick={onClick}
    className="bg-yellow-500 text-white font-bold py-2 px-4 rounded m-1"
  >
    {value}
  </button>
);

export default CoinButton;
