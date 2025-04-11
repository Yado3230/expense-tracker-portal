"use client";

import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  name: string;
  date: Date;
  amount: number;
  status: "completed" | "pending" | "failed";
  note?: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 text-sm text-gray-500 pb-2">
        <div>Transaction Name</div>
        <div>Date & Time</div>
        <div>Amount</div>
        <div>Note</div>
        <div>Status</div>
      </div>
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="grid grid-cols-5 items-center py-3 text-sm border-b border-gray-100 last:border-0"
        >
          <div className="font-medium">{transaction.name}</div>
          <div className="text-gray-500">
            {format(transaction.date, "yyyy-MM-dd HH:mm")}
          </div>
          <div
            className={cn(
              "font-medium",
              transaction.amount > 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {transaction.amount > 0 ? "+" : "-"}$
            {Math.abs(transaction.amount).toFixed(2)}
          </div>
          <div className="text-gray-500">{transaction.note}</div>
          <div>
            <span
              className={cn("px-2 py-1 rounded-full text-xs font-medium", {
                "bg-green-100 text-green-700":
                  transaction.status === "completed",
                "bg-yellow-100 text-yellow-700":
                  transaction.status === "pending",
                "bg-red-100 text-red-700": transaction.status === "failed",
              })}
            >
              {transaction.status.charAt(0).toUpperCase() +
                transaction.status.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
