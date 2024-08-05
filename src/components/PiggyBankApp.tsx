"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { useSpring, animated } from "react-spring";
import CoinButton from "@/components/CoinButton";
import DraggableCoin from "@/components/DraggableCoin";
import PiggyBank from "@/components/PiggyBank";
import DragPreview from "@/components/DragPreview";
import { accounts as Account } from "@prisma/client";
import { TouchBackend } from "react-dnd-touch-backend";

async function updateAccount(url: string, { amount }: { amount: number }) {
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
}

interface Coin {
  id: string;
  value: number;
  cleared: boolean;
}

type AppProps = {
  account: Account;
};

const COIN_VALUES = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05];

const generateDroppedCoins = (amount: number) => {
  const coins: Coin[] = [];
  let remainingAmount = Math.round(amount * 100) / 100; // Round to 2 decimal places

  COIN_VALUES.forEach((coinValue) => {
    while (remainingAmount >= coinValue) {
      coins.push({
        id: `${coinValue}-${Math.random()}`,
        value: coinValue,
        cleared: false,
      });
      remainingAmount = Math.round((remainingAmount - coinValue) * 100) / 100;
    }
  });

  return coins;
};

const depositSound = new Audio("/audio/money-in-1.mp3");
const shakeSound = new Audio("/audio/shake-moneybox.wav");

const PiggyBankApp: React.FC<AppProps> = ({ account }) => {
  const [balance, setBalance] = useState<number>(account.balance);
  const [shakeCount, setShakeCount] = useState<number>(0);
  const [droppedCoins, setDroppedCoins] = useState<Coin[]>(
    generateDroppedCoins(account.awarded),
  );

  const handleAddMoney = useCallback((amount: number) => {
    const newCoin = {
      id: `${amount}-${Math.random()}`,
      value: amount,
      cleared: false,
    };

    updateAccount(`/api/accounts/${account.id}/award`, {
      amount,
    });

    setDroppedCoins((prev) => [...prev, newCoin]);
  }, []);

  const handleShake = useCallback(() => {
    shakeSound.play();
    setShakeCount((prev) => prev + 1);
    if (shakeCount >= 4) {
      if (balance === 0) return;
      const newDroppedCoins = calculateOptimalChange(balance);

      updateAccount(`/api/accounts/${account.id}/unapply`, {
        amount: balance,
      });

      setDroppedCoins((prev) => [...prev, ...newDroppedCoins]);
      setBalance(0);
      setShakeCount(0);
    }
  }, [shakeCount, balance]);

  const calculateOptimalChange = (amount: number): Coin[] => {
    const coins: Coin[] = [];
    let remainingAmount = Math.round(amount * 100) / 100; // Round to 2 decimal places

    COIN_VALUES.forEach((coinValue) => {
      while (remainingAmount >= coinValue) {
        coins.push({
          id: `${coinValue}-${Math.random()}`,
          value: coinValue,
          cleared: false,
        });
        remainingAmount = Math.round((remainingAmount - coinValue) * 100) / 100;
      }
    });

    return coins;
  };

  const handleDrop = useCallback((droppedCoin: Coin) => {
    depositSound.play();

    setBalance((prev) => prev + droppedCoin.value);
    setDroppedCoins((prev) =>
      prev.filter((coin) => coin.id !== droppedCoin.id),
    );

    if (!droppedCoin.cleared) {
      updateAccount(`/api/accounts/${account.id}/apply`, {
        amount: droppedCoin.value,
      });
    }
  }, []);

  const wobbleAnimation = useSpring({
    transform: `rotate(${Math.sin(shakeCount) * 5}deg)`,
    config: { tension: 1000, friction: 5 },
  });

  const groupedDroppedCoins = useMemo(() => {
    return droppedCoins.reduce(
      (acc, coin) => {
        if (!acc[coin.value]) {
          acc[coin.value] = [];
        }
        acc[coin.value].push(coin);
        return acc;
      },
      {} as Record<number, Coin[]>,
    );
  }, [droppedCoins]);

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const backendOptions = {
    enableMouseEvents: true,
    enableTouchEvents: true,
    delayTouchStart: 0,
    ignoreContextMenu: true,
    touchSlop: 20, // Small movement threshold to differentiate between scroll and drag
  };

  return (
    <DndProvider backend={TouchBackend} options={backendOptions}>
      <div className="flex flex-col items-center justify-center min-h-screen light:bg-gray-100 dark:bg-gray-900 p-4">
        <h1 className="text-4xl font-bold mb-4 light:text-black dark:text-white">
          {account.name}
        </h1>
        <p className="text-2xl mb-4 light:text-black dark:text-white">
          Balance: ${balance.toFixed(2)}
        </p>
        <animated.div style={wobbleAnimation} onClick={handleShake}>
          <PiggyBank onDrop={handleDrop} />
        </animated.div>
        <div className="mt-4 flex flex-wrap justify-center">
          {COIN_VALUES.map((value) => (
            <CoinButton
              key={value}
              value={`$${value.toFixed(2)}`}
              onClick={() => handleAddMoney(value)}
            />
          ))}
        </div>
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-2 light:text-black dark:text-white">
            Dropped Coins
          </h2>
          <div className="flex flex-wrap justify-center light:bg-gray-200 dark:bg-gray-700 p-4 rounded-lg min-h-[200px] touch-pan-y">
            {Object.entries(groupedDroppedCoins).map(([value, coins]) => (
              <div key={value} className="m-2">
                <p className="text-center font-bold light:text-black dark:text-white">
                  ${Number(value).toFixed(2)} x {coins.length}
                </p>
                <div className="flex flex-wrap justify-center">
                  {coins.map((coin) => (
                    <DraggableCoin key={coin.id} coin={coin} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DragPreview />
    </DndProvider>
  );
};

export default PiggyBankApp;
