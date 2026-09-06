import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  TrendingUp,
  TrendingDown,
  CalendarDays,
  DollarSign,
  ShoppingBag,
  Users,
  Trash2,
  Utensils,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Flame,
  CheckCircle2,
  XCircle,
  Receipt,
  Wallet,
  Beef,
  Search,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatCurrency } from "@/utils/formatters";

// Sana parsing yordamchisi
const parseDate = (val) => {
  if (!val) return null;
  if (typeof val?.toDate === "function") return val.toDate();
  if (val?.seconds) return new Date(val.seconds * 1000);
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

// Qisqa raqam formatlagich (1.2 M, 45 k)
const formatShortNumber = (val) => {
  if (!val || isNaN(val)) return "0";
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)} B`;
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)} M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)} k`;
  return `${val}`;
};

// Kategoriya ranglari
const CATEGORY_COLORS = [
  "#10b981", // emerald
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#8b5cf6", // violet
  "#f43f5e", // rose
];

// Recharts uchun qora mavzudagi maxsus Tooltip
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3.5 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-slate-800 shadow-2xl text-xs space-y-2 min-w-[170px]">
        <p className="font-bold text-slate-300 border-b border-slate-800/80 pb-1.5 flex items-center gap-1.5">
          <CalendarDays size={14} className="text-emerald-400" />
          {label}
        </p>
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span
                className="w-2.5 h-2.5 rounded-full ring-2 ring-white/10"
                style={{ backgroundColor: item.color || item.fill }}
              />
              {item.name}:
            </span>
            <span className="font-bold text-white">
              {item.dataKey === "daromad" || item.dataKey === "savdo"
                ? `${Number(item.value).toLocaleString()} so'm`
                : `${item.value} ta`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function Statistika() {
  const [asosiyBolim, setAsosiyBolim] = useState("kirim"); // "kirim" | "chiqim"
  const [vaqtTuri, setVaqtTuri] = useState("hafta"); // "bugun" | "hafta" | "oy" | "yil"
  const [chiqimTuri, setChiqimTuri] = useState("barchasi"); // "barchasi" | "mahsulot" | "xodim" | "chiqindi"
  const [chiqimQidiruv, setChiqimQidiruv] = useState("");

  const { orders = [] } = useSelector((state) => state.orders);
  const { users = [] } = useSelector((state) => state.users);

  // 1. Vaqt oralig'i bo'yicha buyurtmalarni filtrlash
  const { grafikMaLumoti, filteredOrders, timeLabel } = useMemo(() => {
    const now = new Date();

    // A) BUGUN
    if (vaqtTuri === "bugun") {
      const todaySlots = [
        { kun: "09:00", minH: 0, maxH: 10, daromad: 0, buyurtmalar: 0 },
        { kun: "12:00", minH: 10, maxH: 13, daromad: 0, buyurtmalar: 0 },
        { kun: "15:00", minH: 13, maxH: 16, daromad: 0, buyurtmalar: 0 },
        { kun: "18:00", minH: 16, maxH: 19, daromad: 0, buyurtmalar: 0 },
        { kun: "21:00", minH: 19, maxH: 22, daromad: 0, buyurtmalar: 0 },
        { kun: "23:00", minH: 22, maxH: 24, daromad: 0, buyurtmalar: 0 },
      ];

      const bugungiOrders = orders.filter((o) => {
        const d = parseDate(o.createdAt);
        return (
          d &&
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });

      bugungiOrders.forEach((o) => {
        if (o.status === "bekor") return;
        const d = parseDate(o.createdAt);
        if (!d) return;
        const h = d.getHours();
        const slot = todaySlots.find((s) => h >= s.minH && h < s.maxH);
        if (slot) {
          slot.daromad += Number(o.totalPrice) || 0;
          slot.buyurtmalar += 1;
        }
      });

      return {
        grafikMaLumoti: todaySlots.map(({ kun, daromad, buyurtmalar }) => ({
          kun,
          daromad,
          buyurtmalar,
        })),
        filteredOrders: bugungiOrders,
        timeLabel: "Bugungi tahlil",
      };
    }

    // B) HAFTALIK (Dush - Yak)
    if (vaqtTuri === "hafta") {
      const currentDay = now.getDay();
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(now);
      monday.setDate(now.getDate() + distanceToMonday);
      monday.setHours(0, 0, 0, 0);

      const sundayEnd = new Date(monday);
      sundayEnd.setDate(monday.getDate() + 7);

      const weekDays = [
        { dayIndex: 1, kun: "Dushanba", qisqa: "Dush", daromad: 0, buyurtmalar: 0 },
        { dayIndex: 2, kun: "Seshanba", qisqa: "Sesh", daromad: 0, buyurtmalar: 0 },
        { dayIndex: 3, kun: "Chorshanba", qisqa: "Chor", daromad: 0, buyurtmalar: 0 },
        { dayIndex: 4, kun: "Payshanba", qisqa: "Pay", daromad: 0, buyurtmalar: 0 },
        { dayIndex: 5, kun: "Juma", qisqa: "Jum", daromad: 0, buyurtmalar: 0 },
        { dayIndex: 6, kun: "Shanba", qisqa: "Shan", daromad: 0, buyurtmalar: 0 },
        { dayIndex: 0, kun: "Yakshanba", qisqa: "Yak", daromad: 0, buyurtmalar: 0 },
      ];

      const haftalikOrders = orders.filter((o) => {
        const d = parseDate(o.createdAt);
        return d && d >= monday && d < sundayEnd;
      });

      haftalikOrders.forEach((o) => {
        if (o.status === "bekor") return;
        const d = parseDate(o.createdAt);
        if (!d) return;
        const day = d.getDay();
        const target = weekDays.find((w) => w.dayIndex === day);
        if (target) {
          target.daromad += Number(o.totalPrice) || 0;
          target.buyurtmalar += 1;
        }
      });

      return {
        grafikMaLumoti: weekDays.map(({ qisqa, daromad, buyurtmalar }) => ({
          kun: qisqa,
          daromad,
          buyurtmalar,
        })),
        filteredOrders: haftalikOrders,
        timeLabel: "Joriy hafta",
      };
    }

    // C) OYLIK (Haftalar kesimida)
    if (vaqtTuri === "oy") {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthWeeks = [
        { kun: "1-Hafta", daromad: 0, buyurtmalar: 0, minD: 1, maxD: 7 },
        { kun: "2-Hafta", daromad: 0, buyurtmalar: 0, minD: 8, maxD: 14 },
        { kun: "3-Hafta", daromad: 0, buyurtmalar: 0, minD: 15, maxD: 21 },
        { kun: "4-Hafta", daromad: 0, buyurtmalar: 0, minD: 22, maxD: 32 },
      ];

      const oylikOrders = orders.filter((o) => {
        const d = parseDate(o.createdAt);
        return d && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      oylikOrders.forEach((o) => {
        if (o.status === "bekor") return;
        const d = parseDate(o.createdAt);
        if (!d) return;
        const day = d.getDate();
        const target = monthWeeks.find((w) => day >= w.minD && day <= w.maxD);
        if (target) {
          target.daromad += Number(o.totalPrice) || 0;
          target.buyurtmalar += 1;
        }
      });

      return {
        grafikMaLumoti: monthWeeks.map(({ kun, daromad, buyurtmalar }) => ({
          kun,
          daromad,
          buyurtmalar,
        })),
        filteredOrders: oylikOrders,
        timeLabel: "Joriy oy",
      };
    }

    // D) YILLIK (Oylar kesimida)
    const currentYear = now.getFullYear();
    const months = [
      "Yan", "Fev", "Mar", "Apr", "May", "Iyun",
      "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"
    ];
    const yearMonths = months.map((nom) => ({
      kun: nom,
      daromad: 0,
      buyurtmalar: 0,
    }));

    const yillikOrders = orders.filter((o) => {
      const d = parseDate(o.createdAt);
      return d && d.getFullYear() === currentYear;
    });

    yillikOrders.forEach((o) => {
      if (o.status === "bekor") return;
      const d = parseDate(o.createdAt);
      if (!d) return;
      const m = d.getMonth();
      if (yearMonths[m]) {
        yearMonths[m].daromad += Number(o.totalPrice) || 0;
        yearMonths[m].buyurtmalar += 1;
      }
    });

    return {
      grafikMaLumoti: yearMonths,
      filteredOrders: yillikOrders,
      timeLabel: `${currentYear}-yil`,
    };
  }, [orders, vaqtTuri]);

  // 2. Asosiy KPI hisob-kitoblari
  const activeOrders = useMemo(
    () => filteredOrders.filter((o) => o.status !== "bekor"),
    [filteredOrders]
  );
  const cancelledOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === "bekor"),
    [filteredOrders]
  );

  const jamiDaromad = useMemo(() => {
    return activeOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
  }, [activeOrders]);

  const jamiBuyurtmalar = activeOrders.length;
  const bekorQilinganlarSoni = cancelledOrders.length;

  const ortachaChek = useMemo(() => {
    return jamiBuyurtmalar > 0 ? Math.round(jamiDaromad / jamiBuyurtmalar) : 0;
  }, [jamiDaromad, jamiBuyurtmalar]);

  // Taxminiy xarajat (35% xomashyo + xodimlar hissasi)
  const taxminiyXarajat = useMemo(() => {
    return Math.round(jamiDaromad * 0.38);
  }, [jamiDaromad]);

  const sofFoyda = useMemo(() => {
    return Math.max(0, jamiDaromad - taxminiyXarajat);
  }, [jamiDaromad, taxminiyXarajat]);

  const foydaMarjasi = useMemo(() => {
    if (!jamiDaromad) return "0%";
    return `${Math.round((sofFoyda / jamiDaromad) * 100)}%`;
  }, [jamiDaromad, sofFoyda]);

  // 3. Eng ko'p sotilgan taomlar tahlili (Top Dishes)
  const topTaomlar = useMemo(() => {
    const counts = {};
    activeOrders.forEach((o) => {
      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          const nom = item?.name?.trim() || "Noma'lum taom";
          const qty = Number(item?.quantity) || 1;
          const price = Number(item?.price) || 0;
          if (!counts[nom]) {
            counts[nom] = { name: nom, count: 0, revenue: 0 };
          }
          counts[nom].count += qty;
          counts[nom].revenue += price * qty;
        });
      }
    });

    const list = Object.values(counts).sort((a, b) => b.count - a.count);
    const maxCount = list[0]?.count || 1;

    return list.slice(0, 5).map((item, idx) => ({
      ...item,
      rank: idx + 1,
      percent: Math.round((item.count / maxCount) * 100),
    }));
  }, [activeOrders]);

  // 4. Kategoriyalar bo'yicha tushum taqsimoti (PieChart)
  const kategoriyaTaqsimoti = useMemo(() => {
    const cats = {};
    activeOrders.forEach((o) => {
      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          const category = (item?.category || "Asosiy taomlar").trim();
          const revenue = (Number(item?.price) || 0) * (Number(item?.quantity) || 1);
          cats[category] = (cats[category] || 0) + revenue;
        });
      }
    });

    const entries = Object.entries(cats);
    if (entries.length === 0) {
      return [
        { name: "Asosiy taomlar", value: jamiDaromad > 0 ? Math.round(jamiDaromad * 0.55) : 1000 },
        { name: "Ichimliklar", value: jamiDaromad > 0 ? Math.round(jamiDaromad * 0.25) : 500 },
        { name: "Fast-food", value: jamiDaromad > 0 ? Math.round(jamiDaromad * 0.20) : 300 },
      ];
    }

    return entries.map(([name, value]) => ({ name, value }));
  }, [activeOrders, jamiDaromad]);

  // 5. Chiqimlar (Xarajatlar) Ma'lumotlari
  const xarajatlarRoyxati = useMemo(() => {
    return [
      {
        id: "exp-1",
        turi: "mahsulot",
        nom: "🥩 Mol go'shti (Langar)",
        miqdor: "120 kg",
        birlikNarxi: "85,000 so'm",
        jami: 10200000,
        sana: "Bugun, 08:30",
        masul: "Oshpaz Elyor",
        status: "To'langan",
      },
      {
        id: "exp-2",
        turi: "mahsulot",
        nom: "🥔 Kartoshka va Sabzi",
        miqdor: "250 kg",
        birlikNarxi: "5,000 so'm",
        jami: 1250000,
        sana: "Kecha, 16:20",
        masul: "Ta'minotchi Akmal",
        status: "To'langan",
      },
      {
        id: "exp-3",
        turi: "mahsulot",
        nom: "🍶 O'simlik yog'i (Zilol)",
        miqdor: "60 litr",
        birlikNarxi: "18,000 so'm",
        jami: 1080000,
        sana: "3 kun oldin",
        masul: "Ta'minotchi Akmal",
        status: "To'langan",
      },
      {
        id: "exp-4",
        turi: "xodim",
        nom: "👨‍🍳 Chef Oshpaz oyligi",
        miqdor: "1 oylik",
        birlikNarxi: "8.5 M so'm",
        jami: 8500000,
        sana: "Joriy oy",
        masul: "Admin",
        status: "To'langan",
      },
      {
        id: "exp-5",
        turi: "xodim",
        nom: "🤵 Ofitsiantlar xizmat haqi (%)",
        miqdor: "Haftalik",
        birlikNarxi: "3.2 M so'm",
        jami: 3200000,
        sana: "Ushbu hafta",
        masul: "Kassir",
        status: "To'langan",
      },
      {
        id: "exp-6",
        turi: "chiqindi",
        nom: "🍅 Saralashdagi pomidor (Brak)",
        miqdor: "6 kg",
        birlikNarxi: "14,000 so'm",
        jami: 84000,
        sana: "Bugun, 10:15",
        masul: "Omborchi",
        status: "Spisanie",
      },
      {
        id: "exp-7",
        turi: "chiqindi",
        nom: "🥛 Muddati o'tgan qaymoq",
        miqdor: "4 banka",
        birlikNarxi: "22,000 so'm",
        jami: 88000,
        sana: "Kecha, 19:00",
        masul: "Konditer",
        status: "Spisanie",
      },
    ];
  }, []);

  const filtrlanganXarajatlar = useMemo(() => {
    return xarajatlarRoyxati.filter((x) => {
      const turiMos = chiqimTuri === "barchasi" || x.turi === chiqimTuri;
      const qidiruvMos =
        !chiqimQidiruv ||
        x.nom.toLowerCase().includes(chiqimQidiruv.toLowerCase()) ||
        x.masul.toLowerCase().includes(chiqimQidiruv.toLowerCase());
      return turiMos && qidiruvMos;
    });
  }, [xarajatlarRoyxati, chiqimTuri, chiqimQidiruv]);

  const jamiChiqimSummasi = useMemo(() => {
    return xarajatlarRoyxati.reduce((acc, curr) => acc + curr.jami, 0);
  }, [xarajatlarRoyxati]);

  const mahsulotChiqimSummasi = useMemo(() => {
    return xarajatlarRoyxati
      .filter((x) => x.turi === "mahsulot")
      .reduce((acc, curr) => acc + curr.jami, 0);
  }, [xarajatlarRoyxati]);

  const xodimChiqimSummasi = useMemo(() => {
    return xarajatlarRoyxati
      .filter((x) => x.turi === "xodim")
      .reduce((acc, curr) => acc + curr.jami, 0);
  }, [xarajatlarRoyxati]);

  const chiqindiChiqimSummasi = useMemo(() => {
    return xarajatlarRoyxati
      .filter((x) => x.turi === "chiqindi")
      .reduce((acc, curr) => acc + curr.jami, 0);
  }, [xarajatlarRoyxati]);

  return (
    <div className="p-4 sm:p-6 space-y-6 text-white pb-24 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* 1. Yuqori Hero & Navigatsiya Paneli */}
      <div className="relative p-5 sm:p-6 rounded-3xl bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 shadow-2xl overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Sahifa sarlavhasi */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1 tracking-wider uppercase">
              <Sparkles size={14} /> Moliya va Biznes Analitikasi
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Restoran Statistikasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Daromad, buyurtmalar oqimi va xarajatlar nazorati
            </p>
          </div>

          {/* Asosiy Switcher: Kirim & Chiqim */}
          <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => setAsosiyBolim("kirim")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                asosiyBolim === "kirim"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TrendingUp size={16} />
              Kirim & Savdo
            </button>
            <button
              type="button"
              onClick={() => setAsosiyBolim("chiqim")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                asosiyBolim === "chiqim"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TrendingDown size={16} />
              Chiqim & Xarajat
            </button>
          </div>
        </div>
      </div>

      {/* ===================== KIRIM VA SAVDO BO'LIMI ===================== */}
      {asosiyBolim === "kirim" && (
        <div className="space-y-6">
          {/* Vaqt oralig'i filtri (Tabs) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-300">
                Davr: <span className="text-emerald-400 font-bold">{timeLabel}</span>
              </span>
            </div>

            <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800">
              {[
                { id: "bugun", label: "Bugun" },
                { id: "hafta", label: "Haftalik" },
                { id: "oy", label: "Oylik" },
                { id: "yil", label: "Yillik" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setVaqtTuri(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    vaqtTuri === tab.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4 ta Zamonaviy KPI Kartochkalari */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Jami Daromad */}
            <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-emerald-500/40 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                  <DollarSign size={22} />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">
                  <ArrowUpRight size={13} /> Faol
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Jami Tushum
                </p>
                <h2 className="text-2xl font-black text-emerald-400 tracking-tight mt-0.5">
                  {formatCurrency(jamiDaromad)}
                </h2>
              </div>
            </div>

            {/* 2. Taxminiy Sof Foyda */}
            <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-indigo-500/40 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
                  <Wallet size={22} />
                </div>
                <span className="text-[11px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-full">
                  {foydaMarjasi} marja
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Sof Foyda (Taxminiy)
                </p>
                <h2 className="text-2xl font-black text-indigo-400 tracking-tight mt-0.5">
                  {formatCurrency(sofFoyda)}
                </h2>
              </div>
            </div>

            {/* 3. Buyurtmalar Soni */}
            <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-cyan-500/40 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
                  <ShoppingBag size={22} />
                </div>
                <span className="text-[11px] font-bold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full">
                  {bekorQilinganlarSoni} bekor
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Muvaffaqiyatli Buyurtmalar
                </p>
                <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                  {jamiBuyurtmalar}{" "}
                  <span className="text-xs font-normal text-slate-400">ta</span>
                </h2>
              </div>
            </div>

            {/* 4. O'rtacha Chek */}
            <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-amber-500/40 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                  <Receipt size={22} />
                </div>
                <span className="text-[11px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full">
                  Stol / Chek
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  O'rtacha Chek
                </p>
                <h2 className="text-2xl font-black text-amber-400 tracking-tight mt-0.5">
                  {formatCurrency(ortachaChek)}
                </h2>
              </div>
            </div>
          </div>

          {/* Asosiy Katta Grafik: Daromad va Buyurtmalar */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 size={18} className="text-emerald-400" />
                  Savdo va Buyurtmalar Dinamikasi
                </h3>
                <p className="text-xs text-slate-400">
                  Tanlangan davr bo'yicha tushum va buyurtmalar o'sishi
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-300 font-medium">Tushum (so'm)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-slate-300 font-medium">Buyurtmalar soni</span>
                </div>
              </div>
            </div>

            <div className="w-full overflow-x-auto scrollbar-thin">
              <div className="w-full h-[320px] sm:h-[360px] min-w-[550px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={grafikMaLumoti}
                    margin={{ top: 20, right: 15, left: -5, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorDaromad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="kun"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#334155" }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#10b981"
                      fontSize={11}
                      tickFormatter={formatShortNumber}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#6366f1"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="daromad"
                      name="daromad"
                      fill="url(#colorDaromad)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="daromad"
                      name="daromad"
                      fill="#10b981"
                      opacity={0.8}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={28}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="buyurtmalar"
                      name="buyurtmalar"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: "#6366f1", r: 3.5, strokeWidth: 2, stroke: "#0f172a" }}
                      activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 2 Ustunli Tahlil: Top Taomlar va Kategoriyalar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chap: Eng ko'p sotilgan taomlar */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Flame size={18} className="text-amber-400" />
                    Eng Xaridorgir Taomlar
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Top 5</span>
                </div>

                <div className="divide-y divide-slate-800/60 mt-2">
                  {topTaomlar.length > 0 ? (
                    topTaomlar.map((item) => (
                      <div key={item.name} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                              item.rank === 1
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : item.rank === 2
                                ? "bg-slate-300/20 text-slate-300 border border-slate-400/30"
                                : item.rank === 3
                                ? "bg-amber-700/20 text-amber-600 border border-amber-700/30"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {item.rank}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {item.count} ta buyurtma berilgan
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs sm:text-sm font-bold text-emerald-400">
                            {formatCurrency(item.revenue)}
                          </p>
                          <div className="w-20 bg-slate-800 rounded-full h-1.5 mt-1 ml-auto overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      Hozircha buyurtmalar mavjud emas
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* O'ng: Kategoriyalar bo'yicha daromad taqsimoti (Donut Chart) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PieChartIcon size={18} className="text-indigo-400" />
                  Kategoriyalar Taqsimoti
                </h3>
                <span className="text-xs text-slate-400 font-medium">Ulashish nisbati</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
                <div className="w-[180px] h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={kategoriyaTaqsimoti}
                        innerRadius={50}
                        outerRadius={78}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {kategoriyaTaqsimoti.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                            stroke="#0f172a"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => [`${Number(val).toLocaleString()} so'm`, "Tushum"]}
                        contentStyle={{
                          backgroundColor: "#020617",
                          borderColor: "#1e293b",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 w-full sm:w-auto">
                  {kategoriyaTaqsimoti.map((cat, idx) => (
                    <div key={cat.name} className="flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                          }}
                        />
                        <span className="text-slate-300 font-medium">{cat.name}</span>
                      </div>
                      <span className="text-slate-400 font-bold">
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== CHIQIM VA XARAJATLAR BO'LIMI ===================== */}
      {asosiyBolim === "chiqim" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Chiqimlar umumiy KPI kartochkalari */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-rose-500/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <TrendingDown size={22} />
                </div>
                <span className="text-[11px] font-bold bg-rose-500/10 text-rose-400 px-2.5 py-0.5 rounded-full">
                  Jami
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Jami Xarajatlar
                </p>
                <h2 className="text-2xl font-black text-rose-400 tracking-tight mt-0.5">
                  {formatCurrency(jamiChiqimSummasi)}
                </h2>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Beef size={22} />
                </div>
                <span className="text-[11px] font-bold bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full">
                  Xom-ashyo
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Mahsulotlar
                </p>
                <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                  {formatCurrency(mahsulotChiqimSummasi)}
                </h2>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Users size={22} />
                </div>
                <span className="text-[11px] font-bold bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full">
                  {users.length > 0 ? `${users.length} xodim` : "Xodimlar"}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Oylik Maoshlar
                </p>
                <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                  {formatCurrency(xodimChiqimSummasi)}
                </h2>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  <Trash2 size={22} />
                </div>
                <span className="text-[11px] font-bold bg-orange-500/10 text-orange-400 px-2.5 py-0.5 rounded-full">
                  Brak
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Chiqindi & Yo'qotish
                </p>
                <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
                  {formatCurrency(chiqindiChiqimSummasi)}
                </h2>
              </div>
            </div>
          </div>

          {/* Filtrlar va Qidiruv */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-xl">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "barchasi", label: "Barchasi" },
                { id: "mahsulot", label: "🥩 Mahsulotlar" },
                { id: "xodim", label: "👥 Oylik Maoshlar" },
                { id: "chiqindi", label: "🗑️ Brak & Chiqindi" },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setChiqimTuri(btn.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    chiqimTuri === btn.id
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-600/25"
                      : "bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={chiqimQidiruv}
                onChange={(e) => setChiqimQidiruv(e.target.value)}
                placeholder="Xarajat nomi yoki mas'ul..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          {/* Zamonaviy Xarajatlar Jadvali */}
          <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Xarajat Nomi</th>
                    <th className="p-4">Toifa</th>
                    <th className="p-4">Hajmi / Birligi</th>
                    <th className="p-4">Sana va Mas'ul</th>
                    <th className="p-4 text-right">Summasi</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-800/50">
                  {filtrlanganXarajatlar.length > 0 ? (
                    filtrlanganXarajatlar.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="p-4 font-bold text-white flex items-center gap-2.5">
                          {item.nom}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                              item.turi === "mahsulot"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : item.turi === "xodim"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {item.turi === "mahsulot"
                              ? "Mahsulot"
                              : item.turi === "xodim"
                              ? "Oylik"
                              : "Chiqindi"}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">
                          {item.miqdor}{" "}
                          <span className="text-[11px] text-slate-500">
                            ({item.birlikNarxi})
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300 font-medium">{item.sana}</p>
                          <p className="text-[10px] text-slate-500">{item.masul}</p>
                        </td>
                        <td className="p-4 text-right font-black text-rose-400 text-sm">
                          {formatCurrency(item.jami)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-slate-500 text-xs"
                      >
                        Mos keluvchi xarajatlar topilmadi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Statistika;
