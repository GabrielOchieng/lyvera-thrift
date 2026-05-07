"use client";
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface InventoryPieChartProps {
  active: number;
  sold: number;
}

// Define the colors outside the component to prevent re-renders
const COLORS = ["#8B1A4F", "#e2e8f0"];

const renderCustomSector = (props: any) => {
  const { fill, ...rest } = props;
  // We use the index passed by Recharts to pick the correct color
  return <Sector {...rest} fill={COLORS[props.index % COLORS.length]} />;
};

export default function InventoryPieChart({
  active,
  sold,
}: InventoryPieChartProps) {
  const data = [
    { name: "Available", value: active || 0 },
    { name: "Sold", value: sold || 0 },
  ];

  return (
    <div className="h-80 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              fontSize: "12px",
            }}
          />
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={8}
            stroke="none"
            // Use 'shape' instead of mapping <Cell />
            shape={renderCustomSector}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs font-medium text-zinc-600 px-2">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
