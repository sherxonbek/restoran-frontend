import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    ChevronLeft,
    Clock,
    MapPin,
    UtensilsCrossed,
    CheckCircle2,
    Receipt,
    Banknote,
    Check,
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

    const getLocation = useCallback((order) => {
        const roomObj = rooms.find((r) => String(r.id) === String(order.roomId));
        const roomName = order.roomName || roomObj?.name || (order.roomId ? `${order.roomId}-Xona` : "");
        const tableName = order.tableName || "Stol";

        if (roomName && !tableName.toLowerCase().includes(roomName.toLowerCase())) {
            return `${roomName}, ${tableName}`;
        }
        return tableName;
    }, [rooms]);

    const [settlingKey, setSettlingKey] = useState(null);

    // Payments uchun: bitta stoldan tushgan bir nechta buyurtmalar alohida emas,
    // aynan o'sha manzil (stol) bo'yicha bitta elektron chekga jamlanadi.
    const tablePayments = useMemo(() => {
        if (!Array.isArray(orders)) return [];

        const groups = {};

        orders.forEach((o) => {
            if (o.status === "bekor_qilindi" || o.status === "bekor") return;

            // Faqat joriy ofitsiantning buyurtmalari
            const matchId = currentUserId && o.waiterId && String(o.waiterId) === String(currentUserId);
            const matchName = currentUserName && o.waiterName && o.waiterName.trim().toLowerCase() === currentUserName.trim().toLowerCase();
            if (o.waiterId && currentUserId && String(o.waiterId) !== String(currentUserId)) return;
            if (o.waiterName && currentUserName && o.waiterName.trim().toLowerCase() !== currentUserName.trim().toLowerCase()) return;
            if (!matchId && !matchName && (o.waiterId || o.waiterName)) return;

            // Xona va stol bo'yicha yagona kalit
            const tableKey = `${o.roomId || "room"}_${o.tableId || o.tableName || "table"}`;
            const locationName = getLocation(o);

            if (!groups[tableKey]) {
                groups[tableKey] = {
                    key: tableKey,
                    roomId: o.roomId,
                    roomName: o.roomName,
                    tableId: o.tableId,
                    tableName: o.tableName,
                    locationName,
                    orderIds: [],
                    ordersCount: 0,
                    firstCreatedAt: o.createdAt,
                    lastCreatedAt: o.createdAt,
                    waiterName: o.waiterName || currentUserName,
                    itemsMap: {},
                    totalPrice: 0,
                    hasUnpaid: false,
                };
            }

            const g = groups[tableKey];
            g.orderIds.push(o.id);
            g.ordersCount += 1;

            if (o.status !== "tolandi" && o.status !== "yopildi") {
                g.hasUnpaid = true;
            }

            if (o.createdAt) {
                if (!g.firstCreatedAt || new Date(o.createdAt) < new Date(g.firstCreatedAt)) {
                    g.firstCreatedAt = o.createdAt;
                }
                if (!g.lastCreatedAt || new Date(o.createdAt) > new Date(g.lastCreatedAt)) {
                    g.lastCreatedAt = o.createdAt;
                }
            }

            if (Array.isArray(o.items)) {
                o.items.forEach((item) => {
                    const dishKey = `${item.id || item.name}_${item.price}`;
                    const qty = Number(item.quantity) || 1;
                    const price = Number(item.price) || 0;

                    if (!g.itemsMap[dishKey]) {
                        g.itemsMap[dishKey] = {
                            id: item.id || dishKey,
                            name: item.name,
                            price,
                            quantity: 0,
                            total: 0,
                        };
                    }
                    g.itemsMap[dishKey].quantity += qty;
                    g.itemsMap[dishKey].total += price * qty;
                });
            }

            const orderTotal = Number(o.totalPrice) ||
                (Array.isArray(o.items)
                    ? o.items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0)
                    : 0);

            g.totalPrice += orderTotal;
        });

        return Object.values(groups)
            .map((g) => ({
                ...g,
                itemsList: Object.values(g.itemsMap),
            }))
            .sort((a, b) => new Date(b.lastCreatedAt || 0) - new Date(a.lastCreatedAt || 0));
    }, [orders, currentUserId, currentUserName, getLocation]);

    const handleSettleCheck = async (bill) => {
        if (!window.confirm(`${bill.locationName} uchun jami ${bill.totalPrice.toLocaleString()} so'm to'lov qabul qilindimi?`)) {
            return;
        }

        try {
            setSettlingKey(bill.key);
            await Promise.all(
                bill.orderIds.map((id) =>
                    updateDoc(doc(db, "orders", id), {
                        status: "tolandi",
                        paidAt: new Date().toISOString(),
                    })
                )
            );
        } catch (err) {
            console.error("To'lovni tasdiqlashda xatolik:", err);
            alert("Xatolik yuz berdi!");
        } finally {
            setSettlingKey(null);
        }
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

    const activeBillsCount = tablePayments.filter((b) => b.hasUnpaid).length;

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
                        className={`text-base font-mono tracking-wide relative cursor-pointer transition-all duration-300 flex items-center gap-2 ${activeTab === "buyurtmalar" ? "font-bold text-white" : "font-medium text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        <span>Buyurtmalar</span>
                        {activeOrders.length > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-mono font-bold">
                                {activeOrders.length}
                            </span>
                        )}
                        {activeTab === "buyurtmalar" && (
                            <span className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-indigo-500 rounded-full animate-fadeIn"></span>
                        )}
                    </h1>

                    <h1
                        onClick={() => setActiveTab("payments")}
                        className={`text-base font-mono tracking-wide relative cursor-pointer transition-all duration-300 flex items-center gap-2 ${activeTab === "payments" ? "font-bold text-white" : "font-medium text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        <span>Payments</span>
                        {activeBillsCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-mono font-bold">
                                {activeBillsCount}
                            </span>
                        )}
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
                                const isDelivered = order.status === "bajarildi" || order.status === "yetkazildi";
                                const isCooking = order.status === "tayyorlanmoqda";

                                return (
                                    <div
                                        key={order.id}
                                        className={`w-full bg-slate-900/40 backdrop-blur-xl border p-5 flex flex-col text-white rounded-2xl shadow-xl shadow-slate-950/40 antialiased group hover:border-slate-700 transition-all duration-300 ${isReady
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
                                            ) : isReady ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeliver(order.id)}
                                                    className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-98 animate-pulse"
                                                >
                                                    <CheckCircle2 size={16} />
                                                    <span>Yetkazildi</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800/40 border border-slate-800/80 text-slate-500 font-bold text-xs cursor-not-allowed select-none opacity-60"
                                                    title="Oshpaz taomni tayyor deb tasdiqlagach ushbu tugma faollashadi"
                                                >
                                                    <CheckCircle2 size={16} />
                                                    <span>Yetkazildi (Kutilmoqda)</span>
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
                    /* PAYMENTS TABI: Stollar bo'yicha jamlangan elektron cheklar */
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-12">
                        {tablePayments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {tablePayments.map((bill) => (
                                    <div
                                        key={bill.key}
                                        className={`w-full backdrop-blur-xl border p-5 sm:p-6 flex flex-col text-white rounded-3xl shadow-2xl transition-all duration-300 ${
                                            bill.hasUnpaid
                                                ? "bg-slate-900/60 border-slate-800 shadow-slate-950/60"
                                                : "bg-slate-900/30 border-emerald-500/20 shadow-emerald-950/20 opacity-90"
                                        }`}
                                    >
                                        {/* Chek Sarlavhasi */}
                                        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 shadow-inner">
                                                    <Receipt size={20} />
                                                </div>
                                                <div>
                                                    <h2 className="font-mono text-sm font-bold tracking-wider uppercase text-slate-100">
                                                        Elektron Chek
                                                    </h2>
                                                    <span className="text-[11px] text-slate-400 font-mono">
                                                        {bill.ordersCount > 1
                                                            ? `${bill.ordersCount} ta buyurtma jamlangan`
                                                            : "1 ta buyurtma"}
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-[11px] font-bold font-mono px-2.5 py-1 rounded-xl border ${
                                                    bill.hasUnpaid
                                                        ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                                        : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                                }`}
                                            >
                                                {bill.hasUnpaid ? "To'lanmagan" : "To'langan"}
                                            </span>
                                        </div>

                                        {/* Ma'lumotlar bloki */}
                                        <div className="mt-4 space-y-3.5 flex-1 flex flex-col justify-between">
                                            <div className="space-y-3">
                                                {/* Stol haqida ma'lumot (Manzil) */}
                                                <div className="flex justify-between items-center bg-slate-950/50 px-4 py-3 rounded-2xl border border-slate-900/80">
                                                    <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider flex items-center gap-2">
                                                        <MapPin size={15} className="text-indigo-400" /> Manzil
                                                    </span>
                                                    <span className="font-mono text-xs font-bold bg-indigo-500/15 text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-500/30">
                                                        {bill.locationName}
                                                    </span>
                                                </div>

                                                {/* Vaqt */}
                                                <div className="flex justify-between items-center bg-slate-950/50 px-4 py-3 rounded-2xl border border-slate-900/80">
                                                    <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider flex items-center gap-2">
                                                        <CalendarDays size={15} className="text-indigo-400" /> Vaqt
                                                    </span>
                                                    <span className="font-mono text-xs text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                                                        {formatTime(bill.firstCreatedAt) || "Hozir"}
                                                        {bill.ordersCount > 1 && bill.lastCreatedAt !== bill.firstCreatedAt && (
                                                            <span className="text-[10px] text-slate-500 ml-1">
                                                                (+{formatTime(bill.lastCreatedAt)})
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Buyurtmalar ro'yxati (jamlangan taomlar) */}
                                                <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-900/80">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider flex items-center gap-2">
                                                            <UtensilsCrossed size={14} className="text-indigo-400" /> Buyurtma tarkibi
                                                        </span>
                                                        <span className="text-[11px] font-mono text-slate-400">
                                                            {bill.itemsList.length} xil taom
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                                                        {bill.itemsList.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex justify-between items-center bg-slate-900/60 px-3.5 py-2.5 rounded-xl border border-slate-800/80 hover:border-indigo-500/30 transition"
                                                            >
                                                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                                                    <span className="text-xs font-mono font-bold bg-amber-400/15 text-amber-300 px-2 py-0.5 rounded-lg border border-amber-400/30 shrink-0">
                                                                        {item.quantity}x
                                                                    </span>
                                                                    <span className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                                                                        {item.name}
                                                                    </span>
                                                                </div>
                                                                <span className="font-mono text-xs sm:text-sm font-semibold text-slate-300 shrink-0">
                                                                    {item.total.toLocaleString()} so'm
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* To'lov Summasi va Tasdiqlash */}
                                            <div className="pt-4 border-t border-slate-800/80">
                                                <div className="flex justify-between items-center px-1 mb-3.5">
                                                    <span className="text-xs font-semibold text-slate-400 uppercase font-mono">
                                                        Umumiy summa:
                                                    </span>
                                                    <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
                                                        {bill.totalPrice.toLocaleString()} so'm
                                                    </span>
                                                </div>

                                                {bill.hasUnpaid ? (
                                                    <button
                                                        type="button"
                                                        disabled={settlingKey === bill.key}
                                                        onClick={() => handleSettleCheck(bill)}
                                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                                                    >
                                                        <Banknote size={16} />
                                                        <span>To'lovni qabul qilish</span>
                                                    </button>
                                                ) : (
                                                    <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono text-center flex items-center justify-center gap-1.5">
                                                        <Check size={16} />
                                                        <span>To'lov to'liq qabul qilingan</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full max-w-md mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 flex flex-col items-center justify-center text-center text-slate-500 mt-6 rounded-2xl">
                                <Receipt size={36} className="mb-2 opacity-40 text-slate-400" />
                                <p className="text-sm font-medium">Hozircha to'lov cheklari mavjud emas</p>
                            </div>
                        )}
                    </div>
                )
            }
        </div>
    );
}

export default BuyurtmalarHeader;
