import { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import {
  Receipt,
  Banknote,
  CreditCard,
  Smartphone,
  Printer,
  UtensilsCrossed,
  CheckCircle2,
  Clock,
  Search,
  Check,
  X,
  TrendingUp,
  Coins,
  History,
} from "lucide-react";
import KassirNavbar from "@/components/navigation/KassirNavbar";
import ReceiptModal from "@/components/kassir/ReceiptModal";

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

const isToday = (isoString) => {
  if (!isoString) return false;
  try {
    const d = new Date(isoString);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  } catch {
    return false;
  }
};

const generateReceiptNumber = () => Math.floor(100000 + Math.random() * 900000);

export default function KassirHome() {
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

  const currentUserName = activeUser?.fullName || activeUser?.name || "Kassir";

  const [activeTab, setActiveTab] = useState("faol");
  const [searchTerm, setSearchTerm] = useState("");

  // To'lov modali holati
  const [checkoutBill, setCheckoutBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("naqd");
  const [cashReceived, setCashReceived] = useState("");
  const servicePercent = 10;
  const [hasServiceFee, setHasServiceFee] = useState(true);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Chop etish uchun chek ma'lumotlari
  const [printReceiptData, setPrintReceiptData] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const getLocation = useCallback((order) => {
    const roomObj = rooms.find((r) => String(r.id) === String(order.roomId));
    const roomName =
      order.roomName || roomObj?.name || (order.roomId ? `${order.roomId}-Xona` : "");
    const tableName = order.tableName || "Stol";

    if (roomName && !tableName.toLowerCase().includes(roomName.toLowerCase())) {
      return `${roomName}, ${tableName}`;
    }
    return tableName;
  }, [rooms]);

  // 1. Faol stollar (To'lanmagan buyurtmalar jamlanmasi)
  const activeBills = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    const groups = {};

    orders.forEach((o) => {
      // Faqat bekor qilinmagan va hali to'lanmagan buyurtmalar
      if (
        o.status === "bekor_qilindi" ||
        o.status === "bekor" ||
        o.status === "tolandi" ||
        o.status === "yopildi"
      ) {
        return;
      }

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
          waiterName: o.waiterName || "Ofitsiant",
          itemsMap: {},
          subtotal: 0,
        };
      }

      const g = groups[tableKey];
      g.orderIds.push(o.id);
      g.ordersCount += 1;

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

      const orderTotal =
        Number(o.totalPrice) ||
        (Array.isArray(o.items)
          ? o.items.reduce(
              (s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1),
              0
            )
          : 0);

      g.subtotal += orderTotal;
    });

    return Object.values(groups)
      .map((g) => ({
        ...g,
        itemsList: Object.values(g.itemsMap),
      }))
      .sort((a, b) => new Date(b.lastCreatedAt || 0) - new Date(a.lastCreatedAt || 0));
  }, [orders, getLocation]);

  // 2. Bugungi to'langan hisoblar tarixi
  const paidBillsHistory = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    const paidOrders = orders.filter(
      (o) => (o.status === "tolandi" || o.status === "yopildi") && isToday(o.paidAt || o.createdAt)
    );

    return paidOrders.sort(
      (a, b) => new Date(b.paidAt || b.createdAt || 0) - new Date(a.paidAt || a.createdAt || 0)
    );
  }, [orders]);

  // 3. Bugungi kassa statistikasi
  const todayStats = useMemo(() => {
    let totalRevenue = 0;
    let cashRevenue = 0;
    let cardRevenue = 0;
    let clickRevenue = 0;

    paidBillsHistory.forEach((o) => {
      const sum = Number(o.finalTotalPrice || o.totalPrice || 0);
      totalRevenue += sum;

      const method = String(o.paymentMethod || "naqd").toLowerCase();
      if (method === "karta") cardRevenue += sum;
      else if (method === "click" || method === "payme") clickRevenue += sum;
      else cashRevenue += sum;
    });

    return {
      totalRevenue,
      cashRevenue,
      cardRevenue,
      clickRevenue,
      paidCount: paidBillsHistory.length,
    };
  }, [paidBillsHistory]);

  // Qidiruv bo'yicha filtrlash
  const filteredActiveBills = useMemo(() => {
    if (!searchTerm.trim()) return activeBills;
    const term = searchTerm.toLowerCase();
    return activeBills.filter(
      (b) =>
        b.locationName.toLowerCase().includes(term) ||
        b.waiterName.toLowerCase().includes(term)
    );
  }, [activeBills, searchTerm]);

  // To'lov oynasini ochish
  const handleOpenCheckout = (bill) => {
    setCheckoutBill(bill);
    setPaymentMethod("naqd");
    setCashReceived("");
    setDiscountAmount(0);
    setHasServiceFee(true);
  };

  // Hisob-kitoblar (Modal uchun)
  const currentSubtotal = checkoutBill?.subtotal || 0;
  const currentServiceFee = hasServiceFee
    ? Math.round((currentSubtotal * servicePercent) / 100)
    : 0;
  const currentTotal = Math.max(0, currentSubtotal + currentServiceFee - Number(discountAmount || 0));
  const currentChange =
    paymentMethod === "naqd" && Number(cashReceived) > currentTotal
      ? Number(cashReceived) - currentTotal
      : 0;

  // To'lovni tasdiqlash va bazaga saqlash
  const handleConfirmPayment = async () => {
    if (!checkoutBill) return;

    if (paymentMethod === "naqd" && Number(cashReceived) < currentTotal) {
      alert("Mijoz bergan naqd summa jami to'lovdan kam bo'lishi mumkin emas!");
      return;
    }

    try {
      setIsProcessing(true);
      const paidTimestamp = new Date().toISOString();

      await Promise.all(
        checkoutBill.orderIds.map((orderId) =>
          updateDoc(doc(db, "orders", orderId), {
            status: "tolandi",
            paymentMethod,
            serviceFee: currentServiceFee,
            discount: Number(discountAmount || 0),
            finalTotalPrice: currentTotal,
            paidAt: paidTimestamp,
            cashierId: activeUser?.id || "cashier-1",
            cashierName: currentUserName,
          })
        )
      );

      // To'lov muvaffaqiyatli - Chek ma'lumotlarini chop etish uchun tayyorlash
      const receiptPayload = {
        locationName: checkoutBill.locationName,
        waiterName: checkoutBill.waiterName,
        cashierName: currentUserName,
        createdAt: paidTimestamp,
        itemsList: checkoutBill.itemsList,
        subtotal: currentSubtotal,
        servicePercent: hasServiceFee ? servicePercent : 0,
        serviceFee: currentServiceFee,
        discount: Number(discountAmount || 0),
        totalPrice: currentTotal,
        paymentMethod,
        cashReceived: Number(cashReceived) || currentTotal,
        change: currentChange,
        receiptNumber: generateReceiptNumber(),
      };

      setPrintReceiptData(receiptPayload);
      setIsReceiptOpen(true);
      setCheckoutBill(null);
    } catch (err) {
      console.error("To'lovni tasdiqlashda xato:", err);
      alert("To'lovni tasdiqlashda xatolik yuz berdi!");
    } finally {
      setIsProcessing(false);
    }
  };

  // Har qanday chekni to'g'ridan-to'g'ri chop etish
  const handleDirectPrint = (bill) => {
    const sub = bill.subtotal || bill.totalPrice || 0;
    const fee = Math.round(sub * 0.1);
    const tot = sub + fee;

    setPrintReceiptData({
      locationName: bill.locationName || getLocation(bill),
      waiterName: bill.waiterName || "Ofitsiant",
      cashierName: currentUserName,
      createdAt: bill.createdAt || bill.lastCreatedAt || new Date().toISOString(),
      itemsList: bill.itemsList || bill.items || [],
      subtotal: sub,
      servicePercent: 10,
      serviceFee: fee,
      discount: 0,
      totalPrice: tot,
      paymentMethod: bill.paymentMethod || "naqd",
      cashReceived: tot,
      change: 0,
      receiptNumber: generateReceiptNumber(),
    });
    setIsReceiptOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-slate-950 text-white flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white pb-20">
      {/* 1. Yuqori Kassir Navbari */}
      <KassirNavbar
        todayTotalRevenue={todayStats.totalRevenue}
        activeBillsCount={activeBills.length}
      />

      {/* 2. Asosiy Boshqaruv Paneli */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {/* Yuqori Tablar va Qidiruv */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Tablar: Faol Stollar | To'lovlar Tarixi | Kassa Statistikasi */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner w-full sm:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("faol")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "faol"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <UtensilsCrossed size={15} />
              <span>Faol hisoblar</span>
              {activeBills.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
                  {activeBills.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("tarix")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "tarix"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <History size={15} />
              <span>To'lovlar tarixi</span>
              {todayStats.paidCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black">
                  {todayStats.paidCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("statistika")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "statistika"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <TrendingUp size={15} />
              <span>Kassa balansi</span>
            </button>
          </div>

          {/* Qidiruv maydoni (faqat faol stollarda) */}
          {activeTab === "faol" && (
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Stol yoki ofitsiant qidirish..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        {/* 3. TABLAR TARKIBI */}

        {/* TAB 1: FAOL STOLLAR VA HISOB-KITOBLAR */}
        {activeTab === "faol" && (
          <div>
            {filteredActiveBills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredActiveBills.map((bill) => {
                  const estService = Math.round(bill.subtotal * 0.1);
                  const estTotal = bill.subtotal + estService;

                  return (
                    <div
                      key={bill.key}
                      className="w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800/90 hover:border-indigo-500/40 p-5 flex flex-col text-white rounded-3xl shadow-xl transition-all duration-200 group"
                    >
                      {/* Sarlavha: Manzil va Ofitsiant */}
                      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 shadow-inner group-hover:scale-105 transition-transform">
                            <Receipt size={20} />
                          </div>
                          <div>
                            <h3 className="font-mono text-base font-bold text-white tracking-tight">
                              {bill.locationName}
                            </h3>
                            <span className="text-[11px] text-slate-400 font-medium">
                              Ofitsiant: <strong className="text-slate-300">{bill.waiterName}</strong>
                            </span>
                          </div>
                        </div>

                        <span className="font-mono text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-xl">
                          To'lanmagan
                        </span>
                      </div>

                      {/* Taomlar va vaqt */}
                      <div className="mt-3.5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs text-slate-400 px-1">
                            <span className="flex items-center gap-1.5">
                              <Clock size={13} className="text-indigo-400" />
                              {formatTime(bill.firstCreatedAt)}
                              {bill.ordersCount > 1 && (
                                <span className="text-[10px] text-slate-500">
                                  (+{formatTime(bill.lastCreatedAt)})
                                </span>
                              )}
                            </span>
                            <span className="font-mono font-medium text-slate-400">
                              {bill.ordersCount} ta buyurtma jamlangan
                            </span>
                          </div>

                          {/* Taomlar ro'yxati (Scrollable) */}
                          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-900">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2 font-mono">
                              Buyurtma tarkibi ({bill.itemsList.length} taom)
                            </span>
                            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                              {bill.itemsList.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center text-xs py-1 px-2 rounded-lg bg-slate-900/40 hover:bg-slate-800/40"
                                >
                                  <div className="flex items-center gap-2 min-w-0 pr-2">
                                    <span className="font-mono font-bold text-amber-400 text-[11px]">
                                      {item.quantity}x
                                    </span>
                                    <span className="truncate text-slate-300">
                                      {item.name}
                                    </span>
                                  </div>
                                  <span className="font-mono text-slate-300 font-semibold shrink-0">
                                    {item.total.toLocaleString()} so'm
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Summa va To'lov Harakati */}
                        <div className="pt-3.5 border-t border-slate-800">
                          <div className="flex justify-between items-center px-1 mb-3">
                            <div>
                              <span className="text-[11px] text-slate-400 block font-mono">
                                Jami hisob (+10% xizmat):
                              </span>
                              <span className="text-xl font-black font-mono text-emerald-400">
                                {estTotal.toLocaleString()} so'm
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDirectPrint(bill)}
                              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                              title="Chekni oldindan ko'rish va chop etish"
                            >
                              <Printer size={18} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenCheckout(bill)}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-98"
                          >
                            <Banknote size={16} />
                            <span>To'lovni qabul qilish</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full max-w-md mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center text-slate-500 mt-10 rounded-3xl">
                <CheckCircle2 size={44} className="mb-3 text-emerald-400 opacity-60" />
                <h4 className="text-base font-bold text-slate-200">
                  Faol to'lanmagan hisoblar yo'q
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Barcha stollardagi buyurtmalar to'langan yoki hali yangi buyurtma berilmagan.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BUGUNGI TO'LOVLAR TARIXI */}
        {activeTab === "tarix" && (
          <div>
            {paidBillsHistory.length > 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Bugungi yopilgan hisoblar
                    </h3>
                    <p className="text-xs text-slate-400">
                      Jami {paidBillsHistory.length} ta buyurtma to'landi
                    </p>
                  </div>
                  <span className="font-mono text-sm font-black text-emerald-400">
                    {todayStats.totalRevenue.toLocaleString()} so'm
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60 overflow-x-auto">
                  {paidBillsHistory.map((order) => {
                    const method = String(order.paymentMethod || "naqd").toLowerCase();
                    const sum = Number(order.finalTotalPrice || order.totalPrice || 0);

                    return (
                      <div
                        key={order.id}
                        className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/20 transition text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            {method === "karta" ? (
                              <CreditCard size={18} />
                            ) : method === "click" ? (
                              <Smartphone size={18} />
                            ) : (
                              <Banknote size={18} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">
                              {getLocation(order)}
                            </h4>
                            <p className="text-slate-400 text-[11px]">
                              Ofitsiant: {order.waiterName || "Noma'lum"} &bull;{" "}
                              {formatTime(order.paidAt || order.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="capitalize font-mono text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                            {method === "karta"
                              ? "Karta"
                              : method === "click"
                              ? "Click / Payme"
                              : "Naqd pul"}
                          </span>
                          <span className="font-mono font-bold text-sm text-emerald-400">
                            {sum.toLocaleString()} so'm
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDirectPrint(order)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                            title="Chekni chop etish"
                          >
                            <Printer size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center text-slate-500 mt-10 rounded-3xl">
                <History size={44} className="mb-3 opacity-40" />
                <h4 className="text-base font-bold text-slate-200">
                  Bugun hali to'lov qabul qilinmadi
                </h4>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: KASSA BALANSI VA HISOBOTI */}
        {activeTab === "statistika" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Jami Savdo */}
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-bold font-mono uppercase">
                    Jami Tushum
                  </span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Coins size={18} />
                  </div>
                </div>
                <h2 className="text-2xl font-black font-mono text-white">
                  {todayStats.totalRevenue.toLocaleString()} so'm
                </h2>
                <span className="text-[11px] text-slate-500 font-mono mt-2">
                  Bugungi barcha to'lovlar
                </span>
              </div>

              {/* Naqd pul */}
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-bold font-mono uppercase">
                    Naqd Pulda
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Banknote size={18} />
                  </div>
                </div>
                <h2 className="text-2xl font-black font-mono text-emerald-400">
                  {todayStats.cashRevenue.toLocaleString()} so'm
                </h2>
                <span className="text-[11px] text-slate-500 font-mono mt-2">
                  Kassadagi naqd mablag'
                </span>
              </div>

              {/* Plastik karta */}
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-bold font-mono uppercase">
                    Plastik Karta
                  </span>
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <CreditCard size={18} />
                  </div>
                </div>
                <h2 className="text-2xl font-black font-mono text-cyan-400">
                  {todayStats.cardRevenue.toLocaleString()} so'm
                </h2>
                <span className="text-[11px] text-slate-500 font-mono mt-2">
                  Uzcard va Humo terminallari
                </span>
              </div>

              {/* Click / Payme */}
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-3">
                  <span className="text-xs font-bold font-mono uppercase">
                    Click / Payme
                  </span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Smartphone size={18} />
                  </div>
                </div>
                <h2 className="text-2xl font-black font-mono text-amber-400">
                  {todayStats.clickRevenue.toLocaleString()} so'm
                </h2>
                <span className="text-[11px] text-slate-500 font-mono mt-2">
                  Elektron to'lov tizimlari
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. TO'LOVNI QABUL QILISH MODALI (CHECKOUT MODAL) */}
      {checkoutBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col max-h-[92vh] overflow-y-auto">
            {/* Modal Sarlavhasi */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <Banknote size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">To'lovni qabul qilish</h3>
                  <p className="text-xs text-slate-400">{checkoutBill.locationName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutBill(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 my-4">
              {/* To'lov usuli tanlash */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase font-mono block mb-2">
                  To'lov usulini tanlang:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("naqd")}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition cursor-pointer ${
                      paymentMethod === "naqd"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Banknote size={20} />
                    <span className="text-xs">Naqd pul</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("karta")}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition cursor-pointer ${
                      paymentMethod === "karta"
                        ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <CreditCard size={20} />
                    <span className="text-xs">Karta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("click")}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition cursor-pointer ${
                      paymentMethod === "click"
                        ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Smartphone size={20} />
                    <span className="text-xs">Click/Payme</span>
                  </button>
                </div>
              </div>

              {/* Xizmat haqi va Chegirma sozlamalari */}
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasServiceFee}
                      onChange={(e) => setHasServiceFee(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                    />
                    <span>Xizmat haqi (+{servicePercent}%)</span>
                  </label>
                  <span className="font-mono text-xs font-bold text-slate-300">
                    {currentServiceFee.toLocaleString()} so'm
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-300">Chegirma (so'm):</span>
                  <input
                    type="number"
                    value={discountAmount || ""}
                    onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                    placeholder="0"
                    className="w-32 py-1 px-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-right text-rose-400 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Naqd pul kiritilganda qaytim kalkulyatori */}
              {paymentMethod === "naqd" && (
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300">
                      Mijoz bergan summa:
                    </label>
                    <button
                      type="button"
                      onClick={() => setCashReceived(String(currentTotal))}
                      className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                    >
                      Aniq summa
                    </button>
                  </div>

                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder={String(currentTotal)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />

                  {/* Tezkor kupyuralar */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[50000, 100000, 200000].map((nominal) => (
                      <button
                        key={nominal}
                        type="button"
                        onClick={() => setCashReceived(String(nominal))}
                        className="text-[10px] font-mono font-bold px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
                      >
                        +{nominal.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* Qaytim ko'rinishi */}
                  {Number(cashReceived) > currentTotal && (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                      <span className="text-xs font-bold text-slate-300">Qaytim:</span>
                      <span className="font-mono text-base font-black text-amber-400">
                        {currentChange.toLocaleString()} so'm
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Umumiy to'lov miqdori */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">
                  Jami To'lov:
                </span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {currentTotal.toLocaleString()} so'm
                </span>
              </div>
            </div>

            {/* Pastki tugmalar */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition cursor-pointer active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check size={18} />
                <span>{isProcessing ? "To'lanmoqda..." : "To'lovni tasdiqlash"}</span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutBill(null)}
                className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition cursor-pointer"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CHEKNI CHOP ETISH MODALI */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receiptData={printReceiptData}
      />
    </div>
  );
}
