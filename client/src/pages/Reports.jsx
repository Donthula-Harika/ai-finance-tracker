import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import { motion } from 'framer-motion'
import { Download, FileText, Calendar, Filter, TrendingUp, TrendingDown, Layers, PieChart } from 'lucide-react'
import { downloadMonthlyReport, getMonthlyReport } from '../services/reportService'
import { formatCurrency, formatDate } from '../utils/format'

function Reports() {
  const now = new Date()
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const params = useMemo(() => period, [period])

  useEffect(() => {
    setLoading(true)
    getMonthlyReport(params)
      .then((response) => setReport(response.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load report'))
      .finally(() => setLoading(false))
  }, [params])

  const exportPdf = async () => {
    try {
      const response = await downloadMonthlyReport(params)
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `fin-track-report-${period.year}-${String(period.month).padStart(2, '0')}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Export failed", err)
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-xl">
          <p className="font-semibold text-slate-800 mb-1">{label}</p>
          <p className="text-ai-start font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-2">
            <FileText className="text-ai-start" size={24} />
            Financial Reports
          </h2>
          <p className="mt-1 text-secondary text-base">Comprehensive analysis and statements for your records.</p>
        </div>
        
        <button 
          onClick={exportPdf} 
          disabled={loading || !report}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          <Download size={18} />
          Export as PDF
        </button>
      </div>

      <section className="glass-panel p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-500 font-medium px-2">
          <Filter size={18} />
          <span>Period:</span>
        </div>
        
        <div className="flex flex-1 gap-3 w-full">
          <div className="relative group flex-1">
            <select 
              value={period.month} 
              onChange={(e) => setPeriod({ ...period, month: Number(e.target.value) })} 
              className="w-full appearance-none rounded-xl border border-white/40 bg-white/60 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-ai-start/50 pr-8 shadow-sm"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1} value={index + 1}>{new Date(2024, index, 1).toLocaleString('en-IN', { month: 'long' })}</option>
              ))}
            </select>
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
          
          <div className="relative group flex-1 max-w-[150px]">
            <input 
              type="number" 
              value={period.year} 
              onChange={(e) => setPeriod({ ...period, year: Number(e.target.value) })} 
              className="w-full rounded-xl border border-white/40 bg-white/60 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-ai-start/50 shadow-sm" 
            />
          </div>
        </div>
      </section>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-ai-start/30 border-t-ai-start rounded-full animate-spin" />
        </div>
      )}
      
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 shadow-sm">
          {error}
        </motion.div>
      )}

      {report && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid gap-4 md:grid-cols-4">
            <div className="glass-card p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow-finance">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-finance-start/20 rounded-full blur-xl" />
              <div className="flex items-center gap-2 text-slate-500 mb-2 relative z-10">
                <TrendingUp size={16} className="text-finance-dark" />
                <p className="text-sm font-semibold tracking-wider uppercase">Total Income</p>
              </div>
              <p className="text-3xl font-display font-bold text-finance-dark relative z-10">{formatCurrency(report.totalIncome)}</p>
            </div>
            
            <div className="glass-card p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow-ai">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-ai-light/40 rounded-full blur-xl" />
              <div className="flex items-center gap-2 text-slate-500 mb-2 relative z-10">
                <TrendingDown size={16} className="text-ai-start" />
                <p className="text-sm font-semibold tracking-wider uppercase">Total Expense</p>
              </div>
              <p className="text-3xl font-display font-bold text-ai-start relative z-10">{formatCurrency(report.totalExpense)}</p>
            </div>
            
            <div className="glass-card p-5 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl" />
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Layers size={16} className="text-blue-500" />
                <p className="text-sm font-semibold tracking-wider uppercase">Net Savings</p>
              </div>
              <p className="text-3xl font-display font-bold text-slate-900">{formatCurrency(report.savings)}</p>
            </div>
            
            <div className="glass-card p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow-ai">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-ai-light/40 rounded-full blur-xl" />
              <div className="flex items-center gap-2 text-slate-500 mb-2 relative z-10">
                <p className="text-sm font-semibold tracking-wider uppercase">Budget Remaining</p>
              </div>
              <p className="text-3xl font-display font-bold text-ai-start relative z-10">{formatCurrency(report.budgetRemaining)}</p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <section className="glass-card p-6 xl:col-span-2 shadow-sm">
              <h3 className="text-lg font-display font-bold text-primary mb-6 flex items-center gap-2">
                <PieChart size={20} className="text-ai-start" />
                Category Breakdown
              </h3>
              <div className="h-[350px] w-full">
                {report.categoryBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.categoryBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="category" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9', opacity: 0.5 }} />
                      <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={50}>
                        {report.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="url(#colorAi)" />
                        ))}
                      </Bar>
                      <defs>
                        <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#850e35" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#ee6983" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    No category data available for this period.
                  </div>
                )}
              </div>
            </section>

            <section className="glass-card p-6 shadow-sm flex flex-col">
              <h3 className="text-lg font-display font-bold text-primary mb-6 flex items-center gap-2">
                <FileText size={20} className="text-ai-start" />
                Recent Transactions
              </h3>
              <div className="flex-1 overflow-auto pr-2 space-y-3 max-h-[350px] custom-scrollbar">
                {report.transactions.length ? report.transactions.map((item) => (
                  <div key={item._id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-primary line-clamp-1 mr-2 text-sm">{item.title}</p>
                      <p className={`font-bold whitespace-nowrap text-sm ${item.type === 'income' ? 'text-finance-dark' : 'text-slate-800'}`}>
                        {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-md">{item.category}</span>
                      <span className="text-slate-400">{formatDate(item.transactionDate)}</span>
                    </div>
                  </div>
                )) : (
                  <div className="py-10 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl">
                    No transactions recorded for this period.
                  </div>
                )}
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Reports