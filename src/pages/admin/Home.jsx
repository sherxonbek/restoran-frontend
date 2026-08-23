import { Store, BadgeDollarSign, TicketX, TrendingUp } from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

function Home() {
  // 1. Bugungi kunlik ma'lumotlar oqimi (Soatlar kesimida)
  const bugungiData = [
    { vaqt: '09:00', savdo: 800, xarajat: 400 },
    { vaqt: '12:00', savdo: 2500, xarajat: 1200 },
    { vaqt: '15:00', savdo: 1800, xarajat: 900 },
    { vaqt: '18:00', savdo: 4500, xarajat: 2100 },
    { vaqt: '21:00', savdo: 3800, xarajat: 1500 },
    { vaqt: '23:00', savdo: 1200, xarajat: 600 },
  ]

  // 2. Bugungi umumiy KPI hisob-kitoblari
  const bugungiKpi = {
    buyurtmalar: 142,
    daromad: "14,600,000",
    bekorQilingan: "450,000",
    isrof: "280,000",
    o_sish: "+8.3%"
  }

  return (
    <div className="space-y-6 text-white pb-10">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/*buyurtmalar*/}
        <div className="flex flex-col border p-5 gap-4 rounded-2xl bg-white/10 backdrop-blur-md border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="text-blue-400" size={28} />
              <h3 className="text-sm font-semibold text-slate-200">Buyurtmalar</h3>
            </div>
            <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">Bajarilgan</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            {bugungiKpi.buyurtmalar} <span className="text-lg font-medium text-slate-400">ta</span>
          </h1>
        </div>

        {/* Kassa / Daromad */}
        <div className="flex flex-col border p-5 gap-4 rounded-2xl bg-white/10 backdrop-blur-md border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="text-emerald-400" size={28} />
              <h3 className="text-sm font-semibold text-slate-200">Kassa / Daromad</h3>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">{bugungiKpi.o_sish}</span>
          </div>
          <h1 className="text-3xl font-black text-emerald-400">
            {bugungiKpi.daromad} <span className="text-lg font-medium text-slate-400">so'm</span>
          </h1>
        </div>

        {/* Bekor qilingan */}
        <div className="flex flex-col border p-5 gap-4 rounded-2xl bg-white/10 backdrop-blur-md border-white/10 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TicketX className="text-rose-400" size={28} />
              <h3 className="text-sm font-semibold text-slate-200">Bekor qilingan</h3>
            </div>
            <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full">Yo'qotish</span>
          </div>
          <h1 className="text-3xl font-black text-rose-400">
            {bugungiKpi.bekorQilingan} <span className="text-lg font-medium text-slate-400">so'm</span>
          </h1>
        </div>

      </div>

      {/* 4. Bugungi kunlik grafik korinishi */}
      <div className="p-6 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold tracking-wide">Bugungi buyurtmalar</h3>
            <p className="text-xs text-slate-300">Kun davomidagi savdo va xarajat yuklamasi</p>
          </div>
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="h-64 w-full mt-6">
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

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

              <XAxis dataKey="vaqt" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '12px'
                }}
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

    </div>
  )
}

export default Home
