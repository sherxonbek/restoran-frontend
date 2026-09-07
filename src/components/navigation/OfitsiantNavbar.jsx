import { useState, useEffect, useMemo, useRef } from "react";
import { Bell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { logoutUser } from "@/store/slices/userSlice";

// Ofitsiant uchun xushovoz qo'ng'iroq tovushi
const playWaiterAlertChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.log("Audio play error:", e);
  }
};

function OfitsiantNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders = [] } = useSelector((state) => state.orders);
  const { currentUser } = useSelector((state) => state.users);

  const activeUser = currentUser || (() => {
    try {
      return JSON.parse(localStorage.getItem("current_user") || "{}");
    } catch {
      return {};
    }
  })();

  const currentUserId = activeUser?.id;
  const currentUserName = activeUser?.fullName || activeUser?.name || "Ofitsiant";

  const [personalAlert, setPersonalAlert] = useState(null);

  // 1. Aynan shu ofitsiantning o'ziga tegishli tayyor buyurtmalari
  const myReadyOrders = useMemo(() => {
    return orders.filter((o) => {
      if (o.status !== "tayyor") return false;
      const matchId = currentUserId && o.waiterId && String(o.waiterId) === String(currentUserId);
      const matchName = currentUserName && o.waiterName && o.waiterName.trim().toLowerCase() === currentUserName.trim().toLowerCase();
      if (o.waiterId && currentUserId && String(o.waiterId) !== String(currentUserId)) return false;
      if (o.waiterName && currentUserName && o.waiterName.trim().toLowerCase() !== currentUserName.trim().toLowerCase()) return false;
      return matchId || matchName || (!o.waiterId && !o.waiterName);
    });
  }, [orders, currentUserId, currentUserName]);

  const totalReadyCount = myReadyOrders.length;

  // 3. Maqsadli ogohlantirish:
  // Yangi tayyor taom paydo bo'lgandagina ovozli signal va pop-up berish
  const prevMyReadyIds = useRef(new Set());

  useEffect(() => {
    const currentMyIds = new Set(myReadyOrders.map((o) => o.id));

    myReadyOrders.forEach((order) => {
      if (!prevMyReadyIds.current.has(order.id)) {
        playWaiterAlertChime();
        setPersonalAlert({
          id: order.id,
          tableName: order.tableName || "Stol",
          itemsCount: Array.isArray(order.items) ? order.items.length : 0,
        });

        setTimeout(() => {
          setPersonalAlert(null);
        }, 6000);
      }
    });

    prevMyReadyIds.current = currentMyIds;
  }, [myReadyOrders]);

  // Buyurtmani olib ketishni tasdiqlash
  const handleDeliverOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "bajarildi",
      });
      setPersonalAlert(null);
    } catch (err) {
      console.error("Xatolik:", err);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <div className="relative w-full z-40">
      {/* Asosiy Navbar qatori */}
      <nav className="flex w-full justify-between items-center p-3.5 px-5 bg-slate-900/85 backdrop-blur-xl border-b border-slate-800 text-white shadow-xl">
        {/* Chap tomon: Ofitsiant profili */}
        <div
          onClick={() => navigate("/ofitsiant")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
            <User size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              {currentUserName}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Ofitsiant Paneli</p>
          </div>
        </div>

        {/* O'ng tomon: Qo'ng'iroqcha (/ofitsiant/buyurtmalar ga o'tish) va Chiqish */}
        <div className="flex items-center gap-3">
          {/* Qo'ng'iroqcha tugmasi - to'g'ridan-to'g'ri /ofitsiant/buyurtmalar ga yo'naltiradi */}
          <button
            type="button"
            onClick={() => navigate("/ofitsiant/buyurtmalar")}
            className={`relative p-2.5 rounded-xl border transition-all cursor-pointer ${
              totalReadyCount > 0
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 animate-pulse shadow-lg shadow-emerald-500/20"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Buyurtmalar va Xabarnomalar"
          >
            <Bell size={20} />

            {/* Xabarlar / Tayyor taomlar soni badge */}
            {totalReadyCount > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full text-[10px] font-black flex items-center justify-center text-white border-2 border-slate-900 ${
                  myReadyOrders.length > 0 ? "bg-emerald-500 animate-bounce" : "bg-amber-500"
                }`}
              >
                {totalReadyCount}
              </span>
            )}
          </button>

          {/* Chiqish tugmasi */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Chiqish"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Shaxsiy Maqsadli Pop-Up (Aynan shu ofitsiantning stoli tayyor bo'lganda) */}
      {personalAlert && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md p-4 rounded-3xl bg-emerald-950/95 border-2 border-emerald-500 text-white shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between gap-3">
            <div
              onClick={() => navigate("/ofitsiant/buyurtmalar")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Bell size={24} className="animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">
                  Sizning buyurtmangiz tayyor!
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  <span className="font-bold text-white underline">
                    {personalAlert.tableName}
                  </span>{" "}
                  taomlarini oshxonadan olib ketishingiz mumkin.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleDeliverOrder(personalAlert.id)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg cursor-pointer"
              >
                Olib ketdim
              </button>
              <button
                type="button"
                onClick={() => setPersonalAlert(null)}
                className="text-[10px] text-emerald-400/80 hover:text-white text-center cursor-pointer"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfitsiantNavbar;