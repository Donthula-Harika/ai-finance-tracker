import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { 
  LayoutDashboard, 
  ReceiptText, 
  ArrowLeftRight, 
  Wallet,
  Settings,
  LogOut,
  Star,
} from 'lucide-react'
import { logout } from '../../redux/slices/authSlice'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/budget', label: 'Budget & Goals', icon: Wallet },
  { path: '/reports', label: 'AI Reports', icon: ReceiptText },
  { path: '/profile', label: 'Settings', icon: Settings },
]

function Sidebar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <aside className="w-[260px] h-screen sidebar-dock flex flex-col relative transition-colors duration-500 overflow-hidden shadow-[15px_0_40px_rgba(133,15,55,0.06)] border-r border-white/40">
      
      {/* --- AESTHETIC BACKGROUND DESIGN --- */}
      {/* Top right glowing orb */}
      <div className="absolute top-24 -right-16 w-56 h-56 bg-gradient-to-br from-[#f6c4c4]/40 to-transparent blur-[40px] rounded-full pointer-events-none z-0 transition-colors duration-1000" />
      {/* Mid-left deep pink aura */}
      <div className="absolute top-[45%] -left-24 w-72 h-72 bg-gradient-to-tr from-[#850f37]/15 to-[#e66983]/15 blur-[50px] rounded-full pointer-events-none z-0 transition-colors duration-1000" />

      {/* TOP SECTION: Logo */}
      <div className="pt-10 px-6 relative z-10 flex items-center justify-center gap-2 mb-6">
        <Star size={16} className="text-[#e66983] animate-pulse transition-colors" />
        <h1 className="text-[28px] font-display font-bold text-black tracking-tight">FinFlow</h1>
        <Star size={12} className="text-[#e66983] opacity-60 transition-colors" />
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 px-4 py-4 space-y-2 relative z-10">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = location.pathname === item.path

          return (
            <div key={item.path} className="relative">
              {/* Active Tab Glow/Indicator behind the link */}
              {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#e66983]/20 to-transparent rounded-[16px] blur-sm transition-all" />
              )}
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3.5 px-4 py-3 rounded-[16px] sidebar-hover font-medium group overflow-hidden transition-colors ${
                  active ? 'text-white sidebar-active-tab' : 'text-[#3b82f6] hover:text-blue-600'
                }`}
              >
                <div className="relative z-10 flex items-center gap-3.5 w-full">
                  <Icon size={16} className={active ? "text-white" : "text-[#3b82f6] group-hover:text-blue-600 transition-colors"} strokeWidth={active ? 2.5 : 2} />
                  <span className={`text-[12px] tracking-wide ${active ? 'font-bold' : ''}`}>{item.label}</span>
                </div>
              </Link>
            </div>
          )
        })}
      </nav>

      {/* LOGOUT BUTTON */}
      <div className="px-5 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2.5 w-full px-4 py-3.5 rounded-[14px] text-[12px] font-bold text-white bg-white/10 border border-white/20 shadow-sm hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden backdrop-blur-md"
        >
          <LogOut size={15} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform relative z-10 opacity-90" />
          <span className="relative z-10 tracking-wide uppercase transition-colors">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar