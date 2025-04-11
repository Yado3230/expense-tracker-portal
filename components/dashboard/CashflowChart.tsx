"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      border: {
        dash: [4, 4],
      },
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
      align: "end" as const,
    },
  },
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const generateRandomData = () => {
  return months.map(() => ({
    income: Math.floor(Math.random() * 8000) + 4000,
    expense: Math.floor(Math.random() * 6000) + 2000,
  }));
};

export const CashflowChart = () => {
  const data = generateRandomData();

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: data.map((d) => d.income),
        backgroundColor: "#1B3B36",
        borderRadius: 4,
      },
      {
        label: "Expense",
        data: data.map((d) => -d.expense),
        backgroundColor: "#E5E7EB",
        borderRadius: 4,
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
};
