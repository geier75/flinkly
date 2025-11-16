import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number; orders: number }>;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Transform data for Recharts
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("de-DE", { month: "short", day: "numeric" }),
    revenue: item.revenue / 100, // Convert cents to euros
    orders: item.orders,
  }));

  return (
    <div className="w-full h-80 bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Umsatz über Zeit</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
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
            formatter={(value: number, name: string) => {
              if (name === "revenue") return [`${value.toFixed(2)}€`, "Umsatz"];
              return [value, "Bestellungen"];
            }}
          />
          <Legend wrapperStyle={{ color: "#fff" }} />
          <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
