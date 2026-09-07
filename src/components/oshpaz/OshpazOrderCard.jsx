import { useState, useEffect, useMemo } from "react";
import {
  Clock,
  User,
  CheckCircle2,
  ChefHat,
  Check,
  Bell,
  Sparkles,
} from "lucide-react";

export default function OshpazOrderCard({
  order,
  onStartCooking,
  onMarkReady,
  onCompleteOrder,
}) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedItems, setCompletedItems] = useState({});

  // Jonli taymer hisob-kitobi
  useEffect(() => {
    const calculateTime = () => {
      if (!order.createdAt) return;
      const createdTime = new Date(order.createdAt).getTime();
      if (isNaN(createdTime)) return;
      const now = Date.now();
      const diffInSec = Math.max(0, Math.floor((now - createdTime) / 1000));
      setElapsedMinutes(Math.floor(diffInSec / 60));
      setElapsedSeconds(diffInSec % 60);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [order.createdAt]);

  const toggleItemDone = (idx) => {
    setCompletedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Kechikish darajasi
  const urgency = useMemo(() => {
    if (elapsedMinutes >= 20) return "critical"; // 20+ daqiqa (Qizil)
    if (elapsedMinutes >= 12) return "warning"; // 12-20 daqiqa (Sariq)
    return "normal"; // 0-12 daqiqa (Yashil)
  }, [elapsedMinutes]);

  const status = order.status || "yangi";
  const isReady = status === "tayyor";
  const isCooking = status === "tayyorlanmoqda";
  const isNew = status === "yangi";

  return (
    <div
      className={`flex flex-col justify-between p-5 rounded-3xl backdrop-blur-2xl border transition-all duration-300 shadow-2xl ${
        isReady
          ? "bg-slate-900/80 border-emerald-500/40 shadow-emerald-500/5 ring-1 ring-emerald-500/20"
          : isCooking
          ? urgency === "critical"
            ? "bg-slate-900/80 border-rose-500/60 shadow-rose-500/10 ring-1 ring-rose-500/30 animate-pulse"
            : "bg-slate-900/80 border-amber-500/50 shadow-amber-500/5"
          : urgency === "critical"
          ? "bg-slate-900/80 border-rose-500/70 ring-2 ring-rose-500/40"
          : urgency === "warning"
          ? "bg-slate-900/80 border-amber-500/40"
          : "bg-slate-900/80 border-slate-800"
      }`}
    >
      <div>
        {/* Tepa qator: Stol nomi va Taymer */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3.5 mb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white tracking-tight">
                {order.tableName || "Stol"}
              </h3>
              {isReady && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-bounce">
                  Tayyor!
                </span>
              )}
            </div>

            {/* Ofitsiant nomi */}
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
              <User size={14} className="text-indigo-400" />
              Ofitsiant:{" "}
              <span className="text-slate-200 font-bold">
                {order.waiterName || "Ofitsiant"}
              </span>
            </p>
          </div>

          {/* Jonli Taymer Badji */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs ${
              isReady
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : urgency === "critical"
                ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                : urgency === "warning"
                ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}
          >
            <Clock size={14} />
            <span>
              {String(elapsedMinutes).padStart(2, "0")}:
              {String(elapsedSeconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Taomlar Ro'yxati */}
        <div className="space-y-2 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Taomlar ({Array.isArray(order.items) ? order.items.length : 0} xil):
          </p>

          <div className="divide-y divide-slate-800/60 max-h-56 overflow-y-auto custom-scrollbar pr-1">
            {Array.isArray(order.items) &&
              order.items.map((item, idx) => {
                const isDone = Boolean(completedItems[idx]);

                return (
                  <div
                    key={idx}
                    onClick={() => toggleItemDone(idx)}
                    className={`py-2 flex items-center justify-between gap-3 cursor-pointer select-none transition-opacity ${
                      isDone ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isDone
                            ? "bg-emerald-500 border-emerald-500 text-slate-950"
                            : "border-slate-700 bg-slate-950/60"
                        }`}
                      >
                        {isDone && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span
                        className={`text-sm font-bold truncate ${
                          isDone
                            ? "line-through text-slate-400"
                            : "text-slate-100"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    <span
                      className={`text-sm font-black font-mono px-2 py-0.5 rounded-lg border ${
                        isDone
                          ? "bg-slate-800 text-slate-500 border-slate-700"
                          : "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                      }`}
                    >
                      {item.quantity}x
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Pastki Harakat Tugmalari (Action Buttons) */}
      <div className="pt-3 border-t border-slate-800/80">
        {isNew && (
          <button
            type="button"
            onClick={() => onStartCooking(order.id)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/25 transition-all cursor-pointer active:scale-98"
          >
            <ChefHat size={18} />
            Pishirishni Boshlash
          </button>
        )}

        {isCooking && (
          <button
            type="button"
            onClick={() => onMarkReady(order.id, order)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-98"
          >
            <Bell size={18} />
            Tayyor! (Ofitsiantga xabar)
          </button>
        )}

        {isReady && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles size={15} />
              Ofitsiantga xabar yuborildi
            </div>
            <button
              type="button"
              onClick={() => onCompleteOrder(order.id)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <CheckCircle2 size={15} />
              Olib ketildi / Yopish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
