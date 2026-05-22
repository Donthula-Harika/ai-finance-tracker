import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Area,
  AreaChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts'
import { motion } from 'framer-motion'
import { Sparkles, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import SummaryCard from '../components/dashboard/SummaryCard'
import { getDashboardSummary } from '../services/dashboardService'
import { formatCurrency, formatDate } from '../utils/format'

const COLORS = ['#850f37', '#e66983', '#f6c4c4', '#afcab8', '#043f34'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 shadow-xl transition-colors">
        <p className="font-semibold text-slate-800 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600 capitalize">{entry.name}:</span>
            <span className="font-bold text-slate-900">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardSummary()
      .then((response) => setSummary(response.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-ai-start/30 border-t-ai-start rounded-full animate-spin" />
    </div>
  )
  
  if (error) return (
    <div className="glass-panel border-rose-200 bg-rose-50/80 p-6 text-rose-700 max-w-lg mx-auto mt-10">
      <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
      <p>{error}</p>
    </div>
  )

  const trend = summary.monthlyTrend || []
  const categories = summary.categoryBreakdown || []
  const incomeExpense = trend.map((item) => ({ month: item.month, Income: item.income, Expense: item.expense }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

  return (
    <motion.div 
      className="space-y-5 md:space-y-6 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* AI Hero Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[32px] bg-white shadow-glass p-1 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f7f0e4] via-[#f6c4c4]/40 to-[#e66983]/10 pointer-events-none transition-colors" />
        <div className="absolute -bottom-32 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-[#e66983]/30 to-[#ead5df]/60 blur-[100px] rounded-full transition-colors" />
        <div className="absolute top-10 right-[40%] w-48 h-48 bg-[#f6c4c4]/40 blur-[80px] rounded-full transition-colors" />
        
        {/* Soft abstract landscape element */}
        <div className="absolute bottom-0 right-0 w-full h-40 opacity-40 pointer-events-none transition-colors">
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-[#e66983]/20">
            <path d="M0,100 C150,80 300,120 500,60 C700,0 850,80 1000,40 L1000,100 Z" />
          </svg>
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full absolute bottom-0 fill-[#850f37]/10 translate-y-4">
            <path d="M0,100 C200,60 400,100 600,40 C800,-20 900,60 1000,20 L1000,100 Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-primary mb-2 transition-colors">Good Evening, Harika 👋</h2>
            <p className="text-secondary text-[14px] flex items-center gap-2 transition-colors">
              <TrendingDown size={18} className="text-ai-mid transition-colors" />
              Your spending dropped <span className="font-semibold text-ai-start transition-colors">12%</span> this month.
            </p>
            <p className="text-secondary text-base mt-1 transition-colors">
              AI predicts <span className="font-semibold text-ai-start transition-colors">₹8,000</span> possible savings for you.
            </p>
          </div>
          <div className="glass-panel p-6 border border-[rgba(230,105,131,0.15)] bg-white/70 shadow-[0_12px_30px_rgba(133,15,55,0.08)] flex flex-col items-center gap-2 w-72 text-center hover:-translate-y-1 transition-all cursor-default relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f6c4c4]/40 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 transition-colors" />
            <div className="flex items-center gap-2 text-xs font-bold text-[#c53b66] uppercase tracking-widest mb-1 relative z-10 transition-colors">
              <Sparkles size={16} />
              AI Recommendation
            </div>
            <p className="text-[13px] text-secondary leading-relaxed font-medium relative z-10 transition-colors">We found <span className="font-bold text-[#c53b66] text-[15px] transition-colors">₹8,000</span><br />in possible savings for you this month.</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total Income" value={formatCurrency(summary.totalIncome)} tone="green" trend={4.2} />
        <SummaryCard label="Total Expense" value={formatCurrency(summary.totalExpense)} tone="red" trend={-1.5} />
        <SummaryCard label="Remaining Budget" value={formatCurrency(summary.budgetRemaining)} tone="blue" trend={12.4} />
        <SummaryCard label="Savings" value={formatCurrency(summary.savings)} tone="slate" trend={8.1} />
      </motion.div>

      <div className="grid gap-5 xl:grid-cols-3">
        <motion.section variants={itemVariants} className="glass-card p-5 xl:col-span-2 relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#f6c4c4]/20 blur-[80px] rounded-full pointer-events-none transition-colors" />
          <h3 className="text-[15px] font-bold text-primary mb-6 transition-colors">Monthly Spending Trend</h3>
          <div className="h-[300px] w-full relative z-10 pt-4 pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 30, left: 15, bottom: 25 }}>
                <defs>
                  <linearGradient id="colorExpenseArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e66983" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#ead5df" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(230,105,131,0.15)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#850f37', fontSize: 11, fontWeight: 600, opacity: 0.8 }} 
                  dy={10} 
                  label={{ value: 'Month', position: 'insideBottom', offset: -15, fill: '#850f37', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#850f37', fontSize: 11, fontWeight: 600, opacity: 0.8 }} 
                  tickFormatter={(value) => `₹${value / 1000}k`} 
                  label={{ value: 'Amount', angle: -90, position: 'insideLeft', offset: 5, fill: '#850f37', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  name="Expense"
                  stroke="#c53b66" 
                  strokeWidth={3.5}
                  fill="url(#colorExpenseArea)"
                  dot={{ r: 4.5, strokeWidth: 2, fill: '#fff', stroke: '#c53b66' }}
                  activeDot={{ r: 7, strokeWidth: 4, fill: '#fff', stroke: '#850f37' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="glass-card p-5">
          <h3 className="text-[14px] font-bold text-primary mb-6 uppercase tracking-wider transition-colors">Category Distribution</h3>
          <div className="h-[300px] w-full flex justify-center pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                <Pie 
                  data={categories} 
                  dataKey="amount" 
                  nameKey="category" 
                  innerRadius={65} 
                  outerRadius={90}
                  paddingAngle={3}
                  stroke="none"
                >
                  {categories.map((entry, index) => (
                    <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#850f37', fontWeight: 600, paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <motion.section variants={itemVariants} className="glass-card p-5 xl:col-span-2">
          <h3 className="text-[15px] font-bold text-primary mb-6 uppercase tracking-wider transition-colors">Income vs Expense</h3>
          <div className="h-[300px] w-full pt-4 pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeExpense} margin={{ top: 10, right: 30, left: 15, bottom: 25 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(230,105,131,0.15)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#850f37', fontSize: 11, fontWeight: 600, opacity: 0.8 }} 
                  dy={10} 
                  label={{ value: 'Month', position: 'insideBottom', offset: -15, fill: '#850f37', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#850f37', fontSize: 11, fontWeight: 600, opacity: 0.8 }} 
                  tickFormatter={(value) => `₹${value / 1000}k`} 
                  label={{ value: 'Amount', angle: -90, position: 'insideLeft', offset: 5, fill: '#850f37', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#850f37', fontWeight: 600, paddingBottom: '10px' }} />
                <Bar dataKey="Income" fill="url(#colorIncomeGradient)" radius={[6, 6, 6, 6]} barSize={14}>
                  <Cell fill="#043f34" />
                </Bar>
                <Bar dataKey="Expense" fill="url(#colorExpenseGradient)" radius={[6, 6, 6, 6]} barSize={14}>
                  <Cell fill="#e66983" />
                </Bar>
                <defs>
                  <linearGradient id="colorIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b6e5d2" />
                    <stop offset="100%" stopColor="#71967d" />
                  </linearGradient>
                  <linearGradient id="colorExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f6c4c4" />
                    <stop offset="100%" stopColor="#c53b66" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="glass-card p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-bold text-primary uppercase tracking-wider transition-colors">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {summary.recentTransactions?.length ? summary.recentTransactions.map((item, i) => (
              <motion.div 
                key={item._id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between rounded-xl p-3 bg-white/40 border border-transparent hover:border-[rgba(230,105,131,0.12)] hover:shadow-[0_12px_30px_rgba(133,15,55,0.06)] cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl shadow-sm ${item.type === 'income' ? 'bg-[#d1fae5] text-[#059669]' : 'bg-[#fce7f3] text-[#e11d48]'}`}>
                    {item.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  </div>
                  <div>
                    <p className="font-bold text-[13px] text-primary leading-tight mb-0.5 transition-colors">{item.title}</p>
                    <p className="text-[10px] text-[#850f37]/60 font-semibold uppercase tracking-wider transition-colors">{item.category}</p>
                  </div>
                </div>
                <p className={`font-display font-bold text-[14px] ${item.type === 'income' ? 'text-[#059669]' : 'text-primary'} transition-colors`}>
                  {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                </p>
              </motion.div>
            )) : <p className="text-sm text-secondary/70 text-center py-8">No recent activity.</p>}
          </div>
        </motion.section>
      </div>
    </motion.div>
  )
}

export default Dashboard