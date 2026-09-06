import { useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  UtensilsCrossed,
  Package,
  BadgeDollarSign,
  Globe,
  ChevronRight,
  Sliders,
  Check,
  Sparkles,
  Bell,
  BellOff,
} from "lucide-react"
import { useToast } from "@/hooks/useToast"

function Sozlamalar() {
  const { products = [] } = useSelector((state) => state.products)

  const { toast, showToast } = useToast()



  // 2. Dastur parametrlari (Til va Bildirishnoma)
  const [language, setLanguage] = useState(() => localStorage.getItem("app_lang") || "uz")
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem("app_sound_enabled") !== "false"
  )


  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    localStorage.setItem("app_lang", lang)
    showToast(
      lang === "uz"
        ? "Til: O'zbekcha tanlandi"
        : lang === "ru"
          ? "Язык: Русский выбран"
          : "Language: English selected"
    )
  }

  const handleToggleSound = () => {
    const nextState = !soundEnabled
    setSoundEnabled(nextState)
    localStorage.setItem("app_sound_enabled", String(nextState))
    showToast(nextState ? "Ovozli bildirishnomalar yoqildi" : "Ovozli bildirishnomalar o'chirildi")
  }

  const handleComingSoon = (featureName) => {
    showToast(`${featureName} bo'limi tez kunda ishga tushadi (v1.1)`)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 text-white pb-24 max-w-5xl mx-auto">
      {/* Toast xabarnoma */}
      {toast && (
        <div className="sticky top-2 z-40 p-3 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in">
          {toast}
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="relative p-6 sm:p-7 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner">
              <Sliders size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Tizim Sozlamalari</h1>
                <span className="text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles size={11} /> v1.0
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Restoran profili, menyu va dastur parametrlarini boshqaring
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Menyu va Omborxona Bo'limlari */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
          <UtensilsCrossed size={15} className="text-emerald-400" />
          Menyu va Boshqaruv
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Mahsulotlar sozlash */}
          <Link
            to="/admin/sozlamalar/maxsulotlar"
            className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                <UtensilsCrossed size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors truncate">
                    Taomnoma va Mahsulotlar
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                    {products.length} ta taom
                  </span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-xl text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0">
              <ChevronRight size={18} />
            </div>
          </Link>

          {/* Zaxira maxsulotlar */}
          <div
            onClick={() => handleComingSoon("Zaxira mahsulotlar (Omborxona)")}
            className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-amber-500/50 hover:bg-slate-900/80 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                <Package size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                    Zaxira (Ombor)
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    Tez kunda
                  </span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-xl text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0">
              <ChevronRight size={18} />
            </div>
          </div>

          {/* Oylik maoshlari */}
          <div
            onClick={() => handleComingSoon("Oylik maoshlari hisob-kitobi")}
            className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-purple-500/50 hover:bg-slate-900/80 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                <BadgeDollarSign size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-purple-400 transition-colors truncate">
                    Oylik Maoshlari
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                    Tez kunda
                  </span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-xl text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0">
              <ChevronRight size={18} />
            </div>
          </div>

        </div>
      </div>

      {/* 4. Tizim Parametrlari (Dastur tili, Bildirishnomalar, Tizim ma'lumotlari) */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
          <Globe size={15} className="text-cyan-400" />
          Dastur Parametrlari
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Dastur Tili */}
          <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Dastur Tili</h3>
                <p className="text-xs text-slate-400">Interfeys asosiy tilini tanlang</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { code: "uz", label: "O'zbek", flag: "🇺🇿" },
                { code: "ru", label: "Русский", flag: "🇷🇺" },
                { code: "en", label: "English", flag: "🇬🇧" },
              ].map((item) => {
                const isActive = language === item.code
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleLanguageChange(item.code)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${isActive
                      ? "bg-cyan-600/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-600/20"
                      : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700"
                      }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                    {isActive && <Check size={13} className="text-cyan-400 ml-0.5" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Ovozli Bildirishnoma */}
          <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border transition-all ${soundEnabled
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-slate-800/60 border-slate-700 text-slate-400"
                }`}>
                {soundEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Ovozli Bildirishnomalar</h3>
                <p className="text-xs text-slate-400">Yangi buyurtmalarda audio signal berish</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${soundEnabled ? "bg-emerald-500" : "bg-slate-700"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soundEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Sozlamalar