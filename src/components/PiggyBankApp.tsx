"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { useSpring, animated } from "react-spring";
import DraggableCoin from "@/components/DraggableCoin";
import PiggyBank from "@/components/PiggyBank";
import DragPreview from "@/components/DragPreview";
import { accounts as Account, goals } from "@prisma/client";
import { TouchBackend } from "react-dnd-touch-backend";
import { updateAccount, putAccount } from "@/api";
import { Coin, combineCoins, splitCoin } from "@/utils";
import Goals from "./Goals";

type AppProps = {
  account: {
    id: Account["id"];
    name: Account["name"];
    balance: Account["balance"];
    awarded: Account["awarded"];
    goals: goals[];
  };
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

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    if (isDragging) {
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", preventScroll, { passive: false });
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [isDragging]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
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
  }, [account.id, shakeCount, balance]);

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

  const handleDrop = useCallback(
    (droppedCoin: Coin, targetCoin?: Coin) => {
      depositSound.play();

      if (targetCoin) {
        const combinedCoin = combineCoins(droppedCoin, targetCoin);
        console.log(combinedCoin);
        if (combinedCoin) {
          setDroppedCoins((prevCoins) => [
            ...prevCoins.filter(
              (coin) => coin.id !== droppedCoin.id && coin.id !== targetCoin.id,
            ),
            combinedCoin,
          ]);
        }
      } else {
        setBalance((prev) => prev + droppedCoin.value);
        setDroppedCoins((prev) =>
          prev.filter((coin) => coin.id !== droppedCoin.id),
        );

        if (!droppedCoin.cleared) {
          updateAccount(`/api/accounts/${account.id}/apply`, {
            amount: droppedCoin.value,
          });
        }
      }

      handleDragEnd();
    },
    [account.id, handleDragEnd],
  );

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

  const handleLongHold = useCallback((coin: Coin) => {
    console.log("Long hold", coin);
    const newCoins = splitCoin(coin);
    if (newCoins.length > 1) {
      setDroppedCoins((prevCoins) => [
        ...prevCoins.filter((c) => c.id !== coin.id),
        ...newCoins,
      ]);
    }
  }, []);

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const handleGoalComplete = async (goal_id: string) => {
    const response = await putAccount(
      `/api/accounts/${account.id}/goals/${goal_id}/complete`,
    );

    if (response.ok) {
      const body = await response.json();
      setBalance(body.balance);
    }
  };

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
        <Goals
          account={{
            ...account,
            balance,
          }}
          onClickComplete={handleGoalComplete}
        />
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-2 light:text-black dark:text-white">
            Dropped Coins
          </h2>
          <div className="flex flex-wrap justify-center light:bg-gray-200 dark:bg-gray-700 p-4 rounded-lg min-h-[200px] touch-pan-y">
            {Object.entries(groupedDroppedCoins).map(([value, coins]) => (
              <div key={value} className="m-2">
                <div className="flex flex-wrap justify-center">
                  {coins.map((coin) => (
                    <DraggableCoin
                      key={coin.id}
                      coin={coin}
                      onLongHold={handleLongHold}
                      onDrop={(droppedCoin) => handleDrop(droppedCoin, coin)}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
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
