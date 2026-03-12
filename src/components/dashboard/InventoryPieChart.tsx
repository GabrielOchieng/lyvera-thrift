"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export default function InventoryPieChart({
  active,
  sold,
}: {
  active: number;
  sold: number;
}) {
  const data = [
    { name: "Available", value: active },
    { name: "Sold", value: sold },
  ];
  const COLORS = ["#800000", "#e2e8f0"];

  return (
    <div className="h-75 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
