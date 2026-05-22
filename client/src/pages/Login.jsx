import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Lock } from 'lucide-react'
import { loginUser } from '../redux/slices/authSlice'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const { loading } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await dispatch(loginUser(formData)).unwrap()
      navigate('/dashboard')
    } catch (err) {
      setError(err || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-ai opacity-20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        
        <div className="relative z-10">
          <h1 className="text-4xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-ai flex items-center justify-center shadow-lg shadow-ai-start/50">
              <span className="text-white text-lg font-bold">F</span>
            </div>
            FinFlow
          </h1>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h2 className="text-5xl font-display font-bold text-white leading-[1.1]">
            Track.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-ai">Predict.</span><br/>
            Grow.
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Experience the future of personal finance with our AI-powered operating system. Understand your spending patterns and uncover hidden savings automatically.
          </p>
        </div>
        
        <div className="relative z-10 text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} FinFlow AI. All rights reserved.
        </div>
        
        {/* Floating elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-32 h-32 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-ai-mid/10 backdrop-blur-3xl"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 xl:p-24 relative overflow-hidden">
        {/* Mobile background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-ai opacity-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 lg:hidden" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl font-display font-bold text-slate-900 lg:hidden mb-2">FinFlow</h1>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-2">Enter your details to access your workspace.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 mb-6">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-ai-start/50 focus:border-ai-start transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-ai-start/50 focus:border-ai-start transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex justify-end pt-1">
                <a href="#" className="text-sm font-medium text-ai-start hover:text-ai-mid transition-colors">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-ai px-4 py-4 font-semibold text-white shadow-lg hover:shadow-xl hover:opacity-90 transition-all disabled:opacity-50 mt-4 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in to Workspace
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-slate-900 hover:text-ai-start transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login