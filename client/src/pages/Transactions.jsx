import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Edit2,
  Trash2,
  Coffee,
  ShoppingBag,
  Home,
  Car,
  Briefcase,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import {
  fetchTransactions,
  removeTransactionById,
  saveTransaction
} from '../redux/slices/transactionSlice'

import {
  categories,
  formatCurrency,
  formatDate,
  paymentMethods
} from '../utils/format'

const emptyForm = {
  type: 'expense',
  title: '',
  amount: '',
  category: 'Food',
  paymentMethod: 'upi',
  description: '',
  transactionDate: new Date().toISOString().slice(0, 10)
}

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'food': return <Coffee size={20} />;
    case 'shopping': return <ShoppingBag size={20} />;
    case 'housing': return <Home size={20} />;
    case 'transport': return <Car size={20} />;
    case 'salary': return <Briefcase size={20} />;
    case 'utilities': return <Smartphone size={20} />;
    default: return <ShoppingBag size={20} />;
  }
}

function Transactions() {
  const dispatch = useDispatch()

  const {
    transactions,
    pagination,
    loading,
    error
  } = useSelector((state) => state.transactions)

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    sort: 'latest',
    page: 1
  })

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [activeMenu, setActiveMenu] = useState(null)

  const query = useMemo(() => ({
    ...filters,
    limit: 10
  }), [filters])

  useEffect(() => {
    dispatch(fetchTransactions(query))
  }, [dispatch, query])

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1
    }))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      sort: 'latest',
      page: 1
    })
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditingId(item._id)

    setForm({
      type: item.type,
      title: item.title,
      amount: item.amount,
      category: item.category,
      paymentMethod: item.paymentMethod,
      description: item.description || '',
      transactionDate: item.transactionDate?.slice(0, 10)
    })

    setShowForm(true)
    setActiveMenu(null)
  }

  const closeModal = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const submitForm = async (event) => {
    event.preventDefault()

    try {
      const payload = editingId
        ? { id: editingId, data: form }
        : { data: form }

      await dispatch(saveTransaction(payload)).unwrap()

      setMessage(
        editingId
          ? 'Transaction updated successfully.'
          : 'Transaction added successfully.'
      )

      closeModal()

      dispatch(fetchTransactions(query))
    } catch (err) {
      setMessage(err || 'Something went wrong.')
    }
  }

  const deleteItem = async (item) => {
    setActiveMenu(null)
    const confirmDelete = window.confirm(
      `Delete "${item.title}" transaction?`
    )

    if (!confirmDelete) return

    try {
      await dispatch(removeTransactionById(item._id)).unwrap()
      setMessage('Transaction deleted successfully.')
      dispatch(fetchTransactions(query))
    } catch (err) {
      setMessage(err || 'Unable to delete transaction.')
    }
  }

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id)
  }

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary">
            Transactions
          </h2>
          <p className="mt-1 text-secondary text-base">
            Manage and track your income and expenses.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-gradient-ai px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      <section className="glass-panel p-4 bg-white/70">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full rounded-xl border border-white/40 bg-white/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ai-start/50 focus:border-ai-start transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/40 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ai-start/50 pr-8"
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            <div className="relative group flex-1 md:flex-none">
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/40 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ai-start/50 pr-8"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            <div className="relative group flex-1 md:flex-none">
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/40 bg-white/50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ai-start/50 pr-8"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_desc">Highest Amount</option>
                <option value="amount_asc">Lowest Amount</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>

            <button
              onClick={resetFilters}
              className="flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 text-sm font-medium transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {(error || message) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border p-4 text-sm ${
            error
              ? 'border-rose-200 bg-rose-50/80 text-rose-700'
              : 'border-emerald-200 bg-emerald-50/80 text-emerald-700'
          }`}
        >
          {error || message}
        </motion.div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-ai-start/30 border-t-ai-start rounded-full animate-spin" />
          </div>
        ) : transactions?.length ? (
          transactions.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.8)' }}
              key={item._id}
              className="glass-card flex flex-col md:flex-row md:items-center justify-between p-5 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${
                  item.type === 'income' 
                    ? 'bg-finance-start/10 text-finance-dark border border-finance-start/20' 
                    : 'bg-ai-light/10 text-ai-start border border-ai-light/20'
                }`}>
                  {getCategoryIcon(item.category)}
                </div>
                
                <div>
                  <h4 className="font-semibold text-base text-primary group-hover:text-ai-mid transition-colors">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-secondary/80">{item.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-sm text-secondary/60">{formatDate(item.transactionDate)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block"></span>
                    <span className="text-[11px] uppercase font-bold text-secondary/60 bg-white/60 px-2.5 py-0.5 rounded-md hidden md:block border border-slate-100">
                      {item.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 mt-4 md:mt-0 pl-16 md:pl-0">
                <div className="text-right">
                  <p className={`text-lg font-display font-bold ${
                    item.type === 'income' ? 'text-finance-dark' : 'text-primary'
                  }`}>
                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                  </p>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => toggleMenu(item._id)}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>

                  <AnimatePresence>
                    {activeMenu === item._id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-36 glass-panel border border-white/60 shadow-xl overflow-hidden z-20"
                      >
                        <button
                          onClick={() => openEdit(item)}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => deleteItem(item)}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="glass-panel p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <Search className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">No transactions found</h3>
            <p className="text-slate-500 mt-2 max-w-sm">We couldn't find any transactions matching your current filters. Try adjusting them or add a new transaction.</p>
          </div>
        )}
      </div>

      {pagination?.pages > 1 && (
        <div className="flex items-center justify-between glass-panel px-6 py-4 mt-6">
          <p className="text-sm font-medium text-slate-500">
            Page <span className="text-slate-800">{pagination?.page}</span> of <span className="text-slate-800">{pagination?.pages}</span>
          </p>

          <div className="flex gap-2">
            <button
              disabled={pagination?.page <= 1}
              onClick={() => updateFilter('page', filters.page - 1)}
              className="p-2 rounded-xl border border-white/40 bg-white/50 hover:bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              disabled={pagination?.page >= pagination?.pages}
              onClick={() => updateFilter('page', filters.page + 1)}
              className="p-2 rounded-xl border border-white/40 bg-white/50 hover:bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-xl rounded-3xl bg-white/90 backdrop-blur-xl border border-white shadow-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-ai opacity-5 pointer-events-none" />
              
              <div className="mb-8 flex items-center justify-between relative z-10">
                <h3 className="text-2xl font-display font-bold text-slate-900">
                  {editingId ? 'Edit Transaction' : 'New Transaction'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={submitForm} className="space-y-5 relative z-10">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ai-start/50 focus:border-ai-start transition-all"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        required
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-4 py-3 outline-none focus:ring-2 focus:ring-ai-start/50 focus:border-ai-start transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      placeholder="E.g., Grocery shopping"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ai-start/50 focus:border-ai-start transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ai-start/50 focus:border-ai-start transition-all"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      required
                      value={form.transactionDate}
                      onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-ai-start/50 focus:border-ai-start transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-ai px-4 py-4 font-semibold text-white shadow-lg hover:shadow-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                       <span className="flex items-center justify-center gap-2">
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                         Saving...
                       </span>
                    ) : editingId ? 'Update Transaction' : 'Save Transaction'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Transactions