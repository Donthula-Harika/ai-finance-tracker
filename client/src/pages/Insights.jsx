import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Sparkles, BrainCircuit, RefreshCw, TrendingUp, AlertTriangle } from 'lucide-react'
import { fetchInsights, fetchPrediction } from '../redux/slices/insightSlice'
import { formatCurrency } from '../utils/format'

function Insights() {
  const dispatch = useDispatch()
  const { insights, predictions, provider, loading, error } = useSelector(state => state.insights)

  useEffect(() => {
    dispatch(fetchInsights())
    dispatch(fetchPrediction())
  }, [dispatch])

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
      className="space-y-6 pb-10 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-ai">
            AI Lab for Personal Finance
          </h2>
          <p className="mt-1 text-secondary text-base">
            Intelligent analysis and forecasting powered by {provider || 'our AI engine'}.
          </p>
        </div>
        <button
          onClick={() => { dispatch(fetchInsights()); dispatch(fetchPrediction()) }}
          className="flex items-center gap-2 rounded-xl bg-white border border-ai-mid/30 px-6 py-3 font-semibold text-ai-start shadow-sm hover:shadow-glow-ai hover:border-ai-start hover:bg-ai-start/5 transition-all duration-300"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh Analysis
        </button>
      </div>

      {error && (
        <motion.div variants={itemVariants} className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 flex items-center gap-3">
          <AlertTriangle size={18} />
          {error}
        </motion.div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.section variants={itemVariants} className="glass-card p-6 xl:col-span-2 relative overflow-hidden group hover:shadow-glow-ai transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-ai opacity-10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 group-hover:opacity-20 transition-opacity duration-500" />
          
          <div className="mb-6 flex items-center justify-between relative z-10">
            <h3 className="text-lg font-display font-bold text-primary flex items-center gap-2">
              <BrainCircuit className="text-ai-mid" size={20} />
              Intelligent Recommendations
            </h3>
            <span className="rounded-full bg-ai-light/20 border border-ai-light/30 px-3 py-1.5 text-xs font-semibold capitalize text-ai-start flex items-center gap-1.5">
              <Sparkles size={12} />
              {provider || 'heuristic'} engine
            </span>
          </div>

          {loading ? (
            <div className="space-y-4 relative z-10">
              {[1, 2, 3].map((i) => (
                 <div key={i} className="animate-pulse flex gap-4 p-4 rounded-2xl bg-white/50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-200/50 shrink-0" />
                  <div className="space-y-2 flex-1 py-1">
                    <div className="h-4 bg-slate-200/50 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-200/50 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 relative z-10">
              {insights.length ? insights.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={`${item}-${index}`} 
                  className="rounded-2xl border border-ai-light/30 bg-white/80 p-5 text-slate-800 flex items-start gap-4 hover:shadow-glow-ai hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="p-2.5 rounded-xl bg-ai-light/20 shadow-sm text-ai-start shrink-0 mt-0.5">
                    <Sparkles size={18} />
                  </div>
                  <p className="leading-relaxed font-medium text-primary text-sm">{item}</p>
                </motion.div>
              )) : (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl bg-white/50">
                  Add more transactions for our AI to analyze your spending patterns and generate insights.
                </div>
              )}
            </div>
          )}
        </motion.section>

        <motion.section variants={itemVariants} className="glass-card p-6 relative overflow-hidden flex flex-col hover:shadow-glow-finance transition-all duration-300">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-finance-start/20 blur-3xl rounded-full translate-y-1/3 -translate-x-1/3" />
          
          <h3 className="text-lg font-display font-bold text-primary mb-6 flex items-center gap-2 relative z-10">
            <TrendingUp className="text-finance-dark" size={20} />
            Spending Forecast
          </h3>

          <div className="flex-1 flex flex-col justify-center relative z-10">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-2">Predicted Expense</p>
              <p className="text-4xl font-display font-bold text-primary tracking-tight">
                {formatCurrency(predictions.predictedExpense || 0)}
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white border border-white/80 shadow-glass hover:shadow-glow-ai transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-semibold text-slate-600">Model Confidence</p>
                  <p className="text-sm font-bold text-ai-start">{predictions.confidence || 0}%</p>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${predictions.confidence || 0}%` }}
                    transition={{ duration: 1, delay: 0.5, type: "spring" }}
                    className="h-full bg-gradient-ai rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
              </div>

              {predictions.budgetRisk && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800 flex gap-3 shadow-sm"
                >
                  <AlertTriangle size={20} className="text-rose-500 shrink-0" />
                  <p className="font-medium leading-tight">
                    <strong className="block text-rose-600 mb-0.5">Budget Risk Detected</strong>
                    Predicted spending is above your monthly budget capacity.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  )
}

export default Insights