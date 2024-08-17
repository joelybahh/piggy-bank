"use client";

import { accounts as Account, goals as DbGoals } from "@prisma/client";
import { useMemo } from "react";

type GoalsProps = {
  account: {
    id: Account["id"];
    name: Account["name"];
    balance: Account["balance"];
    awarded: Account["awarded"];
    goals: DbGoals[];
  };
  onClickComplete: (goalId: DbGoals["id"]) => void;
};

const Goals: React.FC<GoalsProps> = ({ account, onClickComplete }) => {
  return account.goals.map((goal) => (
    <Goal
      key={goal.id}
      onClickComplete={() => onClickComplete(goal.id)}
      total={account.balance}
      {...goal}
    />
  ));
};

const Goal: React.FC<
  DbGoals & { total: number; onClickComplete: () => void }
> = ({ title, total, amount, completed, onClickComplete }) => {
  const goalProgress = useMemo(() => {
    return (total / amount) * 100;
  }, [total, amount]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-center">
        <h2>
          {title}: ${amount.toFixed(2)}
        </h2>
        {!completed && (
          <>
            {total >= amount ? (
              <button
                className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                onClick={onClickComplete}
              >
                Complete Goal
              </button>
            ) : (
              <progress value={goalProgress} max="100">
                {goalProgress}%
              </progress>
            )}
          </>
        )}
        {completed && (
          <div className="flex text-center justify-center items-center mt-2 text-green-600">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <p>Goal Completed!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
