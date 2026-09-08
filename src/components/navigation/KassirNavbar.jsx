import { User, LogOut, Wallet, Banknote, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/userSlice";

export default function KassirNavbar({ todayTotalRevenue = 0, activeBillsCount = 0 }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  const activeUser = currentUser || (() => {
    try {
      return JSON.parse(localStorage.getItem("current_user") || "{}");
    } catch {
      return {};
    }
  })();

  const currentUserName =
    activeUser?.fullName || activeUser?.name || "Kassir";

  const handleLogout = () => {
    if (window.confirm("Tizimdan chiqishni xohlaysizmi?")) {
      dispatch(logoutUser());
      navigate("/auth/login");
    }
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-2xl border-b border-slate-800 px-4 sm:px-6 py-3.5 sticky top-0 z-40 flex items-center justify-between min-h-[64px] shadow-2xl shadow-slate-950/50">
      {/* Chap tomon: Brend va Kassir Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
          <Wallet size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight">
              RestoPOS
            </h1>
            <span className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
              <Sparkles size={10} /> Kassa
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Kassir: <span className="text-slate-200 font-bold">{currentUserName}</span>
          </p>
        </div>
      </div>

      {/* O'rta: Bugungi kassa tushumi vidjeti (Katta ekranlarda) */}
      <div className="hidden md:flex items-center gap-4 bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-2xl">
        <div className="flex items-center gap-2">
          <Banknote size={18} className="text-emerald-400" />
          <span className="text-xs text-slate-400 font-medium">Bugungi tushum:</span>
          <span className="font-mono text-sm font-extrabold text-emerald-400">
            {todayTotalRevenue.toLocaleString()} so'm
          </span>
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Kutilayotgan stollar:</span>
          <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
            {activeBillsCount} ta
          </span>
        </div>
      </div>

      {/* O'ng tomon: Profil va Chiqish */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
          title="Tizimdan chiqish"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Chiqish</span>
        </button>
      </div>
    </header>
  );
}
