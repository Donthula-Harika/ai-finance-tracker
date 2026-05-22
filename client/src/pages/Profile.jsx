import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock, Shield, Activity, TrendingUp, TrendingDown, Layers, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { updateProfileThunk } from '../redux/slices/authSlice'
import { changePassword, getAccountStats } from '../services/authService'
import { formatCurrency } from '../utils/format'

function Profile() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [stats, setStats] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)

  useEffect(() => {
    if (user) setProfile({ name: user.name, email: user.email })
    getAccountStats().then((response) => setStats(response.data.data)).catch(console.error)
  }, [user])

  const showNotification = (msg, isErr = false) => {
    if (isErr) {
      setError(msg)
      setMessage('')
    } else {
      setMessage(msg)
      setError('')
    }
    setTimeout(() => {
      setMessage('')
      setError('')
    }, 4000)
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await dispatch(updateProfileThunk(profile)).unwrap()
      showNotification('Profile updated successfully.')
    } catch (err) {
      showNotification(err || 'Unable to update profile.', true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const savePassword = async (event) => {
    event.preventDefault()
    setIsSubmittingPassword(true)
    try {
      await changePassword(passwords)
      setPasswords({ currentPassword: '', newPassword: '' })
      showNotification('Password changed successfully.')
    } catch (err) {
      showNotification(err.response?.data?.message || 'Unable to change password.', true)
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-2">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary flex items-center gap-2">
            <User className="text-ai-start" size={24} />
            Profile Settings
          </h2>
          <p className="mt-1 text-secondary text-base">Manage your account details and security preferences.</p>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700 shadow-sm flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <p className="font-medium">{message}</p>
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 shadow-sm flex items-center gap-3">
            <AlertCircle size={18} className="text-rose-500 shrink-0" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-glow-ai hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-ai-light/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            
            <h3 className="text-lg font-display font-bold text-primary mb-6 flex items-center gap-2 relative z-10">
              <User size={18} className="text-ai-start" />
              Personal Information
            </h3>
            
            <form onSubmit={saveProfile} className="space-y-6 relative z-10">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      value={profile.name} 
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                      className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-ai-start/50 focus:border-ai-start transition-all" 
                      placeholder="Your Name" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                      className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-ai-start/50 focus:border-ai-start transition-all" 
                      placeholder="your.email@example.com" 
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white shadow-md hover:shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 md:p-8 transition-all duration-300 hover:shadow-glass hover:-translate-y-1"
          >
            <h3 className="text-lg font-display font-bold text-primary mb-6 flex items-center gap-2">
              <Shield size={18} className="text-secondary" />
              Security Settings
            </h3>
            
            <form onSubmit={savePassword} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      value={passwords.currentPassword} 
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} 
                      className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all" 
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      minLength="6" 
                      value={passwords.newPassword} 
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} 
                      className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all" 
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <button 
                  disabled={isSubmittingPassword}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 px-6 py-3 font-semibold text-slate-700 shadow-sm hover:shadow-md hover:bg-white transition-all disabled:opacity-50"
                >
                  {isSubmittingPassword ? <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin" /> : <Lock size={16} />}
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>
        </section>

        <section className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 overflow-hidden relative transition-all duration-300 hover:shadow-glow-ai hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-ai-light/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-ai p-0.5 shadow-glow-ai shrink-0">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-ai uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-primary">{user?.name || 'User'}</h3>
                <p className="text-sm text-secondary">{user?.email}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 transition-all duration-300 hover:shadow-glow-finance hover:-translate-y-1"
          >
            <h3 className="text-lg font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity size={18} className="text-finance-dark" />
              All-time Statistics
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                    <Activity size={16} />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Total Transactions</p>
                </div>
                <p className="text-lg font-bold text-slate-900">{stats?.transactionCount || 0}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-white border border-finance-start/20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-finance-start/10 text-finance-dark">
                    <TrendingUp size={16} />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Total Income</p>
                </div>
                <p className="text-lg font-bold text-finance-dark">{formatCurrency(stats?.totalIncome || 0)}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-white border border-ai-light/20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ai-light/10 text-ai-start">
                    <TrendingDown size={16} />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Total Expenses</p>
                </div>
                <p className="text-lg font-bold text-ai-start">{formatCurrency(stats?.totalExpense || 0)}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-finance-light border border-finance-start/30 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/60 shadow-sm text-finance-dark">
                    <Layers size={16} />
                  </div>
                  <p className="text-sm font-medium text-finance-dark">Net Savings</p>
                </div>
                <p className="text-lg font-bold text-finance-dark">{formatCurrency(stats?.savings || 0)}</p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}

export default Profile