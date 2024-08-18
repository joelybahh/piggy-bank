export const parseToReadable = (value: number) => {
  if (value === 0.05) {
    return "5c";
  } else if (value === 0.1) {
    return "10c";
  } else if (value === 0.2) {
    return "20c";
  } else if (value === 0.5) {
    return "50c";
  } else {
    return `$${value}`;
  }
};

export interface Coin {
  id: string;
  value: number;
  cleared: boolean;
}

const denominations = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05];

export function splitCoin(coin: Coin): Coin[] {
  const nextDenomIndex = denominations.findIndex((d) => d < coin.value);
  if (nextDenomIndex === -1) return [coin]; // Can't split further

  const nextDenom = denominations[nextDenomIndex];
  const count = Math.floor(coin.value / nextDenom);
  const remainder = Number((coin.value % nextDenom).toFixed(2));

  const newCoins: Coin[] = Array(count)
    .fill(null)
    .map(() => ({
      id: `${nextDenom}-${Math.random()}`,
      value: nextDenom,
      cleared: coin.cleared,
    }));

  if (remainder > 0) {
    newCoins.push({
      id: `${remainder}-${Math.random()}`,
      value: remainder,
      cleared: coin.cleared,
    });
  }

  return newCoins;
}

export function combineCoins(coin1: Coin, coin2: Coin): Coin | null {
  const combinedValue = Number((coin1.value + coin2.value).toFixed(2));
  const nextLargerDenom = denominations.find((d) => d === combinedValue);

  if (nextLargerDenom === combinedValue) {
    return {
      id: `${combinedValue}-${Math.random()}`,
      value: combinedValue,
      cleared: false,
    };
  }

  return null; // Return null if coins can't be combined into a larger denomination
}

export function getNextDenomination(value: number): number | null {
  const index = denominations.findIndex((d) => d < value);
  return index !== -1 ? denominations[index] : null;
}

export function canSplitCoin(value: number): boolean {
  return getNextDenomination(value) !== null;
}

export const COIN_VALUES = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05];

export const generateDroppedCoins = (amount: number) => {
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

export const calculateOptimalChange = (amount: number): Coin[] => {
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
