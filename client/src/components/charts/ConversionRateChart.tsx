import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface ConversionRateChartProps {
  data: Array<{ gigTitle: string; views: number; orders: number; conversionRate: number }>;
}

export default function ConversionRateChart({ data }: ConversionRateChartProps) {
  // Transform data for Recharts
  const chartData = data.map((item) => ({
    name: item.gigTitle.length > 20 ? item.gigTitle.substring(0, 20) + "..." : item.gigTitle,
    conversionRate: item.conversionRate,
  }));

  // Color gradient based on conversion-rate
  const getColor = (rate: number) => {
    if (rate >= 5) return "#10b981"; // Green (excellent)
    if (rate >= 3) return "#f59e0b"; // Orange (good)
    return "#ef4444"; // Red (needs improvement)
  };

  return (
    <div className="w-full h-80 bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Conversion-Rate nach Gig</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "12px" }} angle={-45} textAnchor="end" height={100} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} label={{ value: "%", angle: -90, position: "insideLeft" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number) => [`${value.toFixed(2)}%`, "Conversion-Rate"]}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Bar dataKey="conversionRate" name="Conversion-Rate" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.conversionRate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
