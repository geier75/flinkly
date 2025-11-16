import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface GigViewsChartProps {
  data: Array<{ date: string; views: number }>;
}

export default function GigViewsChart({ data }: GigViewsChartProps) {
  // Transform data for Recharts
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("de-DE", { month: "short", day: "numeric" }),
    views: item.views,
  }));

  return (
    <div className="w-full h-80 bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Gig-Views über Zeit</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Line type="monotone" dataKey="views" stroke="#ff6b35" strokeWidth={3} dot={{ fill: "#ff6b35", r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
