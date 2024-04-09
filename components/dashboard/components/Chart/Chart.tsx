"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {};

const DATA = [
  {
    name: "Jan",
    Payouts: 20,
    Pay_ins: 25,
  },
  {
    name: "Feb",
    Payouts: 40,
    Pay_ins: 30,
  },
  {
    name: "Mar",
    Payouts: 12,
    Pay_ins: 46,
  },
  {
    name: "Apr",
    Payouts: 28,
    Pay_ins: 39,
  },
  {
    name: "May",
    Payouts: 87,
    Pay_ins: 65,
  },
  {
    name: "Jun",
    Payouts: 32,
    Pay_ins: 12,
  },
  {
    name: "Jul",
    Payouts: 11,
    Pay_ins: 6,
  },
  {
    name: "Aug",
    Payouts: 8,
    Pay_ins: 33,
  },
  {
    name: "Sep",
    Payouts: 32,
    Pay_ins: 23,
  },
  {
    name: "Oct",
    Payouts: 22,
    Pay_ins: 11,
  },
  {
    name: "Nov",
    Payouts: 75,
    Pay_ins: 90,
  },
  {
    name: "Dec",
    Payouts: 100,
    Pay_ins: 70,
  },
];

const Chart = (props: Props) => {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={DATA}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" color="#98999A" />
          <YAxis color="#98999A" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Payouts"
            stroke="#1890FF"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="Pay_ins" stroke="#FB8A00" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
