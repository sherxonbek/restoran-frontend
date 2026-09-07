import { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import {
  ChefHat,
  Bell,
  BellOff,
  CheckCircle2,
  Flame,
  LogOut,
  Search,
  Utensils,
} from "lucide-react";

import { db } from "@/services/firebase";
import { useToast } from "@/hooks/useToast";
import { logoutUser } from "@/store/slices/userSlice";

import OshpazOrderCard from "@/components/oshpaz/OshpazOrderCard";
import KitchenSummaryModal from "@/components/oshpaz/KitchenSummaryModal";

// Veb audio orqali toza qo'ng'iroq tovushi
const playKitchenChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    console.log("Audio not allowed yet:", e);
  }
};

function OshpazHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders = [] } = useSelector((state) => state.orders);
  const { currentUser } = useSelector((state) => state.users);
  const { toast, showToast } = useToast();

  const activeChef = currentUser || (() => {
    try {
      return JSON.parse(localStorage.getItem("current_user") || "{}");
    } catch {
      return {};
    }
  })();

  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "yangi" | "tayyorlanmoqda" | "tayyor"
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  // Yangi buyurtma kelganini kuzatish uchun avvalgi soni
  const prevOrdersCountRef = useRef(orders.length);

  useEffect(() => {
    if (orders.length > prevOrdersCountRef.current) {
      if (soundEnabled) {
        playKitchenChime();
      }
      showToast("Yangi buyurtma tushdi!");
    }
    prevOrdersCountRef.current = orders.length;
  }, [orders.length, soundEnabled, showToast]);

  // Faol buyurtmalar (bekor qilinganlar va to'liq yakunlanganlar chiqarib tashlanadi)
  const activeOrders = useMemo(() => {
    return orders
      .filter(
        (o) =>
          o.status !== "bekor" &&
          o.status !== "bajarildi" &&
          o.status !== "yakunlandi" &&
          o.status !== "yetkazildi"
      )
      .sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeA - timeB; // FIFO: Eng eski (eng ko'p kutilgan) buyurtmalar boshida
      });
  }, [orders]);

  // KPI hisoblari
  const kutilmoqdaCount = useMemo(
    () => activeOrders.filter((o) => (o.status || "yangi") === "yangi").length,
    [activeOrders]
  );
  const pishirilmoqdaCount = useMemo(
    () => activeOrders.filter((o) => o.status === "tayyorlanmoqda").length,
    [activeOrders]
  );
  const tayyorCount = useMemo(
    () => activeOrders.filter((o) => o.status === "tayyor").length,
    [activeOrders]
  );

  // Filtrlangan buyurtmalar
  const filteredOrders = useMemo(() => {
    return activeOrders.filter((order) => {
      const status = order.status || "yangi";
      const statusMatch =
        activeFilter === "all" ? true : status === activeFilter;

      const searchMatch =
        !searchQuery ||
        (order.tableName &&
          order.tableName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.waiterName &&
          order.waiterName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (Array.isArray(order.items) &&
          order.items.some((i) =>
            i.name.toLowerCase().includes(searchQuery.toLowerCase())
          ));

      return statusMatch && searchMatch;
    });
  }, [activeOrders, activeFilter, searchQuery]);

  // Buyurtma harakatlari
  const handleStartCooking = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "tayyorlanmoqda",
      });
      showToast("Buyurtma tayyorlash boshlandi!");
    } catch (err) {
      console.error("Xatolik:", err);
      showToast("Statusni yangilab bo'lmadi");
    }
  };

  const handleMarkReady = async (orderId, order) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "tayyor",
        readyAt: new Date().toISOString(),
        notifiedWaiter: order.waiterId || "",
        readyNotificationAcknowledged: false,
      });

      if (soundEnabled) {
        playKitchenChime();
      }

      showToast(
        `"${order.tableName || "Stol"}" taomlari tayyor! Ofitsiant (${order.waiterName || "Ofitsiant"})ga xabar berildi.`
      );
    } catch (err) {
      console.error("Xatolik:", err);
      showToast("Xatolik yuz berdi");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "bajarildi",
      });
      showToast("Buyurtma arxivga o'tkazildi!");
    } catch (err) {
      console.error("Xatolik:", err);
      showToast("Xatolik yuz berdi");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <div className="w-full h-screen overflow-y-auto flex-1 bg-[#070b14] text-white p-4 sm:p-6 pb-24 select-none">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 p-3.5 px-6 text-center text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in">
          {toast}
        </div>
      )}

      {/* 1. Header & KDS Boshqaruv Paneli */}
      <div className="w-full space-y-5">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-inner">
              <ChefHat size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Oshxona Monitiri (KDS)
                </h1>
                <span className="text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full">
                  Jonli Rejim
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Oshpaz:{" "}
                <span className="text-slate-200 font-bold">
                  {activeChef.fullName || activeChef.name || "Bosh Oshpaz"}
                </span>{" "}
                • Buyurtmalar real vaqtda yangilanadi
              </p>
            </div>
          </div>

          {/* O'ng tomon: Tugmalar va amallar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Oshpaz Agregatori (Jami taomlar soni) */}
            <button
              type="button"
              onClick={() => setIsSummaryOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/10"
            >
              <Utensils size={16} />
              Jami Pishirilishi Kerak
            </button>

            {/* Ovoz tugmasi */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-slate-800/60 border-slate-700 text-slate-500"
              }`}
              title={soundEnabled ? "Ovozli signal yoqilgan" : "Ovoz o'chirilgan"}
            >
              {soundEnabled ? <Bell size={18} /> : <BellOff size={18} />}
            </button>

            {/* Chiqish */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border border-slate-700 transition-all cursor-pointer"
              title="Tizimdan chiqish"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* 2. Oshxona KPI Ko'rsatkichlari */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Kutilmoqda */}
          <div
            onClick={() => setActiveFilter(activeFilter === "yangi" ? "all" : "yangi")}
            className={`p-4 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer ${
              activeFilter === "yangi"
                ? "bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-500/10"
                : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                1. Yangi (Kutilmoqda)
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            </div>
            <h2 className="text-3xl font-black text-rose-400 font-mono mt-2">
              {kutilmoqdaCount}{" "}
              <span className="text-xs font-normal text-slate-400">stol</span>
            </h2>
          </div>

          {/* Tayyorlanmoqda */}
          <div
            onClick={() =>
              setActiveFilter(activeFilter === "tayyorlanmoqda" ? "all" : "tayyorlanmoqda")
            }
            className={`p-4 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer ${
              activeFilter === "tayyorlanmoqda"
                ? "bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-500/10"
                : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                2. Pishirilmoqda (Jarayonda)
              </span>
              <Flame size={16} className="text-amber-400" />
            </div>
            <h2 className="text-3xl font-black text-amber-400 font-mono mt-2">
              {pishirilmoqdaCount}{" "}
              <span className="text-xs font-normal text-slate-400">stol</span>
            </h2>
          </div>

          {/* Tayyor bo'lganlar */}
          <div
            onClick={() => setActiveFilter(activeFilter === "tayyor" ? "all" : "tayyor")}
            className={`p-4 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer ${
              activeFilter === "tayyor"
                ? "bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                3. Tayyor (Olib ketishga)
              </span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <h2 className="text-3xl font-black text-emerald-400 font-mono mt-2">
              {tayyorCount}{" "}
              <span className="text-xs font-normal text-slate-400">stol</span>
            </h2>
          </div>
        </div>

        {/* 3. Filtrlar va Qidiruv Qatori */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: "Barcha Faol", count: activeOrders.length },
              { id: "yangi", label: "Kutilmoqda", count: kutilmoqdaCount },
              { id: "tayyorlanmoqda", label: "Pishirilmoqda", count: pishirilmoqdaCount },
              { id: "tayyor", label: "Tayyor", count: tayyorCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-white text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white bg-slate-950/40"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Stol yoki taom qidiring..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* 4. Buyurtmalar Gridi (KDS) */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredOrders.map((order) => (
              <OshpazOrderCard
                key={order.id}
                order={order}
                onStartCooking={handleStartCooking}
                onMarkReady={handleMarkReady}
                onCompleteOrder={handleCompleteOrder}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">Hozircha buyurtmalar yo'q</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Barcha taomlar pishirib bo'lingan yoki ofitsiantlar tomonidan yangi buyurtma kutilmoqda.
            </p>
          </div>
        )}
      </div>

      {/* Oshxona Agregatori Modali */}
      <KitchenSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        orders={orders}
      />
    </div>
  );
}

export default OshpazHome;
