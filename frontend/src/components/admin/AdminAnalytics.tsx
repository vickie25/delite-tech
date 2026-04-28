import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Mon", revenue: 4000, orders: 24 },
  { name: "Tue", revenue: 3000, orders: 13 },
  { name: "Wed", revenue: 5000, orders: 38 },
  { name: "Thu", revenue: 2780, orders: 21 },
  { name: "Fri", revenue: 1890, orders: 19 },
  { name: "Sat", revenue: 6390, orders: 45 },
  { name: "Sun", revenue: 4490, orders: 32 },
];

const pieData = [
  { name: "Electronics", value: 45 },
  { name: "Appliances", value: 30 },
  { name: "Accessories", value: 25 },
];

const COLORS = ["#CA8A04", "#1C1917", "#78716C"];

const AdminAnalytics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Revenue Area Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Growth Performance</p>
            <h3 className="text-lg font-bodoni font-bold text-stone-900 mt-0.5">Revenue Matrix</h3>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-stone-900">KSh 32,450</p>
            <p className="text-[9px] text-green-600 font-bold uppercase">+14% Growth</p>
          </div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CA8A04" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#CA8A04" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F4" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#A8A29E', fontSize: 10}} 
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  fontSize: '11px',
                  fontWeight: '700'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#CA8A04" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRev)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Market Distribution Pie Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm"
      >
        <div className="mb-6">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Asset Distribution</p>
          <h3 className="text-lg font-bodoni font-bold text-stone-900 mt-0.5">Category Split</h3>
        </div>
        <div className="h-48 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] font-bold text-stone-400 uppercase">Total</p>
            <p className="text-xl font-bold text-stone-900">100%</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
