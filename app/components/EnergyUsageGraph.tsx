"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { month: "Jan", energyUsage: 400 },
  { month: "Feb", energyUsage: 300 },
  { month: "Mar", energyUsage: 200 },
  { month: "Apr", energyUsage: 278 },
  { month: "Mai", energyUsage: 189 },
  { month: "Jun", energyUsage: 239 },
  { month: "Jul", energyUsage: 349 },
  { month: "Aug", energyUsage: 200 },
  { month: "Sep", energyUsage: 278 },
  { month: "Okt", energyUsage: 189 },
  { month: "Nov", energyUsage: 239 },
  { month: "Des", energyUsage: 349 },
];

export function EnergyUsageGraph({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Energiforbruk</CardTitle>
        <CardDescription>Månedlig energiforbruk i kWh</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="energyUsage" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

