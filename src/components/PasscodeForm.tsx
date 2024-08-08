"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface PasscodeFormProps {
  verifyPasscode: (formData: FormData) => Promise<boolean>;
  title: string;
}

const PasscodeForm: React.FC<PasscodeFormProps> = ({
  verifyPasscode,
  title,
}) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleNumberClick = (number: number) => {
    if (passcode.length < 4) {
      setPasscode((prev) => prev + number);
    }
  };

  const handleDelete = () => {
    setPasscode((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.length !== 4) {
      setError("Please enter a 4-digit passcode");
      return;
    }

    const formData = new FormData();
    formData.append("passcode", passcode);

    const isValid = await verifyPasscode(formData);
    if (isValid) {
      router.refresh();
    } else {
      setError("Incorrect passcode");
      setPasscode("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">{title}</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Enter Your Passcode
        </h2>
        <div className="mb-4 flex justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 mx-2 rounded-full ${passcode[i] ? "bg-blue-500" : "bg-gray-300"}`}
            ></div>
          ))}
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberClick(number)}
              className="bg-blue-500 text-white text-2xl font-bold rounded-full w-16 h-16 flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              {number}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white text-xl font-bold rounded-full w-16 h-16 flex items-center justify-center hover:bg-red-600 transition-colors col-span-1"
          >
            Del
          </button>
          <button
            onClick={() => handleNumberClick(0)}
            className="bg-blue-500 text-white text-2xl font-bold rounded-full w-16 h-16 flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white text-xl font-bold rounded-full w-16 h-16 flex items-center justify-center hover:bg-green-600 transition-colors"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasscodeForm;
