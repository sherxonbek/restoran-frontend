import { useMemo } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Store,
  BadgeDollarSign,
  TicketX,
  TrendingUp,
  Receipt,
  Clock,
  ArrowUpRight,
  UtensilsCrossed
} from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts"
import { formatCurrency } from "@/utils/formatters"

const parseDate = (val) => {
  if (!val) return null
  if (typeof val?.toDate === "function") return val.toDate()
  if (val?.seconds) return new Date(val.seconds * 1000)
  const d = new Date(val)
  return isNaN(d.getTime()) ? null : d
}

const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

function Home() {
  const navigate = useNavigate()
  const { orders = [] } = useSelector((state) => state.orders)

  // Bugungi KPI va soatlar kesimidagi savdo tahlili
  const { bugungiKpi, bugungiData, recentOrders } = useMemo(() => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const todayOrders = orders.filter((o) => {
      const d = parseDate(o.createdAt)
      return d && isSameDay(d, today)
    })

    const yesterdayOrders = orders.filter((o) => {
      const d = parseDate(o.createdAt)
      return d && isSameDay(d, yesterday)
    })

    const activeTodayOrders = todayOrders.filter((o) => o.status !== "bekor")
    const cancelledTodayOrders = todayOrders.filter((o) => o.status === "bekor")

    const todayRevenue = activeTodayOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0)
    const todayCancelled = cancelledTodayOrders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0)

    const yesterdayActive = yesterdayOrders.filter((o) => o.status !== "bekor")
    const yesterdayRevenue = yesterdayActive.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0)

    let o_sish = "0%"
    if (yesterdayRevenue === 0 && todayRevenue > 0) {
      o_sish = "+100%"
    } else if (yesterdayRevenue > 0) {
      const diff = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      o_sish = `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`
    }

    const ortachaChek = activeTodayOrders.length > 0
      ? Math.round(todayRevenue / activeTodayOrders.length)
      : 0

    // 09:00, 12:00, 15:00, 18:00, 21:00, 23:00 soatlar bloklari
    const timeSlots = [
      { vaqt: '09:00', minH: 0, maxH: 10, savdo: 0, xarajat: 0 },
      { vaqt: '12:00', minH: 10, maxH: 13, savdo: 0, xarajat: 0 },
      { vaqt: '15:00', minH: 13, maxH: 16, savdo: 0, xarajat: 0 },
      { vaqt: '18:00', minH: 16, maxH: 19, savdo: 0, xarajat: 0 },
      { vaqt: '21:00', minH: 19, maxH: 22, savdo: 0, xarajat: 0 },
      { vaqt: '23:00', minH: 22, maxH: 24, savdo: 0, xarajat: 0 },
    ]

    activeTodayOrders.forEach((o) => {
      const d = parseDate(o.createdAt)
      if (!d) return
      const h = d.getHours()
      const price = Number(o.totalPrice) || 0
      const slot = timeSlots.find((s) => h >= s.minH && h < s.maxH)
      if (slot) {
        slot.savdo += price
        slot.xarajat += Math.round(price * 0.35)
      }
    })

    // So'nggi 5 ta buyurtma
    const sortedRecent = [...orders]
      .filter((o) => o.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    return {
      bugungiKpi: {
        buyurtmalar: activeTodayOrders.length,
        daromad: formatCurrency(todayRevenue),
        bekorQilingan: formatCurrency(todayCancelled),
        bekorQilinganCount: cancelledTodayOrders.length,
        ortachaChek: formatCurrency(ortachaChek),
        o_sish,
      },
      bugungiData: timeSlots.map(({ vaqt, savdo, xarajat }) => ({ vaqt, savdo, xarajat })),
      recentOrders: sortedRecent,
    }
  }, [orders])

  const formatOrderTime = (dateStr) => {
    const d = parseDate(dateStr)
    if (!d) return "--:--"
    return d.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "yangi":
        return { label: "Yangi", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" }
      case "bajarildi":
      case "yopildi":
        return { label: "Bajarildi", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }
      case "bekor":
        return { label: "Bekor", className: "bg-rose-500/10 text-rose-400 border-rose-500/20" }
      default:
        return { label: status || "Kutmoqda", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
    }
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 text-white pb-24 max-w-7xl mx-auto">

      {/* 1. 4 ta KPI Kartochkalari */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Kassa / Daromad */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-slate-700/80 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <BadgeDollarSign size={24} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bugungi Kassa</h3>
                <p className="text-[11px] text-slate-500">Sof tushum</p>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">
              {bugungiKpi.o_sish}
            </span>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              {bugungiKpi.daromad} <span className="text-sm font-medium text-slate-400">so'm</span>
            </h1>
          </div>
        </div>

        {/* Buyurtmalar */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-slate-700/80 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Store size={24} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Buyurtmalar</h3>
                <p className="text-[11px] text-slate-500">Muvaffaqiyatli</p>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full">
              Faol
            </span>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {bugungiKpi.buyurtmalar} <span className="text-sm font-medium text-slate-400">ta</span>
            </h1>
          </div>
        </div>

        {/* O'rtacha chek */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-slate-700/80 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Receipt size={24} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">O'rtacha Chek</h3>
                <p className="text-[11px] text-slate-500">1 buyurtmaga</p>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-full">
              O'rtacha
            </span>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">
              {bugungiKpi.ortachaChek} <span className="text-sm font-medium text-slate-400">so'm</span>
            </h1>
          </div>
        </div>

        {/* Bekor qilingan */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl hover:border-slate-700/80 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <TicketX size={24} />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bekor Qilingan</h3>
                <p className="text-[11px] text-slate-500">Yo'qotish miqdori</p>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded-full">
              {bugungiKpi.bekorQilinganCount} ta
            </span>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
              {bugungiKpi.bekorQilingan} <span className="text-sm font-medium text-slate-400">so'm</span>
            </h1>
          </div>
        </div>

      </div>

      {/* 2. Kunlik Savdo Grafigi */}
      <div className="p-5 sm:p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Kunlik buyurtmalar dinamikasi</h3>
              <p className="text-xs text-slate-400">Soatlar kesimida tushum va taxminiy xarajatlar yuklamasi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
              Bugungi tushum: <span className="text-emerald-400 font-bold">{bugungiKpi.daromad} so'm</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bugungiData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSavdo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorXarajat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

              <XAxis dataKey="vaqt" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderRadius: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  fontSize: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
                formatter={(value, name) => [
                  `${Number(value).toLocaleString("uz-UZ")} so'm`,
                  name === "Bugungi Savdo" ? "Savdo" : name === "Bugungi Xarajat" ? "Xarajat" : name,
                ]}
              />

              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
              />

              <Area
                type="monotone"
                dataKey="savdo"
                name="Bugungi Savdo"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorSavdo)"
                strokeWidth={2.5}
              />
              <Area
                type="monotone"
                dataKey="xarajat"
                name="Bugungi Xarajat"
                stroke="#F43F5E"
                fillOpacity={1}
                fill="url(#colorXarajat)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. So'nggi Buyurtmalar Bloki */}
      <div className="p-5 sm:p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">So'nggi buyurtmalar</h3>
              <p className="text-xs text-slate-400">Oxirgi qabul qilingan faol buyurtmalar holati</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/statistika")}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors p-1.5 rounded-lg hover:bg-indigo-500/10"
          >
            Statistika <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="mt-4">
          {recentOrders.length === 0 ? (
            <div className="py-10 text-center text-slate-500 flex flex-col items-center gap-2">
              <UtensilsCrossed size={32} className="opacity-40" />
              <p className="text-xs">Hozircha tizimda buyurtmalar mavjud emas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-800/60 text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-3">Joylashuv</th>
                    <th className="py-3 px-3">Taomlar</th>
                    <th className="py-3 px-3">Vaqt</th>
                    <th className="py-3 px-3">Holat</th>
                    <th className="py-3 px-3 text-right">Summa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-sm">
                  {recentOrders.map((o) => {
                    const badge = getStatusBadge(o.status)
                    const itemsPreview = o.items && Array.isArray(o.items)
                      ? o.items.map((i) => `${i.name} (${i.quantity}x)`).join(", ")
                      : "Taomlar kiritilmagan"

                    return (
                      <tr key={o.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-200">
                          {o.tableName || (o.tableId ? `Stol #${o.tableId}` : "Stol")}
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-400 max-w-[220px] truncate" title={itemsPreview}>
                          {itemsPreview}
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-slate-400">
                          {formatOrderTime(o.createdAt)}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                          {formatCurrency(o.totalPrice)} so'm
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Home
