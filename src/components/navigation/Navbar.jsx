// src/components/navigation/Navbar.jsx
import { useLocation } from 'react-router-dom'
import { menuItems } from './menuConfig' // 🛠 Markaziy massivni import qilamiz
import { Bell } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  const activeItem = menuItems.find(item => item.url === location.pathname)
  const currentTitle = activeItem ? activeItem.name : 'Restoran'

  return (
    <header className="w-full h-16 bg-white/10 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 rounded-b-xl shadow-lg z-30 shrink-0">
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">
          {currentTitle}
        </h1>
      </div>
      
      <div className="flex items-center gap-4 text-white">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>
        
      </div>
    </header>
  )
}
