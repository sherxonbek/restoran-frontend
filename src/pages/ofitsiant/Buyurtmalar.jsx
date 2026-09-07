import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    ChevronLeft,
    Clock,
    CreditCard,
    MapPin,
    UtensilsCrossed,
    CheckCircle2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

const formatTime = (isoString) => {
    if (!isoString) return "";
    try {
        const d = new Date(isoString);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
    } catch {
        return "";
    }
};

function BuyurtmalarHeader() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("buyurtmalar");

    const { orders = [] } = useSelector((state) => state.orders);
    const { rooms = [] } = useSelector((state) => state.rooms);
    const { currentUser } = useSelector((state) => state.users);

    const activeUser = currentUser || (() => {
        try {
            return JSON.parse(localStorage.getItem("current_user") || "{}");
        } catch {
            return {};
        }
    })();

    const currentUserId = activeUser?.id;
    const currentUserName = activeUser?.fullName || activeUser?.name;

    // Faqat joriy ofitsiantning o'zi olgan buyurtmalari (boshqa birovniki ko'rinmaydi)
    const activeOrders = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        return orders
            .filter((o) => {
                if (o.status === "bekor_qilindi") return false;

                const matchId = currentUserId && o.waiterId && String(o.waiterId) === String(currentUserId);
                const matchName = currentUserName && o.waiterName && o.waiterName.trim().toLowerCase() === currentUserName.trim().toLowerCase();

                if (o.waiterId && currentUserId && String(o.waiterId) !== String(currentUserId)) {
                    return false;
                }
                if (o.waiterName && currentUserName && o.waiterName.trim().toLowerCase() !== currentUserName.trim().toLowerCase()) {
                    return false;
                }

                return matchId || matchName || (!o.waiterId && !o.waiterName);
            })
            .sort((a, b) => {
                if (a.status === "tayyor" && b.status !== "tayyor") return -1;
                if (a.status !== "tayyor" && b.status === "tayyor") return 1;
                const isADelivered = a.status === "bajarildi" || a.status === "yetkazildi";
                const isBDelivered = b.status === "bajarildi" || b.status === "yetkazildi";
                if (!isADelivered && isBDelivered) return -1;
                if (isADelivered && !isBDelivered) return 1;
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            });
    }, [orders, currentUserId, currentUserName]);

    const getLocation = (order) => {
        const roomObj = rooms.find((r) => String(r.id) === String(order.roomId));
        const roomName = order.roomName || roomObj?.name || (order.roomId ? `${order.roomId}-Xona` : "");
        const tableName = order.tableName || "Stol";

        if (roomName && !tableName.toLowerCase().includes(roomName.toLowerCase())) {
            return `${roomName}, ${tableName}`;
        }
        return tableName;
    };

    const handleDeliver = async (orderId) => {
        try {
            await updateDoc(doc(db, "orders", orderId), {
                status: "bajarildi",
            });
        } catch (err) {
            console.error("Xatolik:", err);
        }
    };

    return (
        <div className="w-full">
            <div className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-4 sticky top-0 z-50 flex items-center min-h-[64px] btn-shadow">

                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 p-2 bg-slate-950 border border-slate-800 rounded-xl hover:bg-indigo-600/20 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-400 transition-all duration-300 cursor-pointer shadow-md z-10"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6">

                    <h1
                        onClick={() => setActiveTab("buyurtmalar")}
                        className={`text-base font-mono tracking-wide relative cursor-pointer transition-all duration-300 ${activeTab === "buyurtmalar" ? "font-bold text-white" : "font-medium text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        Buyurtmalar
                        {activeTab === "buyurtmalar" && (
                            <span className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-indigo-500 rounded-full animate-fadeIn"></span>
                        )}
                    </h1>

                    <h1
                        onClick={() => setActiveTab("payments")}
                        className={`text-base font-mono tracking-wide relative cursor-pointer transition-all duration-300 ${activeTab === "payments" ? "font-bold text-white" : "font-medium text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        Payments
                        {activeTab === "payments" && (
                            <span className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-indigo-500 rounded-full animate-fadeIn"></span>
                        )}
                    </h1>

                </div>

            </div>
            {
                activeTab === "buyurtmalar" ? (
                    activeOrders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 px-4 pb-20">
                            {activeOrders.map((order) => {
                                const isReady = order.status === "tayyor";
                                const isDelivered = order.status === "bajarildi";
                                const isCooking = order.status === "tayyorlanmoqda";

                                return (
                                    <div
                                        key={order.id}
                                        className={`w-full bg-slate-900/40 backdrop-blur-xl border p-5 flex flex-col text-white rounded-2xl shadow-xl shadow-slate-950/40 antialiased group hover:border-slate-700 transition-all duration-300 ${
                                            isReady
                                                ? "border-emerald-500/40 bg-emerald-950/15"
                                                : isCooking
                                                ? "border-amber-500/30"
                                                : "border-slate-800/80"
                                        }`}
                                    >
                                        {/* 1. Status bloki */}
                                        {isReady ? (
                                            <div className="flex justify-center items-center gap-2 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                                                <Clock size={18} className="animate-pulse" />
                                                <h1 className="font-mono text-sm font-bold tracking-wider uppercase">
                                                    Taom tayyor!
                                                </h1>
                                            </div>
                                        ) : isCooking ? (
                                            <div className="flex justify-center items-center gap-2 py-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                                                <Clock size={18} className="animate-pulse" />
                                                <h1 className="font-mono text-sm font-bold tracking-wider uppercase">
                                                    Tayyorlanmoqda...
                                                </h1>
                                            </div>
                                        ) : isDelivered ? (
                                            <div className="flex justify-center items-center gap-2 py-2.5 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-xl">
                                                <CheckCircle2 size={18} className="text-emerald-400" />
                                                <h1 className="font-mono text-sm font-bold tracking-wider uppercase">
                                                    Yetkazildi
                                                </h1>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center items-center gap-2 py-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                                                <Clock size={18} className="animate-pulse" />
                                                <h1 className="font-mono text-sm font-bold tracking-wider uppercase">
                                                    Kutmoqda...
                                                </h1>
                                            </div>
                                        )}

                                        {/* 2. Ma'lumotlar bloki */}
                                        <div className="mt-4 space-y-3.5 flex-1 flex flex-col justify-between">
                                            <div className="space-y-3.5">
                                                {/* Manzil (Joylashuv) */}
                                                <div className="flex justify-between items-center bg-slate-950/40 px-3 py-2.5 rounded-xl border border-slate-900/60">
                                                    <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider flex items-center gap-1.5">
                                                        <MapPin size={14} className="text-indigo-500" /> Manzil
                                                    </span>
                                                    <span className="font-mono text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                                        {getLocation(order)}
                                                    </span>
                                                </div>

                                                {/* Buyurtma vaqti */}
                                                <div className="flex justify-between items-center bg-slate-950/40 px-3 py-2.5 rounded-xl border border-slate-900/60">
                                                    <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider flex items-center gap-1.5">
                                                        <CalendarDays size={14} className="text-indigo-500" /> Vaqt
                                                    </span>
                                                    <span className="font-mono text-xs font-bold text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                                                        {formatTime(order.createdAt) || "Hozir"}
                                                    </span>
                                                </div>

                                                {/* Taomlar ro'yxati */}
                                                <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-900/60">
                                                    <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider flex items-center gap-1.5 mb-2.5">
                                                        <UtensilsCrossed size={14} className="text-indigo-500" /> Taomlar
                                                    </span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {Array.isArray(order.items) && order.items.length > 0 ? (
                                                            order.items.map((taom, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-800 px-2.5 py-1.5 rounded-xl hover:border-slate-700 transition flex items-center gap-1"
                                                                >
                                                                    <span className="font-mono font-bold text-amber-400 text-[11px]">
                                                                        {taom.quantity}x
                                                                    </span>
                                                                    <span>{taom.name}</span>
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-slate-500">Taomlar ro'yxati yo'q</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 3. Pastki Harakat Tugmasi: Yetkazildi */}
                                            {isDelivered ? (
                                                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 py-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold font-mono">
                                                    <CheckCircle2 size={16} />
                                                    <span>Yetkazildi (Mijozga topshirildi)</span>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeliver(order.id)}
                                                    className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all cursor-pointer active:scale-98"
                                                >
                                                    <CheckCircle2 size={16} />
                                                    Yetkazildi
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="w-full max-w-md mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 flex flex-col items-center justify-center text-center text-slate-500 mt-6 rounded-2xl">
                            <UtensilsCrossed size={36} className="mb-2 opacity-40 text-slate-400" />
                            <p className="text-sm font-medium">Hozircha buyurtmalar mavjud emas</p>
                        </div>
                    )
                ) : (
                    <div className="w-full max-w-md mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-5 flex flex-col text-white mt-4 rounded-2xl shadow-2xl shadow-slate-950/50 antialiased">

                        {/* Chek Sarlavhasi */}
                        <div className="flex items-center justify-center gap-2.5 pb-4 border-b border-slate-800/60">
                            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                                <CreditCard size={20} />
                            </div>
                            <h1 className="font-mono text-base font-bold tracking-wider uppercase text-slate-200">Elektron Chek</h1>
                        </div>

                        {/* Ma'lumotlar bloki */}
                        <div className="mt-4 space-y-4">

                            {/* Stol haqida ma'lumot */}
                            <div className="flex justify-between items-center bg-slate-950/40 px-3 py-2.5 rounded-xl border border-slate-900">
                                <span className="text-sm font-semibold text-slate-400">Joylashuv:</span>
                                <span className="font-mono text-xs font-bold bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                                    1-xona, 2-stol
                                </span>
                            </div>

                            {/* Buyurtmalar ro'yxati */}
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider block mb-2">Buyurtma tarkibi</span>
                                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">

                                    {/* Taom 1 */}
                                    <div className="flex justify-between items-center bg-slate-950/20 px-3 py-2 rounded-xl border border-slate-900/60 hover:border-slate-800 transition">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">1x</span>
                                            <span className="text-sm font-medium text-slate-300">Osh</span>
                                        </div>
                                        <span className="font-mono text-sm font-semibold text-slate-400">120 000 so'm</span>
                                    </div>

                                    {/* Taom 2 */}
                                    <div className="flex justify-between items-center bg-slate-950/20 px-3 py-2 rounded-xl border border-slate-900/60 hover:border-slate-800 transition">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">2x</span>
                                            <span className="text-sm font-medium text-slate-300">Shashlik</span>
                                        </div>
                                        <span className="font-mono text-sm font-semibold text-slate-400">200 000 so'm</span>
                                    </div>

                                    {/* Taom 3 */}
                                    <div className="flex justify-between items-center bg-slate-950/20 px-3 py-2 rounded-xl border border-slate-900/60 hover:border-slate-800 transition">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">1x</span>
                                            <span className="text-sm font-medium text-slate-300">Kebab</span>
                                        </div>
                                        <span className="font-mono text-sm font-semibold text-slate-400">150 000 so'm</span>
                                    </div>

                                </div>
                            </div>

                            {/* To'lov Summasi (Footer) */}
                            <div className="border-t border-slate-800/80 pt-4 mt-2 flex justify-between items-center px-1">
                                <span className="text-sm font-medium text-slate-400">Umumiy summa:</span>
                                <span className="text-xl font-black font-mono text-emerald-400 tracking-tight">
                                    120 000 so'm
                                </span>
                            </div>

                        </div>
                    </div>

                )
            }
        </div>
    );
}

export default BuyurtmalarHeader;
