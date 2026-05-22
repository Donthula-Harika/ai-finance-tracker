import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="flex h-screen bg-background text-primary overflow-hidden font-sans relative">
      {/* Background Blobs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#f6c4c4] opacity-[0.35] blur-[150px] pointer-events-none transition-colors duration-1000" />
      <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[70%] rounded-full bg-[#ead5df] opacity-[0.4] blur-[130px] pointer-events-none transition-colors duration-1000" />
      <div className="absolute top-[30%] right-[30%] w-[40%] h-[40%] rounded-full bg-[#e66983] opacity-[0.15] blur-[140px] pointer-events-none transition-colors duration-1000" />

      <div className="h-full flex relative z-20">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col relative z-10 w-[calc(100%-260px)]">
        <Navbar />
        <main className="flex-1 overflow-auto p-6 md:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout