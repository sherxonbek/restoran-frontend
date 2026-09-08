import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  Table2,
  Users,
  ChartNoAxesCombined,
  UtensilsCrossed,
  Package,
  BadgeDollarSign,
  User,
  LogOut,
  Sparkles,
  Bell,
  BellOff,
  Check,
  Wallet,
} from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { logoutUser } from "@/store/slices/userSlice";
import { useToast } from "@/hooks/useToast";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.users);
  const { products = [] } = useSelector((state) => state.products);
  const { items: inventoryItems = [] } = useSelector((state) => state.inventory);

  const { toast, showToast } = useToast();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Sozlamalardan ko'chirilgan parametrlar (Til va Ovoz)
  const [language, setLanguage] = useState(() => localStorage.getItem("app_lang") || "uz");
  const [soundEnabled, setSoundEnabled] = useState(
    () => localStorage.getItem("app_sound_enabled") !== "false"
  );

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("app_lang", lang);
    showToast(
      lang === "uz"
        ? "Til: O'zbekcha"
        : lang === "ru"
        ? "Язык: Русский"
        : "Language: English"
    );
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    localStorage.setItem("app_sound_enabled", String(nextState));
    showToast(nextState ? "Ovozli bildirishnoma yoqildi" : "Ovozli bildirishnoma o'chirildi");
  };

  const handleComingSoon = (name) => {
    showToast(`${name} bo'limi tez kunda ishga tushadi!`);
  };

  const user = currentUser || (() => {
    try {
      const saved = localStorage.getItem("current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const handleConfirmLogout = () => {
    dispatch(logoutUser());
    setLogoutModalOpen(false);
    navigate("/auth/login");
  };

  // 1. Asosiy bo'limlar
  const mainNavItems = [
    { id: "home", name: "Bosh sahifa", icon: Home, url: "/admin", exact: true },
    { id: "rooms", name: "Xonalar va Stollar", icon: Table2, url: "/admin/xonalar" },
    { id: "users", name: "Xodimlar", icon: Users, url: "/admin/xodimlar" },
    { id: "stats", name: "Statistika", icon: ChartNoAxesCombined, url: "/admin/statistika" },
  ];

  // 2. Sozlamalardan parchalab kiritilgan menyu va boshqaruv bo'limlari
  const managementNavItems = [
    {
      id: "products",
      name: "Mahsulotlar va Taomlar",
      icon: UtensilsCrossed,
      url: "/admin/sozlamalar/maxsulotlar",
      badge: `${Array.isArray(products) ? products.length : 0}`,
    },
    {
      id: "inventory",
      name: "Omborxona (Zaxira)",
      icon: Package,
      url: "/admin/ombor",
      badge: `${inventoryItems.length}`,
    },
    {
      id: "kassa",
      name: "Kassa Paneli",
      icon: Wallet,
      url: "/kassir",
    },
    {
      id: "salaries",
      name: "Oylik Maoshlari",
      icon: BadgeDollarSign,
      action: () => handleComingSoon("Oylik Maoshlari"),
      isComingSoon: true,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen shrink-0 bg-slate-900/85 backdrop-blur-2xl border-r border-slate-800/80 justify-between z-40 select-none shadow-2xl p-4 overflow-y-auto custom-scrollbar">
      {/* Toast xabarnomasi */}
      {toast && (
        <div className="absolute top-3 left-3 right-3 p-2.5 text-center text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in z-50">
          {toast}
        </div>
      )}

      <div className="space-y-5">
        {/* 1. Logo va Brand */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
            <UtensilsCrossed size={24} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black text-white tracking-tight">RestoPOS</h1>
              <span className="text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                <Sparkles size={10} /> Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Boshqaruv Paneli</p>
          </div>
        </div>

        {/* 2. Asosiy Navigatsiya */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold tracking-wider uppercase text-slate-500 px-3 mb-1.5">
            Asosiy Bo'limlar
          </p>
          {mainNavItems.map((item) => {
            const IconComponent = item.icon;
            const isItemActive = item.exact
              ? location.pathname === item.url
              : location.pathname.startsWith(item.url);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.url)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left group ${
                  isItemActive
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-md shadow-emerald-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isItemActive
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "text-slate-400 group-hover:text-white group-hover:bg-slate-800"
                  }`}
                >
                  <IconComponent size={16} />
                </div>
                <span className="truncate">{item.name}</span>
                {isItemActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                )}
              </button>
            );
          })}
        </div>

        {/* 3. Sozlamalardan ko'chirilgan Menyu va Zaxira bo'limlari */}
        <div className="space-y-1 pt-2 border-t border-slate-800/80">
          <p className="text-[10px] font-bold tracking-wider uppercase text-slate-500 px-3 mb-1.5">
            Taomnoma va Ombor
          </p>
          {managementNavItems.map((item) => {
            const IconComponent = item.icon;
            const isItemActive =
              item.url &&
              (location.pathname === item.url ||
                location.pathname.startsWith(item.url));

            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action || (() => navigate(item.url))}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left group ${
                  isItemActive
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-md shadow-emerald-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isItemActive
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "text-slate-400 group-hover:text-white group-hover:bg-slate-800"
                  }`}
                >
                  <IconComponent size={16} />
                </div>
                <span className="truncate">{item.name}</span>

                {/* Badge yoki Tez kunda nishoni */}
                {item.badge && (
                  <span className="ml-auto text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                {item.isComingSoon && (
                  <span className="ml-auto text-[9px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-md">
                    Yaqinda
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Pastki Qism: Dastur Sozlamalari (Til va Ovoz) + Foydalanuvchi */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        {/* Til va Ovoz paneli */}
        <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
          {/* Til tanlash */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">Til:</span>
            <div className="flex items-center gap-1">
              {[
                { code: "uz", label: "UZ" },
                { code: "ru", label: "RU" },
                { code: "en", label: "EN" },
              ].map((lang) => {
                const isActive = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-emerald-600/20 border border-emerald-500 text-emerald-300 shadow-sm"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {lang.label}
                    {isActive && <Check size={10} className="inline ml-0.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ovozli bildirishnoma */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              {soundEnabled ? (
                <Bell size={13} className="text-emerald-400" />
              ) : (
                <BellOff size={13} className="text-slate-500" />
              )}
              Ovozli signal
            </span>

            <button
              type="button"
              onClick={handleToggleSound}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                soundEnabled ? "bg-emerald-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? "translate-x-4.5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Xodim profili va Chiqish */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <User size={15} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">
                {user?.fullName || "Bosh Admin"}
              </h4>
              <span className="text-[10px] font-mono text-emerald-400">
                {user?.role || "Admin"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            title="Tizimdan chiqish"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Chiqishni tasdiqlash modali */}
      <ConfirmModal
        isOpen={logoutModalOpen}
        message="Haqiqatan ham admin boshqaruv panelidan chiqmoqchimisiz?"
        confirmText="Ha, chiqish"
        cancelText="Bekor qilish"
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </aside>
  );
}
