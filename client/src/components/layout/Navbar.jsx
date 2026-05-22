import { useSelector } from 'react-redux'
import { Calendar } from 'lucide-react'
import { useLocation } from 'react-router-dom'

function Navbar() {
  const { user } = useSelector(state => state.auth)
  const location = useLocation()

  // Format page title from pathname
  const path = location.pathname.substring(1)
  const pageTitle = path.charAt(0).toUpperCase() + path.slice(1) || 'Dashboard'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })

  return (
    <nav className="glass-panel px-6 py-4 flex justify-between items-center z-10 sticky top-0 transition-colors duration-500">
      <div className="flex flex-col">
        <h1 className="text-[16px] font-bold text-primary tracking-wide">{pageTitle}</h1>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-secondary/70 uppercase tracking-widest mt-0.5">
          <Calendar size={12} />
          {today}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user && (
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200 transition-colors">
            <div className="text-right hidden md:block">
              <p className="font-semibold text-sm text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-ai p-[2px]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-ai-start">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar