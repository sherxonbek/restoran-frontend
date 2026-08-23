// src/components/navigation/BottomNav.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { menuItems } from './menuConfig'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="md:hidden flex bg-slate-900 text-white w-full rounded-t-2xl fixed bottom-0 left-0 right-0 items-center justify-around h-16 shadow-2xl z-50 border-t border-slate-800">
      {menuItems.map((item) => {
        const isItemActive = location.pathname === item.url
        
        const IconComponent = item.icon 

        return (
          <div 
            key={item.id}
            onClick={() => navigate(item.url)}
            className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer transition-all gap-1 ${
              isItemActive 
                ? "text-emerald-400 font-semibold bg-slate-800/40 rounded-t-xl border-t-2 border-emerald-400" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <IconComponent className="w-5 h-5" /> 
            <span className="text-[10px] tracking-tight">{item.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default BottomNav
