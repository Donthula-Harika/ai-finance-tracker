import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, Target, AlertCircle, PieChart, Info } from 'lucide-react'
import { fetchBudget, saveBudget } from '../redux/slices/budgetSlice'
import { getDashboardSummary } from '../services/dashboardService'
import { categories, formatCurrency } from '../utils/format'

function Budget() {
  const dispatch = useDispatch()
  const budget = useSelector(state => state.budget)
  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [categoryBudgets, setCategoryBudgets] = useState([])
  const [summary, setSummary] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    dispatch(fetchBudget())
    getDashboardSummary().then((response) => setSummary(response.data.data))
  }, [dispatch])

  useEffect(() => {
    setMonthlyBudget(budget.monthlyBudget)
    setCategoryBudgets(budget.categories)
  }, [budget.monthlyBudget, budget.categories])

  const addCategory = () => {
    setCategoryBudgets([...categoryBudgets, { category: 'Food', limit: 0 }])
  }

  const updateCategory = (index, field, value) => {
    setCategoryBudgets(categoryBudgets.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: field === 'limit' ? Number(value) : value } : item
    )))
  }

  const removeCategory = (index) => {
    setCategoryBudgets(categoryBudgets.filter((_, itemIndex) => itemIndex !== index))
  }

  const save = async (event) => {
    event.preventDefault()
    setMessage('')
    try {
      await dispatch(saveBudget({ monthlyBudget: Number(monthlyBudget), categoryBudgets })).unwrap()
      const response = await getDashboardSummary()
      setSummary(response.data.data)
      setMessage('Budget saved successfully.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      // handled by redux slice error state
    }
  }

  const totalExpense = summary?.totalExpense || 0
  const remaining = Number(monthlyBudget || 0) - totalExpense
  const usedPercent = monthlyBudget > 0 ? Math.min(100, Math.round((totalExpense / monthlyBudget) * 100)) : 0

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-2">
            <Target className="text-finance-dark" size={24} />
            Budget Planning
          </h2>
          <p className="mt-1 text-secondary text-base">Set limits and track your monthly spending goals.</p>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            {message}
          </motion.div>
        )}
        {budget.error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 shadow-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {budget.error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 space-y-6">
          <form onSubmit={save} className="glass-card p-6 md:p-8 space-y-8">
            <div>
              <label className="mb-3 block text-sm font-semibold tracking-wider text-slate-500 uppercase">Monthly Overall Budget</label>
              <div className="relative max-w-sm">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">₹</span>
                <input
                  type="number"
                  min="0"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-4 py-4 text-xl font-semibold outline-none focus:ring-2 focus:ring-finance-start/50 focus:border-finance-start transition-all shadow-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-primary flex items-center gap-2">
                  <PieChart className="text-finance-dark" size={20} />
                  Category Limits
                </h3>
                <button 
                  type="button" 
                  onClick={addCategory} 
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-finance-dark transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  Add Limit
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {categoryBudgets.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                      No category limits set. Add one to start tracking specific spending.
                    </motion.div>
                  )}
                  {categoryBudgets.map((item, index) => {
                    const spent = summary?.categoryBreakdown?.find((entry) => entry.category === item.category)?.amount || 0
                    const percent = item.limit ? Math.min(100, Math.round((spent / item.limit) * 100)) : 0
                    const isOver = percent >= 100
                    
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, scale: 1, height: "auto", marginBottom: 16 }}
                        exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                        key={`${item.category}-${index}`} 
                        className="rounded-2xl border border-slate-100 bg-white/70 p-5 group transition-all hover:bg-white hover:shadow-glow-finance hover:-translate-y-1 duration-300 overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row gap-4 md:items-center">
                          <select 
                            value={item.category} 
                            onChange={(e) => updateCategory(index, 'category', e.target.value)} 
                            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-finance-start/50 focus:border-finance-start transition-all"
                          >
                            {categories.map((category) => <option key={category}>{category}</option>)}
                          </select>
                          
                          <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                            <input 
                              type="number" 
                              min="0" 
                              value={item.limit} 
                              onChange={(e) => updateCategory(index, 'limit', e.target.value)} 
                              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-3 outline-none focus:ring-2 focus:ring-finance-start/50 focus:border-finance-start transition-all" 
                              placeholder="Limit amount"
                            />
                          </div>
                          
                          <button 
                            type="button" 
                            onClick={() => removeCategory(index)} 
                            className="p-3 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all md:w-auto"
                            title="Remove"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        <div className="mt-5">
                          <div className="mb-2 flex justify-between items-end">
                            <div className="text-sm">
                              <span className="font-semibold text-slate-900">{formatCurrency(spent)}</span>
                              <span className="text-slate-500 ml-1">of {formatCurrency(item.limit)}</span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${isOver ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                              {percent}%
                            </span>
                          </div>
                          <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.5, type: "spring" }}
                              className={`h-full rounded-full ${isOver ? 'bg-rose-500' : 'bg-gradient-finance'}`} 
                            />
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                disabled={budget.loading} 
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 font-semibold text-white hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 w-full md:w-auto justify-center"
              >
                {budget.loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    Save Budget Plan
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <section className="glass-card p-6 self-start sticky top-6">
          <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Monthly Overview</h3>
          
          <div className="space-y-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60">
              <p className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-2">Total Spent</p>
              <p className="text-4xl font-display font-bold text-slate-900">{formatCurrency(totalExpense)}</p>
              <p className="text-sm text-slate-500 mt-2">of {formatCurrency(monthlyBudget)}</p>
            </div>

            <div>
              <div className="flex justify-between items-end mb-3">
                <p className="text-sm font-semibold text-slate-700">Remaining Budget</p>
                <p className={`text-xl font-bold ${remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatCurrency(remaining)}
                </p>
              </div>
              <div className="h-4 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50 p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${usedPercent}%` }}
                  transition={{ duration: 1, type: "spring" }}
                  className={`h-full rounded-full ${usedPercent >= 100 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                />
              </div>
              <div className="mt-2 text-right">
                <span className="text-xs font-semibold text-slate-500">{usedPercent}% used</span>
              </div>
            </div>

            {remaining < 0 ? (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800 flex gap-3 shadow-sm">
                <AlertCircle size={20} className="text-rose-500 shrink-0" />
                <p className="font-medium leading-tight">
                  <strong className="block text-rose-600 mb-0.5">Over Budget</strong>
                  You have exceeded your monthly budget by {formatCurrency(Math.abs(remaining))}.
                </p>
              </motion.div>
            ) : (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 text-sm text-blue-800 flex gap-3">
                <Info size={20} className="text-blue-500 shrink-0" />
                <p className="font-medium">You're on track! Keep it up to stay within your budget goals this month.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Budget