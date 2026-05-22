import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'

const ICON_MAP = {
  'Total Income': TrendingUp,
  'Total Expense': TrendingDown,
  'Remaining Budget': Wallet,
  'Savings': PiggyBank,
}

const COLOR_MAP = {
  green: {
    bg: 'bg-[#d1fae5]',
    text: 'text-[#059669]',
    glow: 'bg-[#a7f3d0]/30'
  },
  red: {
    bg: 'bg-[#fce7f3]',
    text: 'text-[#e11d48]',
    glow: 'bg-[#fbcfe8]/30'
  },
  blue: {
    bg: 'bg-[#dbeafe]',
    text: 'text-[#2563eb]',
    glow: 'bg-[#bfdbfe]/30'
  },
  slate: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    glow: 'bg-slate-200/30'
  }
}

function SummaryCard({ label, value, tone = 'slate', trend }) {
  const Icon = ICON_MAP[label] || Wallet
  const isPositive = trend > 0
  const isNeutral = trend === 0

  const iconBg = COLOR_MAP[tone].bg
  const iconColor = COLOR_MAP[tone].text
  const glow = COLOR_MAP[tone].glow

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative overflow-hidden p-6 glass-card group cursor-default transition-colors"
    >
      {/* Dynamic ambient glow */}
      <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[40px] pointer-events-none transition-transform duration-700 group-hover:scale-150 ${glow}`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.03)] ${iconBg} ${iconColor}`}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-slate-500 transition-colors">{label}</p>
        </div>
      </div>
      
      <p className="text-[32px] font-display font-bold relative z-10 text-primary mb-1 mt-3 tracking-tight transition-colors">{value}</p>
      
      {trend && (
        <div className="mt-3 flex items-center gap-2 text-[11px] relative z-10">
          <span className={`flex items-center font-bold px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 
            isNeutral ? 'bg-slate-50 text-slate-600' : 
            'bg-rose-50 text-rose-600'
          }`}>
            {isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
            {Math.abs(trend)}%
          </span>
          <span className="text-slate-400 font-medium transition-colors">vs last month</span>
        </div>
      )}
    </motion.div>
  )
}

export default SummaryCard